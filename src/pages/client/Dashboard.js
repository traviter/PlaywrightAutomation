import { expect, request } from '@playwright/test';
import { BASE_URL } from '../../util/constants';

export const DASHBOARD_URL = BASE_URL + "/client/#/dashboard/dash"

export const DashboardLocators = page => ({
    cardTitles: page.locator('.card-body > h5 > b'),
});

export class DashboardPage {

    constructor(page) {
        this.page = page;
        this.locators = DashboardLocators(page);
    }

    async goto() {
        await this.page.goto(DASHBOARD_URL);
    }

    async expectLoaded() {
        await expect(this.locators.cardTitles.first()).toBeVisible();
    }
}

export class DashboardAPI {

    constructor(request) {
        this.request = request;
    }
}