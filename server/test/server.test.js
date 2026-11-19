const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const test = require('node:test');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'vooa-api-'));
const databasePath = path.join(temporaryDirectory, 'test.sqlite');
process.env.DB_PATH = databasePath;

const { app } = require('../server');
const { database, closeDatabase } = require('../database');

test('client/admin auth, story moderation, and SQLite persistence', async (t) => {
  const adminPassword = 'admin-password-123';
  const passwordHash = await bcrypt.hash(adminPassword, 4);
  database
    .prepare(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES (?, ?, ?, ?, 'admin')`
    )
    .run('Administrador', 'admin@example.com', '11999999999', passwordHash);

  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  const apiUrl = `http://127.0.0.1:${port}`;
  const post = (route, body, token) =>
    fetch(`${apiUrl}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    closeDatabase();
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  const healthResponse = await fetch(`${apiUrl}/health`);
  assert.equal(healthResponse.status, 200);

  const registrationResponse = await post('/auth/register', {
    name: 'Pessoa Teste',
    email: '  TESTE@EXAMPLE.COM ',
    phone: '11999999999',
    password: 'senha-segura',
    role: 'admin',
  });
  assert.equal(registrationResponse.status, 201);

  const duplicateResponse = await post('/auth/register', {
    name: 'Pessoa Teste',
    email: 'teste@example.com',
    phone: '11999999999',
    password: 'senha-segura',
  });
  assert.equal(duplicateResponse.status, 409);

  const clientLoginResponse = await post('/auth/login', {
    email: 'teste@example.com',
    password: 'senha-segura',
  });
  assert.equal(clientLoginResponse.status, 200);
  const clientSession = await clientLoginResponse.json();
  assert.equal(clientSession.user.role, 'client');
  assert.equal(typeof clientSession.token, 'string');

  const adminLoginWithClientResponse = await post('/auth/admin/login', {
    email: 'teste@example.com',
    password: 'senha-segura',
  });
  assert.equal(adminLoginWithClientResponse.status, 401);
  assert.equal((await fetch(`${apiUrl}/admin/users`)).status, 401);

  const createStoryResponse = await post(
    '/stories',
    {
      titulo: 'Viagem de teste',
      destino: 'Rio de Janeiro',
      pais: 'Brasil',
      lugar: 'Rio de Janeiro',
      historia: 'Uma história publicada para testar a moderação.',
    },
    clientSession.token
  );
  assert.equal(createStoryResponse.status, 201);
  const publishedStory = (await createStoryResponse.json()).story;
  assert.equal(publishedStory.autor, 'Pessoa Teste');

  const adminLoginResponse = await post('/auth/admin/login', {
    email: 'admin@example.com',
    password: adminPassword,
  });
  assert.equal(adminLoginResponse.status, 200);
  const adminSession = await adminLoginResponse.json();
  assert.equal(adminSession.user.role, 'admin');

  const clientCannotReadAdminResponse = await fetch(`${apiUrl}/admin/users`, {
    headers: { Authorization: `Bearer ${clientSession.token}` },
  });
  assert.equal(clientCannotReadAdminResponse.status, 403);

  const adminUsersResponse = await fetch(`${apiUrl}/admin/users`, {
    headers: { Authorization: `Bearer ${adminSession.token}` },
  });
  const adminUsers = await adminUsersResponse.json();
  assert.equal(adminUsers.users.length, 1);
  assert.equal(adminUsers.users[0].email, 'teste@example.com');

  const adminStoriesResponse = await fetch(`${apiUrl}/admin/stories`, {
    headers: { Authorization: `Bearer ${adminSession.token}` },
  });
  const adminStories = await adminStoriesResponse.json();
  assert.equal(adminStories.stories[0].authorEmail, 'teste@example.com');

  const blockClientResponse = await fetch(
    `${apiUrl}/admin/users/${adminUsers.users[0].id}/active`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminSession.token}`,
      },
      body: JSON.stringify({ active: false }),
    }
  );
  assert.equal(blockClientResponse.status, 200);

  const blockedLoginResponse = await post('/auth/login', {
    email: 'teste@example.com',
    password: 'senha-segura',
  });
  assert.equal(blockedLoginResponse.status, 401);

  const deleteStoryResponse = await fetch(
    `${apiUrl}/admin/stories/${adminStories.stories[0].id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminSession.token}` },
    }
  );
  assert.equal(deleteStoryResponse.status, 204);
  assert.equal((await (await fetch(`${apiUrl}/stories`)).json()).stories.length, 0);

  const logoutResponse = await post('/auth/logout', {}, adminSession.token);
  assert.equal(logoutResponse.status, 204);
  assert.equal(
    (
      await fetch(`${apiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${adminSession.token}` },
      })
    ).status,
    401
  );

  const persistedDatabase = new DatabaseSync(databasePath);
  assert.equal(
    persistedDatabase.prepare('SELECT email FROM users WHERE email = ?').get('admin@example.com')
      .email,
    'admin@example.com'
  );
  persistedDatabase.close();
});
