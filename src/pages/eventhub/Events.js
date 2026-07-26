import { expect, request } from '@playwright/test';
import { EVENT_HUB_URL } from '../../util/constants';

export const EVENTS_URL = EVENT_HUB_URL + "/events"

export const EventsLocators = page => ({
    eventCards: page.getByTestId('event-card'),
    warningBanner: page.getByText(/sandbox holds up to/i)
});

export class EventsPage {

    constructor(page) {
        this.page = page;
        this.locators = EventsLocators(page);
    }

    async goto() {
        await this.page.goto(EVENTS_URL);
    }

    async expectLoaded() {
        await expect(this.locators.eventCards.first()).toBeVisible();
    }
}