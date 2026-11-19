const path = require('node:path');
const serverDirectory = path.dirname(require.resolve('./server.js'));
require('dotenv').config({ path: path.join(serverDirectory, '.env') });
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('node:crypto');
const express = require('express');
const { database, closeDatabase, databasePath } = require('./database');

const app = express();
const sessionLifetime = 30 * 24 * 60 * 60 * 1000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  database
    .prepare('INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), userId, Date.now() + sessionLifetime);
  return token;
}

function requireSession(request, response, next) {
  const authorization = request.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Faça login para continuar.' });
  }

  const tokenHash = hashToken(token);
  const user = database
    .prepare(
      `SELECT users.id, users.name, users.email, users.role, users.is_active
       FROM auth_sessions
       JOIN users ON users.id = auth_sessions.user_id
       WHERE auth_sessions.token_hash = ? AND auth_sessions.expires_at > ?`
    )
    .get(tokenHash, Date.now());

  if (!user || !user.is_active) {
    return response.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' });
  }

  request.user = user;
  request.tokenHash = tokenHash;
  return next();
}

function requireRole(role) {
  return (request, response, next) => {
    if (request.user.role !== role) {
      return response.status(403).json({ error: 'Você não tem permissão para esta ação.' });
    }
    return next();
  };
}

function publicStory(row) {
  return {
    id: `server:${row.id}`,
    titulo: row.title,
    destino: row.destination,
    historia: row.story,
    autor: row.author,
    imagem: row.image_url,
    pais: row.country,
    lugar: row.place,
    categoria: 'Viagem',
    dias: row.days,
    gastos: row.expenses,
    curtidas: 0,
  };
}

function readStory(id) {
  return database
    .prepare(
      `SELECT stories.id, stories.title, stories.destination, stories.story,
              stories.country, stories.place, stories.days, stories.expenses,
              stories.image_url, users.name AS author
       FROM stories
       JOIN users ON users.id = stories.user_id
       WHERE stories.id = ?`
    )
    .get(id);
}

app.get('/health', (_request, response) => {
  try {
    database.prepare('SELECT 1').get();
    response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Falha ao verificar o banco de dados:', error.message);
    response.status(503).json({ error: 'Banco de dados indisponível.' });
  }
});

app.post('/auth/register', async (request, response) => {
  const { name, email, phone, password } = request.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    !normalizedEmail.includes('@') ||
    typeof phone !== 'string' ||
    !/^\d+$/.test(phone.trim()) ||
    typeof password !== 'string' ||
    password.length < 6
  ) {
    return response.status(400).json({ error: 'Confira os dados e tente novamente.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    database.prepare(
      'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    ).run(name.trim(), normalizedEmail, phone.trim(), passwordHash);
    return response.status(201).json({ message: 'Cadastro realizado com sucesso.' });
  } catch (error) {
    if (error.code === 'ERR_SQLITE_ERROR' && error.errcode === 2067) {
      return response.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    console.error('Falha ao cadastrar usuário:', error.message);
    return response.status(500).json({ error: 'Não foi possível concluir o cadastro.' });
  }
});

async function loginWithRole(request, response, role) {
  const { email, password } = request.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || typeof password !== 'string' || !password) {
    return response.status(400).json({ error: 'Informe seu e-mail e sua senha.' });
  }

  try {
    const user = database
      .prepare(
        `SELECT id, name, email, phone, role, password_hash
         FROM users
         WHERE email = ? AND role = ? AND is_active = 1
         LIMIT 1`
      )
      .get(normalizedEmail, role);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    return response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: createSession(user.id),
    });
  } catch (error) {
    console.error('Falha ao autenticar usuário:', error.message);
    return response.status(500).json({ error: 'Não foi possível realizar o login.' });
  }
}

app.post('/auth/login', (request, response) =>
  loginWithRole(request, response, 'client')
);

app.post('/auth/admin/login', (request, response) =>
  loginWithRole(request, response, 'admin')
);

app.post('/auth/logout', requireSession, (request, response) => {
  database.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(request.tokenHash);
  return response.status(204).end();
});

app.get('/stories', (_request, response) => {
  const rows = database
    .prepare(
      `SELECT stories.id, stories.title, stories.destination, stories.story,
              stories.country, stories.place, stories.days, stories.expenses,
              stories.image_url, users.name AS author
       FROM stories
       JOIN users ON users.id = stories.user_id
       ORDER BY stories.created_at DESC, stories.id DESC`
    )
    .all();
  return response.json({ stories: rows.map(publicStory) });
});

app.post('/stories', requireSession, requireRole('client'), (request, response) => {
  const {
    titulo,
    destino,
    pais,
    lugar,
    historia,
    dias,
    gastos,
    imagem,
  } = request.body || {};

  if (
    typeof titulo !== 'string' || !titulo.trim() || titulo.length > 120 ||
    typeof destino !== 'string' || !destino.trim() || destino.length > 160 ||
    typeof pais !== 'string' || !pais.trim() || pais.length > 80 ||
    typeof lugar !== 'string' || !lugar.trim() || lugar.length > 100 ||
    typeof historia !== 'string' || !historia.trim() || historia.length > 4000
  ) {
    return response.status(400).json({ error: 'Confira os dados da história.' });
  }

  const imageUrl =
    typeof imagem === 'string' && /^https?:\/\//i.test(imagem) && imagem.length <= 2048
      ? imagem
      : null;

  try {
    const result = database
      .prepare(
        `INSERT INTO stories
         (user_id, title, destination, country, place, story, days, expenses, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        request.user.id,
        titulo.trim(),
        destino.trim(),
        pais.trim(),
        lugar.trim(),
        historia.trim(),
        typeof dias === 'string' ? dias.slice(0, 20) : '1',
        typeof gastos === 'string' ? gastos.slice(0, 20) : '0',
        imageUrl
      );
    return response.status(201).json({ story: publicStory(readStory(result.lastInsertRowid)) });
  } catch (error) {
    console.error('Falha ao publicar história:', error.message);
    return response.status(500).json({ error: 'Não foi possível publicar a história.' });
  }
});

app.get('/admin/users', requireSession, requireRole('admin'), (_request, response) => {
  const users = database
    .prepare(
      `SELECT id, name, email, phone, is_active AS active, created_at AS createdAt
       FROM users WHERE role = 'client'
       ORDER BY created_at DESC, id DESC`
    )
    .all();
  return response.json({ users });
});

app.patch(
  '/admin/users/:id/active',
  requireSession,
  requireRole('admin'),
  (request, response) => {
    const userId = Number(request.params.id);
    const { active } = request.body || {};

    if (!Number.isSafeInteger(userId) || userId < 1 || typeof active !== 'boolean') {
      return response.status(400).json({ error: 'Informe um usuário e um estado válidos.' });
    }

    const result = database
      .prepare("UPDATE users SET is_active = ? WHERE id = ? AND role = 'client'")
      .run(active ? 1 : 0, userId);

    if (result.changes === 0) {
      return response.status(404).json({ error: 'Cliente não encontrado.' });
    }

    if (!active) {
      database.prepare('DELETE FROM auth_sessions WHERE user_id = ?').run(userId);
    }
    return response.json({ id: userId, active });
  }
);

app.get('/admin/stories', requireSession, requireRole('admin'), (_request, response) => {
  const stories = database
    .prepare(
      `SELECT stories.id, stories.title, stories.destination, stories.country,
              stories.place, stories.story, stories.created_at AS createdAt,
              users.name AS author, users.email AS authorEmail
       FROM stories
       JOIN users ON users.id = stories.user_id
       ORDER BY stories.created_at DESC, stories.id DESC`
    )
    .all();
  return response.json({ stories });
});

app.delete(
  '/admin/stories/:id',
  requireSession,
  requireRole('admin'),
  (request, response) => {
    const storyId = Number(request.params.id);
    if (!Number.isSafeInteger(storyId) || storyId < 1) {
      return response.status(400).json({ error: 'Informe uma história válida.' });
    }

    const result = database.prepare('DELETE FROM stories WHERE id = ?').run(storyId);
    if (result.changes === 0) {
      return response.status(404).json({ error: 'História não encontrada.' });
    }
    return response.status(204).end();
  }
);

async function start() {
  database.prepare('SELECT 1').get();
  const port = Number(process.env.PORT || 3001);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`API Vooa disponível na porta ${port}.`);
  });
  return server;
}

if (require.main === module) {
  start()
    .then((server) => {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () => {
          server.close(() => closeDatabase());
        });
      }
    })
    .catch((error) => {
      console.error(
        `Não foi possível iniciar a API ou abrir o SQLite em ${databasePath}:`,
        error.message
      );
      process.exitCode = 1;
    });
}

module.exports = { app, start };
