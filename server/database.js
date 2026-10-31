import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import {
  initialStudents,
  initialRooms,
  initialFeeTransactions,
  initialMessMenu,
  initialLaundryOrders,
  initialComplaints,
  initialNotices,
  initialParcels,
  initialOutpasses,
  initialStaff,
  initialMessInventory,
  initialIncidents,
  initialVisitors,
  initialHostelSettings
} from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_PATH = path.join(DATA_DIR, 'joystay.sqlite');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency between Student App & Management App
db.exec(`PRAGMA journal_mode = WAL;`);
db.exec(`PRAGMA synchronous = NORMAL;`);

// Create relational tables for structured querying + collections store for rich objects
db.exec(`
  CREATE TABLE IF NOT EXISTS collections_store (
    collection_name TEXT PRIMARY KEY,
    json_payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    rollNo TEXT,
    name TEXT,
    room TEXT,
    bed TEXT,
    feeStatus TEXT,
    dueAmount INTEGER,
    raw_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rooms (
    roomNumber TEXT PRIMARY KEY,
    block TEXT,
    floor TEXT,
    type TEXT,
    ratePerMonth INTEGER,
    raw_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fee_transactions (
    id TEXT PRIMARY KEY,
    studentId TEXT,
    studentName TEXT,
    month TEXT,
    totalAmount INTEGER,
    paymentMode TEXT,
    status TEXT,
    raw_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    studentId TEXT,
    room TEXT,
    category TEXT,
    urgency TEXT,
    status TEXT,
    assignedStaffName TEXT,
    raw_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT
  );
`);

export const getDefaultCollections = () => ({
  students: initialStudents,
  rooms: initialRooms,
  feeTransactions: initialFeeTransactions,
  messMenu: initialMessMenu,
  laundryOrders: initialLaundryOrders,
  complaints: initialComplaints,
  notices: initialNotices,
  parcels: initialParcels,
  outpasses: initialOutpasses,
  staffList: initialStaff,
  messInventory: initialMessInventory,
  incidents: initialIncidents,
  visitors: initialVisitors,
  hostelSettings: initialHostelSettings,
  skippedMeals: {}
});

const syncRelationalTables = (state) => {
  try {
    db.exec('BEGIN TRANSACTION');

    if (Array.isArray(state.students)) {
      db.exec('DELETE FROM students');
      const stmt = db.prepare(
        'INSERT INTO students (id, rollNo, name, room, bed, feeStatus, dueAmount, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const s of state.students) {
        stmt.run(s.id, s.rollNo || '', s.name || '', s.room || '', s.bed || '', s.feeStatus || 'Due', Number(s.dueAmount || 0), JSON.stringify(s));
      }
    }

    if (Array.isArray(state.rooms)) {
      db.exec('DELETE FROM rooms');
      const stmt = db.prepare(
        'INSERT INTO rooms (roomNumber, block, floor, type, ratePerMonth, raw_json) VALUES (?, ?, ?, ?, ?, ?)'
      );
      for (const r of state.rooms) {
        stmt.run(r.roomNumber, r.block || '', r.floor || '', r.type || '', Number(r.ratePerMonth || 0), JSON.stringify(r));
      }
    }

    if (Array.isArray(state.feeTransactions)) {
      db.exec('DELETE FROM fee_transactions');
      const stmt = db.prepare(
        'INSERT INTO fee_transactions (id, studentId, studentName, month, totalAmount, paymentMode, status, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const t of state.feeTransactions) {
        stmt.run(t.id, t.studentId || '', t.studentName || '', t.month || '', Number(t.totalAmount || 0), t.paymentMode || '', t.status || '', JSON.stringify(t));
      }
    }

    if (Array.isArray(state.complaints)) {
      db.exec('DELETE FROM complaints');
      const stmt = db.prepare(
        'INSERT INTO complaints (id, studentId, room, category, urgency, status, assignedStaffName, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const c of state.complaints) {
        stmt.run(c.id, c.studentId || '', c.room || '', c.category || '', c.urgency || '', c.status || '', c.assignedStaffName || '', JSON.stringify(c));
      }
    }

    db.exec('COMMIT');
  } catch (e) {
    try { db.exec('ROLLBACK'); } catch (_) {}
    console.error('Relational sync warning:', e.message);
  }
};

export const loadDatabaseState = () => {
  const defaults = getDefaultCollections();
  const stmt = db.prepare('SELECT collection_name, json_payload FROM collections_store');
  const rows = stmt.all();

  if (rows.length === 0) {
    // Seed initial database
    saveDatabaseState(defaults, 'INITIAL_SEED');
    return defaults;
  }

  const state = { ...defaults };
  for (const row of rows) {
    try {
      state[row.collection_name] = JSON.parse(row.json_payload);
    } catch (e) {}
  }
  return state;
};

export const saveDatabaseState = (state, actionLabel = 'STATE_UPDATE') => {
  const now = new Date().toISOString();
  const upsert = db.prepare(`
    INSERT INTO collections_store (collection_name, json_payload, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(collection_name) DO UPDATE SET
      json_payload = excluded.json_payload,
      updated_at = excluded.updated_at
  `);

  db.exec('BEGIN TRANSACTION');
  try {
    for (const [key, value] of Object.entries(state)) {
      upsert.run(key, JSON.stringify(value), now);
    }
    const logStmt = db.prepare('INSERT INTO audit_logs (timestamp, action, details) VALUES (?, ?, ?)');
    logStmt.run(now, actionLabel, `Updated keys: ${Object.keys(state).join(', ')}`);
    db.exec('COMMIT');
  } catch (e) {
    try { db.exec('ROLLBACK'); } catch (_) {}
    console.error('SQLite save error:', e.message);
  }

  syncRelationalTables(state);
};

export const createDatabaseBackup = () => {
  const state = loadDatabaseState();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `joystay-backup-${stamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(state, null, 2), 'utf-8');
  return { backupFile, timestamp: new Date().toISOString(), state };
};

export const getDatabaseStats = () => {
  const stats = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : { size: 0 };
  const logCountRow = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
  return {
    engine: 'SQLite 3 (WAL Mode)',
    dbFilePath: DB_PATH,
    sizeKB: Math.round((stats.size / 1024) * 10) / 10,
    totalAuditLogs: logCountRow ? logCountRow.count : 0
  };
};

