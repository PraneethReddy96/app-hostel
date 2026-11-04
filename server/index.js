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
const IS_CLOUD_PORT = Boolean(process.env.PORT && Number(process.env.PORT) !== 4000);

const studentDist = path.join(rootDir, 'student-app', 'dist');
const managementDist = path.join(rootDir, 'management-app', 'dist');

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

const serveStaticFromDir = (distDir, subPath, res) => {
  let safePath = path.normalize(decodeURIComponent(subPath || '/')).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\' || safePath === '.') {
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
};

// Shared API request handler used by :4000, :5173, :5174, and Cloud Server
const handleApiRequest = (req, res, url) => {
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

  if (req.method === 'GET' && url.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dbState));
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/api/db-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getDatabaseStats()));
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/api/backup') {
    const backup = createDatabaseBackup();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, backupFile: backup.backupFile, timestamp: backup.timestamp, data: backup.state }));
    return true;
  }

  if ((req.method === 'POST' || req.method === 'PATCH') && url.pathname === '/api/state') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body || '{}');
        const incomingTime = Number(updates.updatedAt) || Date.now();
        dbState = {
          ...dbState,
          ...updates,
          updatedAt: Math.max(Number(dbState.updatedAt || 0), incomingTime, Date.now())
        };
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

  if (req.method === 'POST' && url.pathname === '/api/reset') {
    dbState = { ...getDefaultCollections(), updatedAt: Date.now() };
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

    if (url.pathname.startsWith('/api/')) {
      if (handleApiRequest(req, res, url)) return;
    }

    serveStaticFromDir(distDir, url.pathname, res);
  });
};

// Main Cloud & API Server (:4000 locally, or process.env.PORT on Render/Railway)
const apiServer = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (handleApiRequest(req, res, url)) return;

  // Support /student/ and /management/ routes on single-port cloud hosts (Render / Railway)
  if (url.pathname === '/student') {
    res.writeHead(302, { Location: '/student/' });
    res.end();
    return;
  }
  if (url.pathname.startsWith('/student/')) {
    serveStaticFromDir(studentDist, url.pathname.slice('/student'.length), res);
    return;
  }

  if (url.pathname === '/management') {
    res.writeHead(302, { Location: '/management/' });
    res.end();
    return;
  }
  if (url.pathname.startsWith('/management/')) {
    serveStaticFromDir(managementDist, url.pathname.slice('/management'.length), res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    const accept = req.headers.accept || '';
    if (accept.includes('text/html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JoyStay — Cloud Hostel Management System</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.5rem; box-sizing: border-box; }
    .box { max-width: 480px; width: 100%; background: #131b2e; border: 1px solid #1e293b; border-radius: 20px; padding: 2rem; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    h1 { margin: 0 0 0.5rem; font-size: 1.6rem; }
    p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.75rem; }
    .btn { display: block; width: 100%; box-sizing: border-box; padding: 1rem; margin-bottom: 0.85rem; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 0.95rem; transition: opacity 0.2s; }
    .btn-stu { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
    .btn-adm { background: #1e293b; color: #f8fafc; border: 1px solid #334155; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 0.72rem; background: rgba(16,185,129,0.15); color: #10b981; margin-bottom: 1rem; font-weight: 700; }
  </style>
</head>
<body>
  <div class="box">
    <div class="badge">● SQLite 3 Cloud Database Live</div>
    <h1>JoyStay Hostel System</h1>
    <p>Select a standalone portal below to launch:</p>
    <a class="btn btn-stu" href="/student/">📱 Open Student App (Resident Portal)</a>
    <a class="btn btn-adm" href="/management/">🏢 Open Management ERP (Admin Console)</a>
  </div>
</body>
</html>`);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'JoyStay Shared Hostel SQLite Backend API',
      database: getDatabaseStats(),
      status: 'running',
      port: API_PORT,
      endpoints: ['/student/', '/management/', '/api/state', '/api/events', '/api/db-info', '/api/backup', '/api/reset']
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
  console.log(`   ➜ Student App: http://localhost:${API_PORT}/student/`);
  console.log(`   ➜ Admin ERP:   http://localhost:${API_PORT}/management/`);
  console.log(`======================================================`);
});

// Start Standalone Ports (:5173 and :5174) when running on local machine
if (!IS_CLOUD_PORT) {
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
}
