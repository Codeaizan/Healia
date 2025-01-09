const { spawn } = require('child_process');
const { platform } = require('os');

const runVite = spawn('npm', ['run', 'dev'], { shell: true });
const waitForVite = spawn('wait-on', ['tcp:8080'], { shell: true });

runVite.stdout.on('data', (data) => {
  console.log(`Vite: ${data}`);
});

waitForVite.on('exit', () => {
  const electron = spawn(platform() === 'win32' ? 'npx.cmd' : 'npx', ['electron', '.'], {
    shell: true,
    env: { ...process.env, ELECTRON: "true" }
  });

  electron.stdout.on('data', (data) => {
    console.log(`Electron: ${data}`);
  });
});