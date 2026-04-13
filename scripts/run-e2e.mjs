#!/usr/bin/env node
import { spawn, spawnSync, execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import net from 'net';
import http from 'http';

console.log('=== Vibe POS E2E Testing Setup ===\n');

const DEBUG_PORT = 9223;
const DEV_SERVER_PORT = 3000;
const DEV_SERVER_HOST = '127.0.0.1';
const skipBuild = process.argv.includes('--skip-build');

const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';

let executablePath;
if (isWindows) {
  executablePath = 'src-tauri\\target\\debug\\app.exe';
} else if (isMac) {
  executablePath = 'src-tauri/target/debug/bundle/macos/app.app/Contents/MacOS/app';
} else {
  executablePath = 'src-tauri/target/debug/app';
}

// 0. Clear App Data for a fresh test run
const appDataPath = isWindows 
  ? path.join(process.env.APPDATA, 'simple-pos')
  : isMac
    ? path.join(os.homedir(), 'Library', 'Application Support', 'com.simple-pos.app')
    : path.join(os.homedir(), '.local', 'share', 'simple-pos');

console.log(`Cleaning app data at: ${appDataPath}`);
try {
  if (fs.existsSync(appDataPath)) {
    fs.rmSync(appDataPath, { recursive: true, force: true });
    console.log('App data cleared successfully.');
  }
} catch (err) {
  console.warn(`Warning: Could not clear app data: ${err.message}`);
}

// 1. Build the Tauri app in debug mode FIRST
// This ensures that any changes to the Rust core are captured.
if (!skipBuild) {
  console.log('Building Tauri app in debug mode...');
  const buildResult = spawnSync('npm', ['run', 'tauri', 'build', '--', '--debug', '--no-bundle'], { stdio: 'inherit', shell: true });

  if (buildResult.status !== 0) {
    console.error('Failed to build Tauri app.');
    process.exit(1);
  }
  console.log('Tauri app build successful!\n');
} else {
  console.log('Skipping build phase as requested.\n');
}

// 2. Start the Next.js dev server in the background
console.log('Starting Next.js dev server...');
const devServer = spawn('npm', ['run', 'dev'], { 
  stdio: 'ignore', 
  shell: true,
  detached: false 
});

// Helper to wait for a port to be open AND responding with 200 OK
async function waitForDevServer(port, host, timeout = 60000) {
  const start = Date.now();
  console.log(`Waiting for dev server on http://${host}:${port}...`);
  
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://${host}:${port}`, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Status: ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return false;
}

const isDevServerReady = await waitForDevServer(DEV_SERVER_PORT, DEV_SERVER_HOST);

if (!isDevServerReady) {
  console.error('Timeout waiting for Next.js dev server to be ready (200 OK).');
  process.exit(1);
}
console.log('Dev server is ready!\n');

console.log(`Starting Tauri app from: ${executablePath}`);

// 3. Start the Tauri app with remote debugging enabled
const tauriProcess = spawn(executablePath, [], {
  env: {
    ...process.env,
    WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${DEBUG_PORT}`,
  },
  stdio: 'ignore',
  detached: !isWindows,
});

if (isWindows) {
    process.on('SIGINT', () => {
        try { execSync(`taskkill /pid ${tauriProcess.pid} /T /F`); } catch (e) {}
        process.exit(0);
    });
}

// Helper to wait for a port to be open (TCP only for CDP)
async function waitForPort(port, host, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => { socket.destroy(); resolve(); });
        socket.on('timeout', () => { socket.destroy(); reject(new Error('timeout')); });
        socket.on('error', (err) => { socket.destroy(); reject(err); });
        socket.connect(port, host);
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

console.log(`Waiting for debugging port ${DEBUG_PORT}...`);
const isPortOpen = await waitForPort(DEBUG_PORT, '127.0.0.1');

if (!isPortOpen) {
  console.error(`Timeout waiting for remote debugging port ${DEBUG_PORT} to open.`);
  if (isWindows) {
      try { execSync(`taskkill /pid ${tauriProcess.pid} /T /F`); } catch (e) {}
  } else {
      process.kill(-tauriProcess.pid);
  }
  process.exit(1);
}

console.log('Debugging port is open! Starting Playwright tests...\n');

// 4. Run Playwright tests
const playwrightResult = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });

console.log('\nPlaywright tests completed.');

// 5. Cleanup
console.log('Closing Tauri application...');
try {
  if (isWindows) {
      execSync(`taskkill /pid ${tauriProcess.pid} /T /F`, { stdio: 'ignore' });
  } else {
      process.kill(-tauriProcess.pid);
  }
} catch (e) {}

process.exit(playwrightResult.status);
