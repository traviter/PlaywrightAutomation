import { expect } from "@playwright/test";
import { Given, When, Then } from "@cucumber/cucumber";
import { FOUR_EVENTS_RESPONSE, SIX_EVENTS_RESPONSE } from "../../../src/api/MockUpcomingEvents.js";
import { mockApi } from "../../../src/util/mocks.js";

Given('the upcoming events API returns {int} events', async function (count) {
    const response = getUpcomingEventsResponse(count);
    await mockApi(this.page, '**/api/events**', response);
});

When('I open the Upcoming Events page', async function () {
    await this.upcomingEventsPage.goto();
    const { eventCards } = this.upcomingEventsPage.locators;
    await expect(eventCards.first()).toBeVisible();
});

Then('I should see {int} event cards', async function (count) {
    expect(await this.upcomingEventsPage.locators.eventCards.count()).toEqual(count);
});

Then('the warning banner should be visible', async function () {
    await expect(this.upcomingEventsPage.locators.warningBanner).toBeVisible();
});

Then('the warning banner should not be visible', async function () {
    await expect(this.upcomingEventsPage.locators.warningBanner).not.toBeVisible();
});


const getUpcomingEventsResponse = (count) => {
    switch (count) {
        case 4:
            return FOUR_EVENTS_RESPONSE
        case 6:
            return SIX_EVENTS_RESPONSE
        default:
            throw new RangeError("Only 4 or 6 events are currently supported")
    }
}