#!/usr/bin/env node
import { spawn, spawnSync, execSync } from 'child_process';
import os from 'os';
import net from 'net';

console.log('=== Vibe POS E2E Testing Setup ===\n');

const DEBUG_PORT = 9223;

// 1. Build the Tauri app in debug mode (faster than release, sufficient for E2E)
console.log('Building Tauri app in debug mode...');
const buildResult = spawnSync('npm', ['run', 'tauri', 'build', '--', '--debug', '--no-bundle'], { stdio: 'inherit', shell: true });

if (buildResult.status !== 0) {
  console.error('Failed to build Tauri app.');
  process.exit(1);
}
console.log('Tauri app build successful!\n');

// Determine the path to the built executable
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
let executablePath;

if (isWindows) {
  executablePath = 'src-tauri\\target\\debug\\app.exe';
} else if (isMac) {
  executablePath = 'src-tauri/target/debug/bundle/macos/app.app/Contents/MacOS/app';
} else {
  // Linux
  executablePath = 'src-tauri/target/debug/app';
}

console.log(`Starting Tauri app from: ${executablePath}`);

// 2. Start the Tauri app with remote debugging enabled
const tauriProcess = spawn(executablePath, [], {
  env: {
    ...process.env,
    WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${DEBUG_PORT}`, // Windows
    // Linux/macOS WebKit debugging is more complex and might require different environment variables 
    // or rebuilding webkit2gtk with debug flags. For this setup, we prioritize Windows/Chromium CDP.
  },
  stdio: 'ignore', // We don't need the app's output cluttering the test output
  detached: !isWindows, // Keep it attached on Windows so we can kill it easily, detach on unix to avoid signal forwarding
});

if (isWindows) {
    // Windows requires specific handling to kill spawned processes
    process.on('SIGINT', () => {
        execSync(`taskkill /pid ${tauriProcess.pid} /T /F`);
        process.exit(0);
    });
} else {
    tauriProcess.unref();
}

console.log(`Tauri app started with PID: ${tauriProcess.pid}. Waiting for debugging port ${DEBUG_PORT}...`);

// Helper to wait for a port to open
async function waitForPort(port, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          resolve();
        });
        socket.on('timeout', () => {
          socket.destroy();
          reject(new Error('timeout'));
        });
        socket.on('error', (err) => {
          socket.destroy();
          reject(err);
        });
        socket.connect(port, '127.0.0.1');
      });
      return true; // Connected successfully
    } catch (e) {
      // Port not open yet, wait and retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

// 3. Wait for the CDP port to become available
const isPortOpen = await waitForPort(DEBUG_PORT);

if (!isPortOpen) {
  console.error(`Timeout waiting for remote debugging port ${DEBUG_PORT} to open.`);
  if (isWindows) {
      execSync(`taskkill /pid ${tauriProcess.pid} /T /F`);
  } else {
      process.kill(-tauriProcess.pid);
  }
  process.exit(1);
}

console.log('Debugging port is open! Starting Playwright tests...\n');

// 4. Run Playwright tests
const playwrightResult = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });

console.log('\nPlaywright tests completed.');

// 5. Cleanup: Kill the Tauri app
console.log('Closing Tauri application...');
try {
  if (isWindows) {
      execSync(`taskkill /pid ${tauriProcess.pid} /T /F`, { stdio: 'ignore' });
  } else {
      process.kill(-tauriProcess.pid); // Kill process group
  }
} catch (e) {
  console.log('Process already exited or could not be killed gracefully.');
}

process.exit(playwrightResult.status);
