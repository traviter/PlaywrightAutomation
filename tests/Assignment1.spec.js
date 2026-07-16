import { expect, test } from '@playwright/test';

const loginPage = "https://rahulshettyacademy.com/client/#/auth/login";

test.only('Assert First Card Contents', async ({ page }) => {
    await signIn(page);
    const firstCardTitle = cardTitles(page).first();
    console.log(await firstCardTitle.textContent());
    await expect(firstCardTitle).toContainText('ADIDAS ORIGINAL');
})

const cardTitles = (page) => page.locator('.card-body > h5 > b');

const signIn = async (page) => {
    await page.goto(loginPage);
    await usernameField(page).fill("traviter@gmail.com");
    await passwordField(page).fill("c#3QVpe.iE2HQPh");
    await signInButton(page).click();
}

const usernameField = (page) => page.locator("#userEmail")
const passwordField = (page) => page.locator('input[type="password"]')
const signInButton = (page) => page.locator("#login")