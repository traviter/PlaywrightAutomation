import { Given } from "@cucumber/cucumber";

Given('I am logged in', async function () {
    console.log('WORLD:', this);
    await this.loginPage.goto();
    await this.loginPage.login();

    // Temporary until dashboard page object exists
    await this.page.waitForTimeout(2000);
});