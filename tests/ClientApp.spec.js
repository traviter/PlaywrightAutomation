import { expect, test } from '@playwright/test';

const loginPage = "https://rahulshettyacademy.com/client/#/auth/login";

test('Assert First Card Contents', async ({ page }) => {
    await signIn(page);
    const firstCardTitle = cardTitles(page).first();
    console.log(await firstCardTitle.textContent());
    await expect(firstCardTitle).toContainText('ADIDAS ORIGINAL');
})

test('Assert All Expected Card Titles', async ({ page }) => {
    await signIn(page);
    await cardTitles(page).first().waitFor();
    const allCardTitles = await cardTitles(page).allTextContents();
    expect(allCardTitles).toEqual(['ADIDAS ORIGINAL', 'ZARA COAT 3', 'iphone 13 pro']);
})

test('End to End validation of customer purchase flow', async ({ page }) => {
    const productNameToPurchase = 'ADIDAS ORIGINAL';
    const email = 'traviter@gmail.com'

    // Sign in to the app
    await signIn(page);

    // Add a product to cart
    const productToPurchase = productCard(page, productNameToPurchase);
    await cardAddToCartButton(productToPurchase).click();

    // Click to view the cart
    const viewCart = viewCartButton(page);
    await expect(cartCountIndicator(viewCart)).toHaveText('1');
    await viewCart.click();

    // Verify cart contains the product
    const cartItems = checkoutCartItems(page);
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).toContainText(productNameToPurchase);

    // Check out
    await cartCheckoutButton(page).click();

    // Verify shipping email prepopulated
    await expect(shippingField(page).locator('label').first()).toContainText(email);
    await expect(shippingField(page).locator('input').first()).toHaveValue(email);

    // Fill in other shipping info
    await countryInput(page).pressSequentially('United States');
    await countrySelection(page, 'United States').click();

    // Fill card info
    await creditCardNumberInput(page).fill('1234567890123456')
    await cvvCodeInput(page).fill('123')
    await nameOnCardInput(page).fill('Travis Carlson')

    // Place order
    placeOrderButton(page).click()

    // Verify order was placed
    await expect(page.getByRole('heading', { name: 'Thankyou for the order.' })).toBeAttached()
});

const signIn = async (page) => {
    await page.goto(loginPage);
    await usernameField(page).fill("traviter@gmail.com");
    await passwordField(page).fill("c#3QVpe.iE2HQPh");
    await signInButton(page).click();
}

const usernameField = (page) => page.locator("#userEmail")
const passwordField = (page) => page.locator('input[type="password"]')
const signInButton = (page) => page.locator("#login")
const cardTitles = (page) => page.locator('.card-body > h5 > b');
const productCard = (page, productName) => page.locator('.card').filter({
    hasText: productName
});
const cardAddToCartButton = (card) => card.getByRole('button', { name: 'Add To Cart' });
const viewCartButton = (page) => page.locator("//button[@routerlink='/dashboard/cart']")
const cartCountIndicator = (cart) => cart.locator('label')
const checkoutCartItems = (page) => page.locator('ul.cartWrap')
const cartCheckoutButton = (page) => page.getByText('Checkout')

const shippingField = (page) => page.locator('.user__name')
const countryInput = (page) => page.getByPlaceholder('Select Country')
const countrySelection = (page, selection) => page.getByText(selection, { exact: true })

const creditCardNumberInput = (page) => inputWithLabel(page, 'Credit Card Number')
const cvvCodeInput = (page) => inputWithLabel(page, 'CVV Code')
const nameOnCardInput = (page) => inputWithLabel(page, 'Name on Card')

const inputWithLabel = (page, label) => page.locator('.field').filter({
    hasText: label
}).locator('input')

const placeOrderButton = (page) => page.locator('a:has-text("PLACE ORDER")')