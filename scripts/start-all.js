const { spawn, spawnSync } = require('node:child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
// O separador `--` impede que o npm interprete --port como uma opção dele.
const expoArguments = ['exec', '--', 'expo', 'start', ...process.argv.slice(2)];
const children = [];
let shuttingDown = false;

function start(command, args, name) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('error', (error) => {
    console.error(`[${name}] não foi possível iniciar: ${error.message}`);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${name}] encerrado por ${signal}.`);
    } else if (code !== 0) {
      console.error(`[${name}] encerrado com código ${code}.`);
    }

    if (name === 'Expo' && !shuttingDown) {
      stopAll();
    }
  });

  children.push(child);
  return child;
}

start(npmCommand, ['start', '--prefix', 'server'], 'API');
start(npmCommand, expoArguments, 'Expo');

function stopAll() {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child.killed) continue;

    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      child.kill();
    }
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});
