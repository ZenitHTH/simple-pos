#!/usr/bin/env node
import { spawn, spawnSync, execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import net from 'net';
import http from 'http';
import { logger } from './logger.mjs';

logger.log('=== Vibe POS E2E Testing Setup ===\n');

const DEBUG_PORT = 9223;
const DEV_SERVER_PORT = 3000;
const DEV_SERVER_HOST = '127.0.0.1';
const skipBuild = process.argv.includes('--skip-build');

// Environment Detection
const targetEnvArg = process.argv.find(arg => arg.startsWith('--target-env='));
const targetEnv = targetEnvArg ? targetEnvArg.split('=')[1] : null;

const isWindows = os.platform() === 'win32' || targetEnv === 'windows';
const isMac = os.platform() === 'darwin';
const isWSL = targetEnv === 'wsl';
const isArch = targetEnv === 'arch';
const isFedora = targetEnv === 'fedora';
const isLinuxDesktop = (targetEnv === 'linux' || isArch || isFedora) && !isWSL;

logger.info(`Target Environment: ${targetEnv || 'Auto-detect'}`);
if (isWSL) logger.info('WSL Mode: Explicitly setting DISPLAY=:0 and WAYLAND_DISPLAY=wayland-0');

// Distro-specific help messages
const getDistroHelp = () => {
  if (isArch) return "sudo pacman -S webkitgtk-6.0";
  if (isFedora) return "sudo dnf install webkit2gtk6.0-devel"; // Or appropriate webkitgtk package for Fedora
  return "Please install the WebKit WebDriver for your distribution.";
};

const appDataPath = isWindows 
  ? path.join(process.env.APPDATA || '', 'simple-pos')
  : isMac
    ? path.join(os.homedir(), 'Library', 'Application Support', 'com.simple-pos.app')
    : path.join(os.homedir(), '.local', 'share', 'simple-pos');

let executablePath;
if (isWindows && os.platform() === 'win32') {
  executablePath = 'src-tauri\\target\\debug\\app.exe';
} else if (isWindows && os.platform() !== 'win32') {
  logger.error('Error: Cannot run Windows target on non-Windows host without cross-compilation/Wine (not supported).');
  process.exit(1);
} else if (isMac) {
  executablePath = 'src-tauri/target/debug/bundle/macos/app.app/Contents/MacOS/app';
} else {
  executablePath = 'src-tauri/target/debug/app';
}

// 0. Clear Database for a fresh test run
const dbPath = path.join(appDataPath, 'database.db');

logger.info(`Cleaning database at: ${dbPath}`);
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    logger.info('Database cleared successfully.');
  }
} catch (err) {
  logger.warn(`Warning: Could not clear database: ${err.message}`);
}

// 1. Build the Tauri app in debug mode FIRST
// This ensures that any changes to the Rust core are captured.
if (!skipBuild) {
  logger.info('Building Frontend...');
  const frontendBuildResult = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
  if (frontendBuildResult.status !== 0) {
    logger.error('Failed to build Frontend.');
    process.exit(1);
  }

  logger.info('Building Tauri app in debug mode...');
  const buildResult = spawnSync('npm', ['run', 'tauri', 'build', '--', '--debug', '--no-bundle'], { stdio: 'inherit', shell: true });

  if (buildResult.status !== 0) {
    logger.error('Failed to build Tauri app.');
    process.exit(1);
  }
  logger.info('Tauri app build successful!\n');
} else {
  logger.info('Skipping build phase as requested.\n');
}

// 2. Start the Next.js dev server in the background
logger.info('Starting Next.js dev server...');
const devServer = spawn('npm', ['run', 'dev'], { 
  stdio: 'ignore', 
  shell: true,
  detached: false 
});

// Helper to wait for a port to be open AND responding with 200 OK
async function waitForDevServer(port, host, timeout = 60000) {
  const start = Date.now();
  logger.info(`Waiting for dev server on http://${host}:${port}...`);
  
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
  logger.error('Timeout waiting for Next.js dev server to be ready (200 OK).');
  process.exit(1);
}
logger.info('Dev server is ready! Waiting 5s for stability...');
await new Promise(r => setTimeout(r, 5000));
logger.info('Proceeding to start Tauri app.\n');

// 3. Start the application
let tauriProcess;
const logFile = fs.openSync('tauri-app.log', 'w');

logger.info(`Starting Tauri app from: ${executablePath}`);
const args = isWindows ? [] : [`--remote-debugging-port=${DEBUG_PORT}`];
const env = {
  ...process.env,
  VIBE_POS_IN_MEMORY: '1',
  RUST_LOG: 'debug',
  WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${DEBUG_PORT}`,
  WEBKIT_INSPECTOR_HTTP_SERVER: `127.0.0.1:${DEBUG_PORT}`,
  // Fedora 43 / WebKitGTK / Wayland fixes
  WEBKIT_DISABLE_DMABUF_RENDERER: '1',
  GDK_BACKEND: 'x11', // Often more stable for automation than pure wayland
};
tauriProcess = spawn(executablePath, args, {
  env,
  stdio: ['ignore', logFile, logFile],
  detached: !isWindows,
});

if (isWindows) {
    process.on('SIGINT', () => {
        try { execSync(`taskkill /pid ${tauriProcess.pid} /T /F`); } catch (e) {}
        process.exit(0);
    });
}

// Helper to wait for a port to be open (TCP)
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

logger.info(`Waiting for port ${DEBUG_PORT}...`);
const isPortOpen = await waitForPort(DEBUG_PORT, '127.0.0.1');

if (!isPortOpen) {
  logger.warn(`Warning: Port ${DEBUG_PORT} didn't open. Tests will attempt fallback to dev server.`);
} else {
  logger.info(`Port ${DEBUG_PORT} is open.`);
}

logger.info('Starting Playwright tests...\n');

// 4. Run Playwright tests
// Forward any additional arguments (like --ui) to playwright, but filter out our own flags
const playwrightArgs = [
  'playwright', 
  'test', 
  ...process.argv.slice(2).filter(arg => 
    arg !== '--skip-build' && !arg.startsWith('--target-env=')
  )
];
const playwrightResult = spawnSync('npx', playwrightArgs, { stdio: 'inherit', shell: true });

logger.info('\nPlaywright tests completed.');

// 5. Cleanup
logger.info('Closing Tauri application...');
try {
  if (tauriProcess && tauriProcess.pid) {
    if (isWindows) {
        execSync(`taskkill /pid ${tauriProcess.pid} /T /F`, { stdio: 'ignore' });
    } else {
        process.kill(-tauriProcess.pid);
    }
  }
} catch (e) {}

process.exit(playwrightResult.status);
