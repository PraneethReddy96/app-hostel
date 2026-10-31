import http from 'node:http';
import {
  loadDatabaseState,
  saveDatabaseState,
  getDefaultCollections,
  createDatabaseBackup,
  getDatabaseStats
} from './database.js';

const PORT = process.env.PORT || 4000;

let dbState = loadDatabaseState();

// Connected SSE clients for instant cross-app sync
const sseClients = new Set();

const broadcastUpdate = () => {
  const payload = `data: ${JSON.stringify(dbState)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (e) {
      sseClients.delete(res);
    }
  }
};

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Server-Sent Events (SSE) stream for real-time cross-portal sync
  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify(dbState)}\n\n`);
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 2. Get full shared state
  if (req.method === 'GET' && url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dbState));
    return;
  }

  // 3. Get SQLite Database Stats & Health
  if (req.method === 'GET' && url.pathname === '/api/db-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getDatabaseStats()));
    return;
  }

  // 4. Trigger & Download Database Snapshot Backup
  if (req.method === 'POST' && url.pathname === '/api/backup') {
    const backup = createDatabaseBackup();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, backupFile: backup.backupFile, timestamp: backup.timestamp, data: backup.state }));
    return;
  }

  // 5. Update partial or full shared state in SQLite
  if ((req.method === 'POST' || req.method === 'PATCH') && url.pathname === '/api/state') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body || '{}');
        dbState = { ...dbState, ...updates };
        saveDatabaseState(dbState, 'PORTAL_SYNC');
        broadcastUpdate();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, state: dbState }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 6. Reset demo database
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    dbState = getDefaultCollections();
    saveDatabaseState(dbState, 'FACTORY_RESET');
    broadcastUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, state: dbState }));
    return;
  }

  // Healthcheck
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'JoyStay Shared Hostel SQLite Backend API',
      database: getDatabaseStats(),
      status: 'running',
      port: PORT,
      endpoints: ['/api/state', '/api/events', '/api/db-info', '/api/backup', '/api/reset']
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  const stats = getDatabaseStats();
  console.log(`\n======================================================`);
  console.log(`🚀 JoyStay SQLite Backend Server running on :${PORT}`);
  console.log(`   🗄️  Database:   ${stats.engine} (${stats.sizeKB} KB)`);
  console.log(`   📁 DB File:    ${stats.dbFilePath}`);
  console.log(`   ➜ API State:  http://localhost:${PORT}/api/state`);
  console.log(`   ➜ Live Sync:  http://localhost:${PORT}/api/events`);
  console.log(`======================================================\n`);
});
