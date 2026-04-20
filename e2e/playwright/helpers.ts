import { Page, expect, chromium } from '@playwright/test';
import { logger } from './logger';
import http from 'http';

// Cache the connection status to avoid repeating the slow discovery process
let cachedSetup: { isTauri: boolean; port: number } | null = null;

/**
 * High-level helper to setup the test browser.
 * Attempts to connect to Tauri via CDP, falls back to standard Chromium launch (Next.js only) if connection fails.
 */
export async function setupTestBrowser(browserType: any, port: number = 9223) {
  const baseUrl = `http://127.0.0.1:${port}`;
  
  // If we already know Tauri is unavailable, skip straight to fallback
  if (cachedSetup && !cachedSetup.isTauri && cachedSetup.port === port) {
    logger.info("Using cached fallback mode (Tauri unavailable).");
    const browser = await browserType.launch({
      executablePath: '/usr/bin/google-chrome-stable'
    });
    return { browser, isTauri: false };
  }

  try {
    logger.info(`Attempting to connect to Tauri via CDP at ${baseUrl}...`);
    // Very few retries for the first check to fail fast if Tauri isn't ready
    const cdpUrl = await getCDPUrl(baseUrl, cachedSetup ? 1 : 2); 
    const browser = await browserType.connectOverCDP(cdpUrl, { timeout: 10000 });
    logger.info("Successfully connected to Tauri application.");
    cachedSetup = { isTauri: true, port };
    return { browser, isTauri: true };
  } catch (err) {
    logger.warn(`Tauri connection failed: ${(err as Error).message}. Falling back to Next.js dev server.`);
    cachedSetup = { isTauri: false, port };
    
    // On Fedora, use system browser to avoid library version mismatches (e.g. libicudata.so.74)
    const browser = await browserType.launch({
      executablePath: '/usr/bin/google-chrome-stable'
    });
    return { browser, isTauri: false };
  }
}

/**
 * Robustly connects to the Tauri application based on the platform.
 * Windows/macOS: connectOverCDP (Chromium)
 * Linux: launch via tauri-driver (WebKit)
 */
export async function connectToApp(browserType: any, port: number = 9223): Promise<any> {
  const isLinux = process.platform === 'linux';
  const baseUrl = `http://127.0.0.1:${port}`;

  if (isLinux) {
    logger.info(`Linux detected: Launching via tauri-driver to ${baseUrl}...`);
    // On Linux, we MUST use WebKit with tauri-driver
    const { webkit } = await import('@playwright/test');
    
    // Find the executable path. In our setup, it's consistent.
    const executablePath = 'src-tauri/target/debug/app';
    const tauriDriverPath = '/home/zenithth/.cargo/bin/tauri-driver';
    
    return await webkit.launch({
      executablePath: tauriDriverPath,
      args: ['--port', port.toString()],
      env: {
        ...process.env,
        TAURI_APPLICATION_PATH: executablePath,
      },
      ignoreDefaultArgs: true, // Crucial: tauri-driver only accepts specific flags
    });
  }

  logger.info(`Non-Linux detected: Connecting via CDP to ${baseUrl}...`);
  const cdpUrl = await getCDPUrl(baseUrl);
  return await browserType.connectOverCDP(cdpUrl, { timeout: 30000 });
}

/**
 * Finds the correct CDP URL, especially important for Linux/WebKit environments.
 */
export async function getCDPUrl(baseUrl: string = 'http://127.0.0.1:9223', retries: number = 5): Promise<string> {
  logger.info(`Discovering CDP URL from ${baseUrl} (Remaining retries: ${retries})...`);
  
  return new Promise((resolve) => {
    const req = http.get(`${baseUrl}/json`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          if (Array.isArray(targets) && targets.length > 0) {
            // Prefer 'page' type, fallback to first target
            const target = targets.find((t: any) => t.type === 'page') || targets[0];
            if (target.webSocketDebuggerUrl) {
              logger.info(`Found WebSocket URL: ${target.webSocketDebuggerUrl}`);
              resolve(target.webSocketDebuggerUrl);
              return;
            }
          }
        } catch (e) {
          logger.warn("Failed to parse CDP JSON response");
        }
        resolve(baseUrl);
      });
    }).on('error', async (err) => {
      if (retries > 0) {
        logger.info(`CDP discovery failed (${err.message}), retrying...`);
        await new Promise(r => setTimeout(r, 2000));
        resolve(await getCDPUrl(baseUrl, retries - 1));
      } else {
        logger.warn(`CDP discovery failed: ${err.message}. Using base URL.`);
        resolve(baseUrl);
      }
    });
  });
}

/**
 * Sets an input value and ensures React handles the change event.
 */
export async function setInputValue(page: Page, selector: string, value: string) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout: 10000 });
  
  // Playwright's fill() is usually smarter than WDIO's setValue
  await element.fill(value);
  
  // Wait a bit for React state updates
  await page.waitForTimeout(500);
}

/**
 * Clicks an element, ensuring it's in view and attached to the DOM.
 */
export async function clickElement(page: Page, selector: string | any) {
  const locator = typeof selector === 'string' ? page.locator(selector) : selector;
  
  try {
    // Wait for the element to be present in the DOM
    logger.info(`Waiting for element: ${typeof selector === 'string' ? selector : 'locator'}`);
    await locator.waitFor({ state: 'attached', timeout: 30000 });
    
    // Wait a tiny bit for any animations or transitions to settle
    await page.waitForTimeout(500);
    
    await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {
        logger.info("Note: scrollIntoViewIfNeeded failed or timed out, proceeding anyway");
    });

    logger.info("Executing click...");
    await locator.click({ force: true });
  } catch (err) {
    logger.error(`Failed to click element: ${(err as Error).message}`);
    throw err;
  }
}

/**
 * Finds the main application page by checking titles.
 */
export async function getMainPage(browser: any) {
  // Wait a bit for all windows to open
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const contexts = browser.contexts();
  for (const context of contexts) {
    const pages = context.pages();
    for (const page of pages) {
      const title = await page.title();
      const url = page.url();
      
      logger.info(`Checking page: Title="${title}", URL="${url}"`);
      
      // The main app should be on port 3000 (dev) or have the correct title
      if ((title.includes('Simple POS') || url.includes('3000')) && !title.includes('Manual')) {
        return page;
      }
    }
  }
  
  return contexts[0].pages()[0];
}

/**
 * Performs the initial setup or login flow.
 */
export async function performLogin(page: Page) {
  // Ensure viewport is large enough to see all elements
  await page.setViewportSize({ width: 1280, height: 800 });

  // Wait for the app to load. We look for a heading that represents the current state.
  logger.info("Waiting for any H1 heading to appear...");
  const heading = page.locator('h1').first();
  await heading.waitFor({ state: 'attached', timeout: 60000 });
  
  let titleText = await heading.innerText();
  logger.info(`Current screen title: "${titleText}"`);

  // Check if we are already at the POS (the main app screen)
  // We check for "History" or "Cart" buttons which are unique to the POS
  const historyBtn = page.getByRole('button', { name: /History/i });
  const cartBtn = page.getByRole('button', { name: /Cart/i });
  
  if (await historyBtn.isVisible() || await cartBtn.isVisible()) {
    logger.info("Already at POS screen (History/Cart visible), skipping login/setup");
    return;
  }

  logger.info("Not at POS screen yet, proceeding with setup/login flow...");

  if (titleText.includes('Welcome') || titleText.includes('Simple POS') || titleText.includes('Setup')) {
    logger.info("Detected Welcome/Setup screen");
    
    // 1. Welcome Screen
    // Use a more robust locator and force click
    const startBtn = page.locator('button').filter({ hasText: /Start Setup/i }).first();
    try {
        await startBtn.waitFor({ state: 'visible', timeout: 10000 });
        logger.info("Clicking Start Setup...");
        await startBtn.click({ force: true });
        await page.waitForTimeout(2000);
    } catch (e) {
        logger.info("Start Setup button not visible, attempting direct click...");
        await startBtn.click({ force: true }).catch(() => logger.info("Direct click failed too"));
    }

    // 2. Password Setup Screen
    const passwordInput = page.locator('input[placeholder="Enter a strong password"]');
    try {
        logger.info("Waiting for Password screen...");
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        logger.info("Entering password...");
        await passwordInput.fill('Runner01');
        await page.locator('input[placeholder="Repeat your password"]').fill('Runner01');

        const nextBtn = page.getByRole('button', { name: /Next/i });
        logger.info("Clicking Next...");
        await nextBtn.click();
        await page.waitForTimeout(3000);
    } catch (e) {
        logger.info("Password screen not found or already passed");
    }

    // 3. Settings Setup Screen
    logger.info("Checking for Settings Setup/Finish button...");
    const finishSetupBtn = page.getByRole('button', { name: /Finish Setup|Complete|Finish/i });
    try {
        await finishSetupBtn.waitFor({ state: 'visible', timeout: 15000 });
        logger.info("Finishing setup...");
        await finishSetupBtn.click({ force: true });
        // Wait for the transition to the POS
        logger.info("Waiting for setup screens to hide...");
        await finishSetupBtn.waitFor({ state: 'hidden', timeout: 30000 });
    } catch (e) {
        const currentTitle = await page.locator('h1').first().innerText().catch(() => "unknown");
        logger.info(`Finish Setup button not found or already passed. Current title: ${currentTitle}`);
    }
  } else if (titleText.includes('Login')) {
    logger.info("Detected Login screen");
    // Login Screen
    await setInputValue(page, 'input[placeholder="Enter password"]', 'Runner01');
    const loginBtn = page.getByRole('button', { name: /Login/i });
    logger.info("Clicking Login...");
    await loginBtn.click();
    
    // Wait for login to finish - we wait for the login button to disappear
    await loginBtn.waitFor({ state: 'hidden', timeout: 20000 });
  }

  logger.info("Waiting for overlays to clear...");
  // Final wait for the main POS screen (Product Grid)
  // Ensure ANY full-screen fixed overlays (login, setup, modals) are gone
  await page.waitForFunction(() => {
    const overlays = Array.from(document.querySelectorAll('div.fixed.inset-0.z-50'));
    return overlays.every(el => {
      const style = window.getComputedStyle(el);
      // We check if it's truly blocking or just a portal root
      return style.display === 'none' || 
             style.visibility === 'hidden' || 
             style.opacity === '0' || 
             style.pointerEvents === 'none' ||
             el.childNodes.length === 0;
    });
  }, { timeout: 20000 }).catch(async () => {
    const info = await page.evaluate(() => {
        const overlays = Array.from(document.querySelectorAll('div.fixed.inset-0.z-50'));
        return overlays.map(o => ({
            text: o.textContent?.substring(0, 50),
            visible: window.getComputedStyle(o).display !== 'none',
            pointerEvents: window.getComputedStyle(o).pointerEvents
        }));
    });
    logger.info(`Warning: Overlays might still be present: ${JSON.stringify(info)}`);
  });
  
  await page.waitForTimeout(3000);
  logger.info("performLogin completed");
}

/**
 * Navigates to a specific section using the sidebar.
 */
export async function navigateTo(page: Page, groupName: string | null, linkName: string) {
  // Ensure no modals are blocking the sidebar
  await page.locator('div.fixed.inset-0.z-50.bg-black\\/60').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

  // Check for mobile hamburger
  const hamburger = page.locator('button.text-muted.-ml-2');
  if (await hamburger.isVisible()) {
    await clickElement(page, hamburger);
    await page.waitForTimeout(500);
  }

  if (groupName) {
    const group = page.getByRole('button').filter({ hasText: groupName });
    await clickElement(page, group);
    await page.waitForTimeout(500);
  }

  const link = page.getByRole('link', { name: linkName, exact: true });
  await clickElement(page, link);
  await page.waitForTimeout(1000);
}
