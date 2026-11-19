const path = require('node:path');
const seedDirectory = path.dirname(require.resolve('./seed-admin.js'));
require('dotenv').config({ path: path.join(seedDirectory, '.env') });
const bcrypt = require('bcryptjs');
const { database, closeDatabase } = require('./database');

async function seedAdmin() {
  const email =
    typeof process.env.ADMIN_EMAIL === 'string'
      ? process.env.ADMIN_EMAIL.trim().toLowerCase()
      : '';
  const password = process.env.ADMIN_PASSWORD;

  if (!email.includes('@') || typeof password !== 'string' || password.length < 12) {
    throw new Error(
      'Configure ADMIN_EMAIL e uma ADMIN_PASSWORD com pelo menos 12 caracteres em server/.env.'
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  database.exec('BEGIN IMMEDIATE');

  try {
    database
      .prepare(
        `INSERT INTO users (name, email, phone, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, 'admin', 1)
         ON CONFLICT(email) DO UPDATE SET
           name = excluded.name,
           phone = excluded.phone,
           password_hash = excluded.password_hash,
           role = 'admin',
           is_active = 1`
      )
      .run(process.env.ADMIN_NAME?.trim() || 'Administrador', email, '00000000000', passwordHash);

    const admin = database.prepare('SELECT id FROM users WHERE email = ?').get(email);
    database.prepare('DELETE FROM auth_sessions WHERE user_id = ?').run(admin.id);
    database.exec('COMMIT');
    console.log(`Conta de administrador criada/atualizada: ${email}`);
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

seedAdmin()
  .catch((error) => {
    console.error('Não foi possível criar a conta de administrador:', error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    closeDatabase();
  });
