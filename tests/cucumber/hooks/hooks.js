import { Before, After, setDefaultTimeout, AfterAll } from '@cucumber/cucumber';
import { exec } from 'child_process';
import { chromium } from 'playwright';

import { LoginPage } from '../../../src/pages/eventhub/Login.js';
import { UpcomingEventsPage } from '../../../src/pages/eventhub/UpcomingEvents.js';

const headless = !!process.env.CI;
const openReport = !process.env.CI;

setDefaultTimeout(30_000);

Before(async function () {

    this.browser = await chromium.launch({
        headless: headless
    });

    this.context = await this.browser.newContext();

    this.page = await this.context.newPage();

    // Instantiate commonly-used page objects
    this.loginPage = new LoginPage(this.page);
    this.upcomingEventsPage = new UpcomingEventsPage(this.page);
});

After(async function () {

    await this.context?.close();
    await this.browser?.close();
});