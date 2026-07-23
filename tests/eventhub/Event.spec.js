import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/Login';
import { EventsPage, EventsLocators } from './pages/Events';
import { mockApi } from '../util/mocks';
import { FOUR_EVENTS_RESPONSE, SIX_EVENTS_RESPONSE } from './MockResponses';

test('Verify banner is not visible when 4 events are returned', async ({ page }) => {
    await navigateToEventMock(page, FOUR_EVENTS_RESPONSE);
    const { warningBanner } = EventsLocators(page);
    await expect(warningBanner).toBeVisible({ visible: false });
});

test('Verify banner is visible when 6 events are returned', async ({ page }) => {
    await navigateToEventMock(page, SIX_EVENTS_RESPONSE);
    const { warningBanner } = EventsLocators(page);
    await expect(warningBanner).toBeVisible();
});

const navigateToEventMock = async (page, mock) => {
    await mockApi(page, '**/api/events**', mock);
    const loginPage = new LoginPage(page);
    const eventsPage = new EventsPage(page);
    await loginPage.goto();
    await loginPage.login();
    // TODO Wait for dashboard to load instead.  Have not defined dashboard yet.
    // Networkidle and load do not work because the token isnt stored yet.
    await page.waitForTimeout(2_000);
    await eventsPage.goto();
    const { eventCards } = EventsLocators(page);
    await expect(eventCards.first()).toBeVisible();
    await expect(await eventCards.count()).toEqual(mock.data.length);
}