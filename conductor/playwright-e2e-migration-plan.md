# Playwright E2E Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate E2E testing to Playwright using the Remote Debugging Port (CDP) and implement native Wayland/GPU workarounds in Rust to ensure compatibility across Windows 11 and Linux KDE Wayland without GNOME dependencies.

**Architecture:** 
1. Inject the `WEBKIT_DISABLE_DMABUF_RENDERER=1` workaround in the Rust backend (`main.rs`) for Linux KDE Wayland compatibility on NVIDIA/Radeon.
2. Add a `playwright.config.ts` that configures the test suite.
3. Create a custom Node.js script (`scripts/run-e2e.mjs`) to launch the Tauri application with the correct environment variables for Windows (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`) and Linux (`WEBKIT_INSPECTOR_SERVER`), and then execute Playwright.
4. Replace `wdio` with Playwright in `package.json`.

**Tech Stack:** Playwright, Node.js, Rust, Tauri 2.0

---

### Task 1: Implement Linux Wayland Workaround in Rust

**Files:**
- Modify: `src-tauri/src/main.rs:1-10`

- [ ] **Step 1: Inject DMABUF workaround in main.rs**

Update `src-tauri/src/main.rs` to set the environment variable on Linux Wayland before running the app.

```rust
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    {
        if std::env::var("XDG_SESSION_TYPE").unwrap_or_default() == "wayland" {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }
    app_lib::run();
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/src/main.rs
git commit -m "fix: implement wayland dmabuf workaround for linux"
```

### Task 2: Install Playwright Dependencies and Clean Up WebdriverIO

**Files:**
- Modify: `package.json`
- Delete: `wdio.conf.mjs`

- [ ] **Step 1: Install Playwright and remove wdio**

```bash
npm uninstall webdriverio @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter
npm install -D @playwright/test
```

- [ ] **Step 2: Delete wdio configuration**

```bash
rm wdio.conf.mjs
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git rm wdio.conf.mjs
git commit -m "chore: replace webdriverio with playwright"
```

### Task 3: Create Playwright Configuration

**Files:**
- Create: `playwright.config.ts`

- [ ] **Step 1: Write Playwright Config**

Create `playwright.config.ts` in the project root.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/playwright',
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "chore: add playwright configuration"
```

### Task 4: Create Unified Test Runner Script

**Files:**
- Create: `scripts/run-e2e.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create test runner script**

Create `scripts/run-e2e.mjs` to handle cross-platform environment variables and process spawning.

```javascript
import { spawn, spawnSync } from 'child_process';
import os from 'os';

const isWindows = os.platform() === 'win32';

// 1. Build the Tauri app in debug mode
console.log('Building Tauri app...');
spawnSync('npm', ['run', 'tauri', 'build', '--', '--debug', '--no-bundle'], { stdio: 'inherit', shell: true });

// 2. Set up environment variables for remote debugging
const env = { ...process.env };
if (isWindows) {
  env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9222';
} else {
  env.WEBKIT_INSPECTOR_SERVER = '127.0.0.1:9222';
}

// 3. Launch Tauri app
console.log('Launching Tauri app...');
const appPath = `./src-tauri/target/debug/app${isWindows ? '.exe' : ''}`;
const tauriProcess = spawn(appPath, [], { env, stdio: 'inherit' });

// 4. Wait a moment for the app to start
setTimeout(() => {
  // 5. Run Playwright
  console.log('Running Playwright...');
  const playwrightProcess = spawn('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });
  
  playwrightProcess.on('close', (code) => {
    tauriProcess.kill();
    process.exit(code);
  });
}, 3000);
```

- [ ] **Step 2: Update package.json scripts**

Modify `package.json` to use the new runner. Find the `"test:e2e"` script and replace it.

```javascript
// Change this line in package.json:
// "test:e2e": "wdio run wdio.conf.mjs",
// To:
// "test:e2e": "node scripts/run-e2e.mjs",
```

- [ ] **Step 3: Commit**

```bash
git add scripts/run-e2e.mjs package.json
git commit -m "test: create unified e2e runner script"
```

### Task 5: Migrate Example Test to Playwright

**Files:**
- Create: `e2e/playwright/example.spec.ts`

- [ ] **Step 1: Write Playwright Test**

Create `e2e/playwright/example.spec.ts` connecting over CDP.

```typescript
import { test, expect, chromium } from '@playwright/test';

test('Simple POS App Launch', async () => {
  // Connect to the Tauri app's remote debugging port
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  
  // Get the first context and page (the Tauri window)
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  // Verify the app title
  await expect(page).toHaveTitle('Simple POS');
  
  await browser.close();
});
```

- [ ] **Step 2: Commit**

```bash
git add e2e/playwright/example.spec.ts
git commit -m "test: migrate example test to playwright"
```
