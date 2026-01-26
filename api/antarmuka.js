// file: terminal-persistent.js
const { spawn } = require('child_process');

function startShell() {
  const shell = spawn('bash', [], {
    stdio: 'inherit'
  });

  shell.on('close', (code, signal) => {
    console.log(`Shell exited dengan kode ${code}, signal: ${signal}`);
    console.log('Restarting shell...');
    setTimeout(startShell, 1000); // restart setelah 1 detik
  });

  shell.on('error', (err) => {
    console.error('Error shell:', err);
    console.log('Restarting shell...');
    setTimeout(startShell, 1000);
  });
}

startShell();