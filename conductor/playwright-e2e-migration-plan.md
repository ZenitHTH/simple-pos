# Playwright E2E Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up obsolete test files and rewrite the custom `run-e2e.mjs` script to properly launch the Tauri application with remote debugging and execute standard Playwright tests.

**Architecture:** We will remove outdated WebdriverIO tests (`e2e/specs/`) and broken Playwright configurations. We will rewrite the Node runner script (`scripts/run-e2e.mjs`) to use `child_process.spawn` to start the built Tauri application with the `--remote-debugging-port` flag, wait for the port to become available, execute `npx playwright test`, and finally kill the Tauri process. We will also clean up `playwright.config.ts`.

**Tech Stack:** Node.js (`child_process`), Playwright, Tauri.

---

### Task 1: Clean Up Obsolete and Broken Test Files

**Files:**
- Delete: `e2e/specs/` directory
- Delete: `e2e/playwright/config/` directory
- Delete: `e2e/playwright/test/` directory

- [ ] **Step 1: Delete obsolete directories**

Run: `Remove-Item -Recurse -Force e2e/specs, e2e/playwright/config, e2e/playwright/test -ErrorAction SilentlyContinue`
Expected: Directories are deleted without errors.

- [ ] **Step 2: Commit**

```bash
git add -u e2e
git commit -m "chore(test): remove obsolete WebdriverIO tests and broken Playwright configs"
```

---

### Task 2: Rewrite E2E Runner Script

**Files:**
- Modify: `scripts/run-e2e.mjs`

- [ ] **Step 1: Write new run-e2e.mjs implementation**

Replace the entire contents of `scripts/run-e2e.mjs` with the following:

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add scripts/run-e2e.mjs
git commit -m "test: rewrite E2E runner to use standard Playwright via CDP"
```

---

### Task 3: Refine Playwright Configuration

**Files:**
- Modify: `playwright.config.ts`

- [ ] **Step 1: Update Playwright Config**

Update `playwright.config.ts` to ensure it only looks for tests in the correct directory and sets appropriate defaults.

Replace the contents of `playwright.config.ts` with:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/playwright',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  workers: 1, // Important: Run sequentially since they share a single Tauri instance
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "chore(test): refine Playwright configuration"
```

---

## Self-Review Check
1. **Spec Coverage:** The plan covers cleaning up old tests, rewriting the runner to use standard Playwright execution against a live Tauri instance via CDP, and updating the Playwright config.
2. **Placeholder Scan:** No placeholders. The full runner script is provided.
3. **Type Consistency:** The runner correctly handles cross-platform pathing for the Tauri debug build output.

---
