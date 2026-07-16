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
    browserName: 'chromium',
    headless: !!process.env.CI
  }
});

