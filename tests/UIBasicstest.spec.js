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

test('On Sign In As Teacher Expect Success', async ({ page }) => {
    await page.goto(loginPage);
    await usernameField(page).fill("rahulshettyacademy");
    await passwordField(page).fill("Learning@830$3mK2");
    await roleDropdownField(page).selectOption("teach");
    await signInButton(page).click();
    await assertSignInSuccess(page);
})

test('On Select User Expect Warning', async ({ page }) => {
    await page.goto(loginPage);
    await userRadioField(page).click();
    await expect(userRadioField(page)).toBeChecked();
    await expect(modalDialog(page)).toBeAttached();
})

test('On Click Terms Expect Checked', async ({ page }) => {
    await page.goto(loginPage);
    await termsField(page).click();
    await expect(termsField(page)).toBeChecked();
})

test('On Page Load Expect Terms Unchecked', async ({ page }) => {
    await page.goto(loginPage);
    await expect(await termsField(page).isChecked()).toBeFalsy();
})

test('On Sign In Proper Credentials Expect Success', async ({ page }) => {
    await page.goto(loginPage);
    await usernameField(page).fill("rahulshettyacademy");
    await passwordField(page).fill("Learning@830$3mK2");
    await signInButton(page).click();
    await assertSignInSuccess(page);
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

const assertSignInSuccess = async (page) => await expect(page).toHaveTitle("ProtoCommerce");

const usernameField = (page) => page.locator('#username')
const passwordField = (page) => page.locator('input[type="password"]')
const roleDropdownField = (page) => page.getByRole('combobox')
const authRadioFields = (page) => page.locator('label.customradio')
const userRadioField = (page) => authRadioFields(page).last()
const modalDialog = (page) => page.locator('#myModal')
const signInButton = (page) => page.locator('#signInBtn')
const termsField = (page) => page.locator('#terms')
const signInError = (page) => page.locator("[style*='display: block']")