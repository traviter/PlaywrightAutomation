import { expect, test } from '@playwright/test';

const loginPage = "https://rahulshettyacademy.com/loginpagePractise/";

test('Browser Context Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(loginPage);
});

test('Page Playwright test', async ({ page }) => {
    await page.goto(loginPage);
});

test('Assert Sign In Failure Message', async ({ page }) => {
    await page.goto(loginPage);
    await usernameField(page).fill("johndoe");
    await passwordField(page).fill("testpassword");
    await signInButton(page).click();
    console.log(await signInError(page).textContent());
    await expect(signInError(page)).toContainText("Incorrect username/password.");
})

test('Assert Sign In Success', async ({ page }) => {
    await page.goto(loginPage);
    await usernameField(page).fill("rahulshettyacademy");
    await passwordField(page).fill("Learning@830$3mK2");
    await signInButton(page).click();
    await expect(page).toHaveTitle("ProtoCommerce");
})

test('Assert Sample Card Title Correct', async ({ page }) => {
    await signIn(page);
    const firstCardTitle = cardTitles(page).first();
    console.log(await firstCardTitle.textContent());
    await expect(firstCardTitle).toContainText('iphone X');
})

const cardTitles = (page) => page.locator('div.card-body > h4.card-title');

const signIn = async (page) => {
    await page.goto(loginPage);
    await usernameField(page).fill("rahulshettyacademy");
    await passwordField(page).fill("Learning@830$3mK2");
    await signInButton(page).click();
}

const usernameField = (page) => page.locator('#username')
const passwordField = (page) => page.locator('input[type="password"]')
const signInButton = (page) => page.locator('#signInBtn')
const signInError = (page) => page.locator("[style*='display: block']")