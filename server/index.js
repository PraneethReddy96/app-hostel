import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadDatabaseState,
  saveDatabaseState,
  getDefaultCollections,
  createDatabaseBackup,
  getDatabaseStats
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const API_PORT = Number(process.env.PORT || 4000);
const STUDENT_PORT = 5173;
const MANAGEMENT_PORT = 5174;

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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Shared API request handler used by :4000, :5173, and :5174
const handleApiRequest = (req, res, url) => {
  // 1. Server-Sent Events (SSE) stream for real-time cross-portal sync
  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.write(`data: ${JSON.stringify(dbState)}\n\n`);
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return true;
  }

  // 2. Get full shared state
  if (req.method === 'GET' && url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dbState));
    return true;
  }

  // 3. Get SQLite Database Stats & Health
  if (req.method === 'GET' && url.pathname === '/api/db-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getDatabaseStats()));
    return true;
  }

  // 4. Trigger & Download Database Snapshot Backup
  if (req.method === 'POST' && url.pathname === '/api/backup') {
    const backup = createDatabaseBackup();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, backupFile: backup.backupFile, timestamp: backup.timestamp, data: backup.state }));
    return true;
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
    return true;
  }

  // 6. Reset demo database
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    dbState = getDefaultCollections();
    saveDatabaseState(dbState, 'FACTORY_RESET');
    broadcastUpdate();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, state: dbState }));
    return true;
  }

  return false;
};

// Static SPA server factory (for Student App :5173 and Management App :5174)
const createPortalServer = (distDir) => {
  return http.createServer((req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // Handle /api/* directly on the portal server so remote phones & tunnels work with zero CORS/proxy issues
    if (url.pathname.startsWith('/api/')) {
      if (handleApiRequest(req, res, url)) return;
    }

    // Serve static files from distDir
    let safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
      safePath = '/index.html';
    }

    let filePath = path.join(distDir, safePath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });
};

// Dedicated API server on :4000
const apiServer = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (handleApiRequest(req, res, url)) return;

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'JoyStay Shared Hostel SQLite Backend API',
      database: getDatabaseStats(),
      status: 'running',
      port: API_PORT,
      endpoints: ['/api/state', '/api/events', '/api/db-info', '/api/backup', '/api/reset']
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

apiServer.listen(API_PORT, '0.0.0.0', () => {
  const stats = getDatabaseStats();
  console.log(`\n======================================================`);
  console.log(`🚀 JoyStay SQLite Backend Server running on :${API_PORT}`);
  console.log(`   🗄️  Database:   ${stats.engine} (${stats.sizeKB} KB)`);
  console.log(`   📁 DB File:    ${stats.dbFilePath}`);
  console.log(`   ➜ API State:  http://localhost:${API_PORT}/api/state`);
  console.log(`   ➜ Live Sync:  http://localhost:${API_PORT}/api/events`);
  console.log(`======================================================`);
});

// Start Student Portal Server (:5173) and Management ERP Server (:5174) if built
const studentDist = path.join(rootDir, 'student-app', 'dist');
const managementDist = path.join(rootDir, 'management-app', 'dist');

if (fs.existsSync(studentDist)) {
  const studentServer = createPortalServer(studentDist);
  studentServer.listen(STUDENT_PORT, '0.0.0.0', () => {
    console.log(`📱 Student App Server live at:      http://localhost:${STUDENT_PORT}`);
  });
}

if (fs.existsSync(managementDist)) {
  const managementServer = createPortalServer(managementDist);
  managementServer.listen(MANAGEMENT_PORT, '0.0.0.0', () => {
    console.log(`🏢 Management ERP Server live at:   http://localhost:${MANAGEMENT_PORT}`);
  });
}
