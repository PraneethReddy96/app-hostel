import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binPath = path.join(__dirname, 'cloudflared.exe');

async function ensureCloudflared() {
  if (fs.existsSync(binPath) && fs.statSync(binPath).size > 10_000_000) {
    return binPath;
  }
  console.log('⬇️  Downloading official Cloudflare Tunnel binary (one-time setup)...');
  const res = await fetch('https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe');
  if (!res.ok) {
    throw new Error(`Failed to download cloudflared: ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(binPath, buffer);
  console.log('✅ Cloudflare Tunnel binary ready.\n');
  return binPath;
}

function createCloudflareTunnel(exe, name, port) {
  return new Promise((resolve) => {
    const child = spawn(exe, [
      'tunnel',
      '--url', `http://127.0.0.1:${port}`,
      '--no-autoupdate'
    ], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let resolved = false;
    const handleOutput = (chunk) => {
      const text = chunk.toString();
      const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && !resolved) {
        resolved = true;
        resolve({ name, port, url: match[0], process: child });
      }
    };

    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);
  });
}

const exe = await ensureCloudflared();
console.log('🌐 Starting persistent Cloudflare HTTPS Tunnels (URLs never rotate while running)...\n');

const [studentTunnel, managementTunnel] = await Promise.all([
  createCloudflareTunnel(exe, 'Student App', 5173),
  createCloudflareTunnel(exe, 'Management ERP', 5174)
]);

await new Promise(r => setTimeout(r, 2500));

console.log('========================================================================');
console.log('✅ CLOUDFLARE LIVE HTTPS LINKS READY (Stable URLs — Will Not Rotate)');
console.log('========================================================================');
console.log(`📱 Student App Link:     ${studentTunnel.url}`);
console.log(`🏢 Management ERP Link:  ${managementTunnel.url}`);
console.log('========================================================================');
console.log('💡 Powered by Cloudflare Global Edge. Both links stay fixed as long as');
console.log('   this process is running and sync in real time with SQLite 3 (:4000).\n');

setInterval(() => {}, 60000);
