import { expect, test, request } from '@playwright/test';
import { LoginAPI, LoginPage } from './pages/Login';
import { BASE_URL } from '../util/constants';
import { DashboardPage } from './pages/Dashboard';

const API_LOGIN = BASE_URL + "/api/ecom/auth/login"

var accessToken;

test.beforeAll(async () => {
    const context = await request.newContext();
    accessToken = await new LoginAPI(context).getAccessToken();
    await context.dispose();
});

test.beforeEach(async ({ page }) => {
    // Do nothing, but keeping this documented as an option
})

const addTokenToLocalStorage = async (page) => {
    await page.addInitScript((value) => {
        window.localStorage.setItem("token", value);
    }, accessToken);
}

test('Test Forced Login when not authenticated', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await dashboard.goto();
    await login.login();
    await dashboard.expectLoaded();
})

test('Test Already Logged in via API', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await addTokenToLocalStorage(page);
    await dashboard.goto();
    await dashboard.expectLoaded();
})

test('Test Log in Before Navigation', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login();
    await dashboard.goto();
    await dashboard.expectLoaded();
})