import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔨 Building optimized Student App & Management ERP bundles for all devices...');
try {
  execSync('npx vite build --config student-app/vite.config.js', { cwd: rootDir, stdio: 'inherit' });
  execSync('npx vite build --config management-app/vite.config.js', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('Build warning:', err.message);
}

await import('./index.js');
