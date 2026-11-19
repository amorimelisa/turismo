const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const serverDirectory = path.dirname(require.resolve('./database.js'));
const configuredPath = process.env.DB_PATH || 'data/vooa.sqlite';
const databasePath =
  configuredPath === ':memory:'
    ? configuredPath
    : path.resolve(serverDirectory, configuredPath);

if (databasePath !== ':memory:') {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

const database = new DatabaseSync(databasePath);
database.exec(
  'PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;'
);
database.exec(fs.readFileSync(path.join(serverDirectory, 'database.sql'), 'utf8'));

const userColumns = new Set(
  database.prepare('PRAGMA table_info(users)').all().map((column) => column.name)
);

if (!userColumns.has('role')) {
  database.exec(
    "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin'))"
  );
}

if (!userColumns.has('is_active')) {
  database.exec(
    'ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))'
  );
}

module.exports = {
  database,
  databasePath,
  closeDatabase: () => database.close(),
};
