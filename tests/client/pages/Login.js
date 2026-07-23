import { expect, request } from '@playwright/test';
import { BASE_URL } from '../../util/constants';
import { typeText } from '../../util/behavior';

export const API_LOGIN = BASE_URL + "/api/ecom/auth/login"
export const LOGIN_URL = BASE_URL + "/client/#/auth/login";

export const CREDENTIALS = { userEmail: "traviter@gmail.com", userPassword: "c#3QVpe.iE2HQPh" }

export const LoginLocators = page => ({
    userEmail: page.getByPlaceholder("email@example.com"),
    userPassword: page.getByPlaceholder("enter your passsword"),
    loginButton: page.getByRole("button", { name: "Login" }),
});

export class LoginPage {

    constructor(page) {
        this.page = page;
        this.locators = LoginLocators(page);
    }

    async goto() {
        this.page.goto(LOGIN_URL);
    }

    async login(credentials = CREDENTIALS) {
        await this.typeText(credentials)
        await this.submit();
    }

    async fill({ userEmail, userPassword } = CREDENTIALS) {
        await this.locators.userEmail.fill(userEmail);
        await this.locators.userPassword.fill(userPassword);
    }

    async typeText({ userEmail, userPassword } = CREDENTIALS) {
        await typeText(this.locators.userEmail, userEmail);
        await typeText(this.locators.userPassword, userPassword);
    }

    async submit() {
        await this.locators.loginButton.click();
    }
}

export class LoginAPI {

    constructor(request) {
        this.request = request;
    }

    async login(credentials = CREDENTIALS) {
        return await this.request.post(API_LOGIN, { data: credentials });
    }

    async getAccessToken(credentials = CREDENTIALS) {
        const loginResponse = await this.login(credentials);
        expect(loginResponse.ok()).toBeTruthy();
        const { token } = await loginResponse.json();
        return token;
    }
}