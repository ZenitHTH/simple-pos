import { test, expect, chromium } from '@playwright/test';
import { getMainPage } from './helpers';

test('Simple POS App Launch', async () => {
  // Connect to the Tauri app's remote debugging port
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
  
  // Get the main application page
  const page = await getMainPage(browser);
  
  // Verify the app title
  await expect(page).toHaveTitle('Simple POS');
  });
