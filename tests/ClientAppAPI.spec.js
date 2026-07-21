import { expect, test, request } from '@playwright/test';

const API_LOGIN = "https://rahulshettyacademy.com/api/ecom/auth/login"
export const API_LOGIN_PAYLOAD = { userEmail: "traviter@gmail.com", userPassword: "c#3QVpe.iE2HQPh" }

var token;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post(API_LOGIN, { data: API_LOGIN_PAYLOAD });
    expect(loginResponse.ok()).toBeTruthy();
    const { token } = await loginResponse.json();
    console.log(token);
});

test.only('Test API Bootstrap', async ({ page }) => {
    // Do nothing
})