import { spawn } from 'node:child_process';

function createTunnel(name, port) {
  return new Promise((resolve) => {
    const ssh = spawn('ssh', [
      '-T',
      '-o', 'StrictHostKeyChecking=no',
      '-o', 'UserKnownHostsFile=/dev/null',
      '-o', 'ServerAliveInterval=30',
      '-R', `80:localhost:${port}`,
      'nokey@localhost.run'
    ], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let resolved = false;
    const handleOutput = (chunk) => {
      const text = chunk.toString();
      const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.lhr\.life/);
      if (match && !resolved) {
        resolved = true;
        resolve({ name, port, url: match[0], process: ssh });
      }
    };

    ssh.stdout.on('data', handleOutput);
    ssh.stderr.on('data', handleOutput);
  });
}

console.log('🌐 Creating live public HTTPS links for remote testing (Student App & Management ERP)...\n');

const [studentTunnel, managementTunnel] = await Promise.all([
  createTunnel('Student App', 5173),
  createTunnel('Management ERP', 5174)
]);

console.log('==================================================================');
console.log('✅ PUBLIC LIVE LINKS READY TO SHARE (Works Anywhere in the World)');
console.log('==================================================================');
console.log(`📱 Student App Link:     ${studentTunnel.url}`);
console.log(`🏢 Management ERP Link:  ${managementTunnel.url}`);
console.log('==================================================================');
console.log('💡 Both links are connected in real time to your SQLite 3 database.');
console.log('   Keep this terminal running while your friend tests the apps.\n');

// Keep process alive while tunnels are open
setInterval(() => {}, 60000);
