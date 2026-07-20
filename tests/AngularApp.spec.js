import { expect, test } from '@playwright/test';

const pageUrl = "https://rahulshettyacademy.com/angularpractice/";

test('Test form selection and submission using various accessors', async ({ page }) => {
    await page.goto(pageUrl)
    await page.getByLabel('Check me out if you Love IceCreams!').check();
    await page.getByLabel('Employed').click();
    await page.getByLabel('Gender').selectOption("Female");
    await page.getByPlaceholder('Password').fill("PASSWORD123");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({ timeout: 2_000 });
});

test('Test shop selection', async ({ page }) => {
    const slowExpect = expect.configure({ timeout: 10_000 });
    await page.goto(pageUrl)
    await page.getByRole("link", { name: "Shop" }).click();
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button").click();
    await slowExpect(checkoutButton(page)).toContainText("Checkout ( 1 )");
});

const checkoutButton = (page) => page.locator('a.nav-link.btn.btn-primary');

