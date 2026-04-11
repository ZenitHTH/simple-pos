import { Page, expect } from '@playwright/test';

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
 * Clicks an element, ensuring it's in view and handling Tauri-specific oddities if any.
 */
export async function clickElement(page: Page, selector: string | any) {
  const locator = typeof selector === 'string' ? page.locator(selector) : selector;
  await locator.scrollIntoViewIfNeeded();
  await locator.click({ force: true });
}

/**
 * Finds the main application page by checking titles.
 */
export async function getMainPage(browser: any) {
  // Wait a bit for all windows to open
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const contexts = browser.contexts();
  console.log(`Found ${contexts.length} contexts`);
  
  for (const context of contexts) {
    const pages = context.pages();
    console.log(`Context has ${pages.length} pages`);
    
    for (const page of pages) {
      const title = await page.title();
      const url = page.url();
      console.log(`Page title: "${title}", URL: "${url}"`);
      
      // The main app should be on port 3000 (dev) or have the correct title
      if ((title.includes('Simple POS') || url.includes('3000')) && !title.includes('Manual')) {
        console.log(`>>> Selected page: "${title}"`);
        return page;
      }
    }
  }
  
  // If we still haven't found it, look for ANY page that isn't the manual
  for (const context of contexts) {
    for (const page of context.pages()) {
      const title = await page.title();
      if (!title.includes('Manual')) {
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
  // Use first() to avoid strict mode violations if multiple h1s exist during transition
  const heading = page.locator('h1').first();
  await heading.waitFor({ state: 'attached', timeout: 15000 });
  
  const titleText = await heading.innerText();

  if (titleText.includes('Welcome') || titleText.includes('Simple POS') || titleText.includes('Setup')) {
    // Check if we are on the Welcome Screen
    const startBtn = page.getByRole('button', { name: /Start Setup/i });
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(500);
    }

    // Password Setup Screen
    const passwordInput = page.locator('input[placeholder="Enter a strong password"]');
    if (await passwordInput.isVisible()) {
        await passwordInput.fill('Runner01');
        await page.locator('input[placeholder="Repeat your password"]').fill('Runner01');
        await page.getByRole('button', { name: /Next/i }).click();
        await page.waitForTimeout(500);
    }

    // Settings Setup Screen
    const finishSetupBtn = page.getByRole('button', { name: /Finish Setup/i });
    if (await finishSetupBtn.isVisible()) {
        await finishSetupBtn.click({ force: true });
        // Wait for the transition to the POS
        await finishSetupBtn.waitFor({ state: 'hidden', timeout: 10000 });
    }
  } else if (titleText.includes('Login')) {
    // Login Screen
    await setInputValue(page, 'input[placeholder="Enter password"]', 'Runner01');
    const loginBtn = page.getByRole('button', { name: /Login/i });
    await loginBtn.click();
    
    // Wait for login to finish - we wait for the login button to disappear
    await loginBtn.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // Final wait for the main POS screen (Product Grid)
  // Ensure any login/setup overlays are gone
  await page.waitForSelector('div.bg-black\\/60.backdrop-blur-sm', { state: 'hidden', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

/**
 * Navigates to a specific section using the sidebar.
 */
export async function navigateTo(page: Page, groupName: string | null, linkName: string) {
  // Check for mobile hamburger
  const hamburger = page.locator('button.text-muted.-ml-2');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(500);
  }

  if (groupName) {
    const group = page.getByRole('button').filter({ hasText: groupName });
    await group.waitFor({ state: 'visible' });
    
    // Check if expanded (this depends on your implementation, usually aria-expanded)
    // If we can't detect it easily, just click and wait
    await group.click();
    await page.waitForTimeout(500);
  }

  const link = page.locator('a').filter({ hasText: linkName });
  await link.waitFor({ state: 'visible' });
  await link.click();
  await page.waitForTimeout(500);
}
