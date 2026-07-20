import { expect, test } from '@playwright/test';

const pageUrl = "https://rahulshettyacademy.com/angularpractice/";

test('Test form selection and submission using various accessors', async ({ page }) => {
    await page.goto(pageUrl)
    await page.getByLabel('Check me out if you Love IceCreams!').check();
    await page.getByLabel('Employed').click();
    await page.getByLabel('Gender').selectOption("Female");
    await page.getByPlaceholder('Password').fill("PASSWORD123");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();
    await page.getByRole("link", { name: "Shop" }).click();
});

test('Test shop selection', async ({ page }) => {
    await page.goto(pageUrl)
    await page.getByRole("link", { name: "Shop" }).click();
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button").click();
});

