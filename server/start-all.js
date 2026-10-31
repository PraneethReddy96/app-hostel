import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const startStandaloneVite = (appFolder, label) => {
  const configPath = path.join(rootDir, appFolder, 'vite.config.js');
  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--config', configPath],
    {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    }
  );
  return child;
};

console.log('🌐 Launching Standalone Student App (student-app/ on :5173) & Web Management App (management-app/ on :5174)...');
startStandaloneVite('student-app', 'Student App');
startStandaloneVite('management-app', 'Management App');
