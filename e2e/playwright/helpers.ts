import { Page, expect, chromium, Locator } from '@playwright/test';
import { logger } from './logger';

let cachedSetup: { isTauri: boolean; port: number } | null = null;

export async function setupTestBrowser(browserType: any, port: number = 9223) {
  const baseUrl = `http://127.0.0.1:${port}`;
  
  if (cachedSetup && !cachedSetup.isTauri && cachedSetup.port === port) {
    const browser = await browserType.launch({ executablePath: '/usr/bin/brave-browser' });
    return { browser, isTauri: false };
  }

  console.log("Connecting to Tauri via CDP...");
  try {
    const cdpUrl = await getCDPUrl(baseUrl, 1);
    const browser = await browserType.connectOverCDP(cdpUrl, { timeout: 15000 });
    console.log("Connected to Tauri via CDP successfully.");
    cachedSetup = { isTauri: true, port };
    return { browser, isTauri: true };
  } catch (err) {
    logger.warn(`Failed to connect to Tauri via CDP: ${(err as Error).message}`);
    console.log("Falling back to Next.js dev server (mock mode)...");
    
    cachedSetup = { isTauri: false, port };
    const browser = await browserType.launch({ 
        executablePath: '/usr/bin/brave-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    return { browser, isTauri: false };
  }
}

async function getCDPUrl(baseUrl: string, retries: number = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${baseUrl}/json/list`);
      const data = await response.json();
      if (data && data[0] && data[0].webSocketDebuggerUrl) {
        return data[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error("CDP URL not found");
}

export async function getMainPage(browser: any) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  let page: Page;
  
  // Ensure we get a context and then a page from it
  const contexts = browser.contexts();
  let context;
  if (contexts.length === 0) {
    context = await browser.newContext();
  } else {
    context = contexts[0];
  }
  
  const pages = context.pages();
  page = pages.length === 0 ? await context.newPage() : pages[0];
  
  // IF NOT TAURI, MUST GOTO DEV SERVER
  if (!cachedSetup?.isTauri) {
    logger.info("Fallback detected: Navigating to http://127.0.0.1:3000");
    await page.goto('http://127.0.0.1:3000');
  }
  
  return page;
}

export async function clickElement(page: Page, selector: string | Locator) {
  const locator = typeof selector === 'string' ? page.locator(selector) : selector;
  try {
    await locator.waitFor({ state: 'attached', timeout: 10000 });
    await page.waitForTimeout(300);
    await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await locator.click({ timeout: 5000 });
  } catch (e) {
    logger.warn(`Standard click failed for ${selector.toString()}, trying forced dispatch...`);
    await locator.dispatchEvent('click').catch((err) => {
        console.error(`Failed to click element: ${(err as Error).message}`);
        throw err;
    });
  }
}

export async function navigateTo(page: Page, group: string | null, name: string) {
  const urlMap: any = {
    'Main Page': '/',
    'Product Management': '/manage',
    'Categories': '/manage/categories',
    'Inventory & Stock': '/manage/stock',
  };

  logger.info(`Navigating to ${name}...`);
  
  // Method 1: Router Backdoor (Fastest & Most Stable)
  const navigated = await page.evaluate(async (path) => {
    if ((window as any).router) {
      (window as any).router.push(path);
      return true;
    }
    return false;
  }, urlMap[name]);

  if (navigated) {
    await page.waitForURL(`**${urlMap[name]}`, { timeout: 10000 });
    return;
  }

  // Method 2: UI Click
  if (group) await clickElement(page, page.getByRole('button', { name: group }));
  await clickElement(page, page.getByRole('link', { name: name, exact: true }));
  await page.waitForURL(`**${urlMap[name]}`, { timeout: 10000 });
}

export async function verifyDatabaseState(page: Page, check: (db: any) => void) {
  const db = await page.evaluate(async () => {
    if (!(window as any).settingsApi) return null;
    return await (window as any).settingsApi.getDbTruth();
  });
  if (!db) throw new Error("DB Truth Backdoor not available");
  return check(db);
}

export async function waitForAction(page: Page, actionName: string, timeout: number = 15000) {
    logger.info(`Waiting for action truth: "${actionName}"...`);
    await page.waitForFunction((name) => {
        const markers = (window as any).__TEST_MARKERS__ || [];
        return markers.some((m: any) => m.name === name);
    }, actionName, { timeout });
}

export async function performLogin(page: Page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  const heading = page.locator('h1').first();
  await heading.waitFor({ state: 'attached', timeout: 30000 });
  
  const text = await heading.innerText();
  if (text.includes('Welcome') || text.includes('Setup')) {
    await clickElement(page, page.getByText(/Start/i));
    await page.waitForTimeout(1000);
    
    // Password
    const inputs = page.locator('input[type="password"]');
    if (await inputs.count() > 0) {
        await inputs.nth(0).fill('Runner01');
        await inputs.nth(1).fill('Runner01');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
    }
    
    // Finish
    await clickElement(page, page.getByText(/Finish|Complete/i));
  } else if (text.includes('Login')) {
    await page.locator('input[type="password"]').fill('Runner01');
    await page.keyboard.press('Enter');
  }
  
  await page.waitForTimeout(2000);
}
