import { EVENT_HUB_URL } from '../../util/constants';
import { typeText } from '../../util/behavior';

export const LOGIN_URL = EVENT_HUB_URL + "/login";

export const CREDENTIALS = { userEmail: "traviter@gmail.com", userPassword: "8sx!vWjw54jJBAS" }

export const LoginLocators = page => ({
    userEmail: page.getByPlaceholder('you@email.com'),
    userPassword: page.getByLabel('Password'),
    loginButton: page.locator('#login-btn'),
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