import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/playwright',
  timeout: 60000,
  workers: 1,
  use: {
    trace: 'on-first-retry',
  },
});
