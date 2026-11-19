const path = require('node:path');
const seedDirectory = path.dirname(require.resolve('./seed.js'));
require('dotenv').config({ path: path.join(seedDirectory, '.env') });
const bcrypt = require('bcryptjs');
const { database, closeDatabase } = require('./database');

async function seedDemoUser() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('A conta de demonstração não pode ser criada em produção.');
  }

  const passwordHash = await bcrypt.hash('123456', 12);
  database
    .prepare(
      `INSERT INTO users (name, email, phone, password_hash)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         name = excluded.name,
         phone = excluded.phone,
         password_hash = excluded.password_hash`
    )
    .run('Julia', 'julia@gmail.com', '11999999999', passwordHash);
  console.log('Conta de demonstração criada/atualizada: julia@gmail.com');
}

seedDemoUser().catch((error) => {
  console.error('Não foi possível criar a conta de demonstração:', error.message);
  process.exitCode = 1;
}).finally(() => {
  closeDatabase();
});
