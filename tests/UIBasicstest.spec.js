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

test('Test Username/Password failure', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator('#username').fill("johndoe");
    await page.locator('input[type="password"]').fill("testpassword");
    await page.locator('#signInBtn').click();
    const errorBox = page.locator("[style*='display: block']");
    console.log(await errorBox.textContent());
    await expect(errorBox).toContainText("Incorrect username/password.");
})