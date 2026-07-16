import { test } from '@playwright/test';

test('Browser Context Playwright test', async ({ browser, page }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test('Page Playwright test', async ({ browser, page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});