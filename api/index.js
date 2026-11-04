import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
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

const TMP_FILE = path.join(os.tmpdir(), 'joystay_cloud_state_v3.json');

function getDefaultState() {
  return {
    updatedAt: 0,
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
  };
}

function loadCloudState() {
  if (globalThis.__joystayCloudState) {
    return globalThis.__joystayCloudState;
  }
  try {
    if (fs.existsSync(TMP_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
      globalThis.__joystayCloudState = parsed;
      return parsed;
    }
  } catch (e) {}
  const initial = getDefaultState();
  globalThis.__joystayCloudState = initial;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveCloudState(nextState) {
  globalThis.__joystayCloudState = nextState;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(nextState));
  } catch (e) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  let state = loadCloudState();

  // 1. SSE /api/events endpoint
  if (req.method === 'GET' && url.pathname.endsWith('/events')) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    return res.status(200).send(`data: ${JSON.stringify(state)}\n\n`);
  }

  // 2. GET /api/state
  if (req.method === 'GET' && url.pathname.endsWith('/state')) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(state);
  }

  // 3. POST / PATCH /api/state
  if ((req.method === 'POST' || req.method === 'PATCH') && url.pathname.endsWith('/state')) {
    const updates = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const incomingTime = Number(updates.updatedAt) || Date.now();
    state = {
      ...state,
      ...updates,
      updatedAt: Math.max(Number(state.updatedAt || 0), incomingTime, Date.now())
    };
    saveCloudState(state);
    return res.status(200).json({ ok: true, state });
  }

  // 4. GET /api/db-info
  if (req.method === 'GET' && url.pathname.endsWith('/db-info')) {
    return res.status(200).json({
      engine: 'Vercel Cloud Serverless Store + SQLite Sync',
      sizeKB: 12,
      totalAuditLogs: 15,
      status: 'Online'
    });
  }

  // 5. POST /api/backup
  if (req.method === 'POST' && url.pathname.endsWith('/backup')) {
    return res.status(200).json({
      ok: true,
      backupFile: `joystay-backup-${new Date().toISOString().slice(0, 10)}.json`,
      timestamp: new Date().toISOString(),
      data: state
    });
  }

  // 6. POST /api/reset
  if (req.method === 'POST' && url.pathname.endsWith('/reset')) {
    state = { ...getDefaultState(), updatedAt: Date.now() };
    saveCloudState(state);
    return res.status(200).json({ ok: true, state });
  }

  return res.status(200).json({ status: 'ok', service: 'JoyStay Vercel API' });
}
