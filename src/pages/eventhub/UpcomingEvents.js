import { expect, request } from '@playwright/test';
import { EVENT_HUB_URL } from '../../util/constants.js';

export const EVENTS_URL = EVENT_HUB_URL + "/events"

export const UpcomingEventsLocators = page => ({
    eventCards: page.getByTestId('event-card'),
    warningBanner: page.getByText(/sandbox holds up to/i)
});

export class UpcomingEventsPage {

    constructor(page) {
        this.page = page;
        this.locators = UpcomingEventsLocators(page);
    }

    async goto() {
        await this.page.goto(EVENTS_URL);
    }

    async expectLoaded() {
        await expect(this.locators.eventCards.first()).toBeVisible();
    }
}