import { expect, test } from '@playwright/test';

test('Browser Context Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test('Page Playwright test', async ({ page }) => {
    await page.goto("https://google.com");
});

test('Title Playwright test', async ({ page }) => {
    await page.goto("https://google.com");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});