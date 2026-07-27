/**
 * SQLite database connection + schema.
 * Uses sql.js (pure JavaScript/WASM SQLite with zero native dependencies).
 * Provides a better-sqlite3 compatible API: db.prepare(sql).get/all/run() and db.exec().
 */
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'school.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS news (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  excerpt    TEXT NOT NULL,
  body       TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'News',
  image      TEXT,
  author     TEXT NOT NULL DEFAULT 'School Admin',
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  location    TEXT NOT NULL,
  starts_at   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS staff (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  department TEXT NOT NULL,
  bio        TEXT,
  photo      TEXT,
  email      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS students (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  admission_no  TEXT NOT NULL UNIQUE,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  class_level   TEXT NOT NULL,
  gender        TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admissions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name   TEXT NOT NULL,
  date_of_birth  TEXT NOT NULL,
  gender         TEXT NOT NULL,
  class_applying TEXT NOT NULL,
  parent_name    TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT,
  previous_school TEXT,
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  body       TEXT NOT NULL,
  handled    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  caption    TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Campus',
  image      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// ---------------------------------------------------------------------------
// Async initialisation — resolves once the WASM engine is ready.
// If code tries to use the DB before init completes, it is queued.
// ---------------------------------------------------------------------------
let _db = null;
let _ready = false;
const _queue = [];

const SQL_JS_DIR = path.dirname(require.resolve('sql.js'));

async function _init() {
  try {
    const SQL = await initSqlJs({
      locateFile: (file) => path.join(SQL_JS_DIR, file),
    });
    if (fs.existsSync(DB_PATH)) {
      const buf = fs.readFileSync(DB_PATH);
      _db = new SQL.Database(buf);
    } else {
      _db = new SQL.Database();
      _db.run('PRAGMA foreign_keys = ON');
      _db.run(SCHEMA);
      _save();
    }
  } catch (err) {
    console.error('Failed to initialise sql.js:', err);
    process.exit(1);
  }
  _ready = true;
  // Flush any queued operations
  for (const fn of _queue) fn();
}

function _save() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

_init();

// ---------------------------------------------------------------------------
// better-sqlite3 compatible wrapper via Proxy
// ---------------------------------------------------------------------------
function _ensure() {
  if (_ready) return true;
  // Block until init finishes — used in promise chains or by waiting callers
  throw new Error('Database not initialised yet');
}

const db = new Proxy({}, {
  get(_, prop) {
    if (prop === 'ready') return _ready ? Promise.resolve() : new Promise((resolve) => _queue.push(resolve));
    if (prop === 'prepare') {
      return (sql) => ({
        get: (...params) => {
          _ensure();
          const stmt = _db.prepare(sql);
          if (params.length) stmt.bind(params);
          let row;
          if (stmt.step()) row = stmt.getAsObject();
          stmt.free();
          return row;
        },
        all: (...params) => {
          _ensure();
          const stmt = _db.prepare(sql);
          if (params.length) stmt.bind(params);
          const rows = [];
          while (stmt.step()) rows.push(stmt.getAsObject());
          stmt.free();
          return rows;
        },
        run: (...params) => {
          _ensure();
          const stmt = _db.prepare(sql);
          if (params.length) stmt.bind(params);
          stmt.step();
          stmt.free();
          const lastInsertRowid = _db.exec("SELECT last_insert_rowid()")[0].values[0][0];
          const changes = _db.getRowsModified();
          _save();
          return { lastInsertRowid, changes };
        },
      });
    }
    if (prop === 'exec') {
      return (sql) => {
        _ensure();
        const r = _db.exec(sql);
        if (sql.trim().toUpperCase().startsWith('SELECT') === false) _save();
        return r;
      };
    }
    if (prop === 'pragma') {
      return (str) => {
        _ensure();
        _db.run(`PRAGMA ${str}`);
      };
    }
  },
});

module.exports = db;
