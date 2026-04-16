import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/playwright',
  testMatch: '**/*.spec.ts',
  timeout: 90000,
  workers: 1, // Important: Run sequentially since they share a single Tauri instance
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
