import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['html', { open: 'always' }]
  ],
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    browserName: 'chromium',
    headless: !!process.env.CI,
    screenshot: 'on',
    trace: 'retain-on-failure',
  }
});

