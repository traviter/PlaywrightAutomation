import { expect, test } from '@playwright/test';

const baseUrl = "https://eventhub.rahulshettyacademy.com";
const loginUrl = baseUrl;
const bookingsUrl = baseUrl + "/bookings";

test('E2E Event Booking', async ({ page }) => {
    await login(page);

    await navigateToEventCreation(page);

    const now = new Date();
    const eventDate = new Date();
    eventDate.setFullYear(now.getFullYear() + 1);

    const event = {
        title: `Test Event ${now.getTime()}`,
        city: 'Tucson',
        description: 'Test event description',
        venue: 'Rialto Theatre',
        price: 89,
        seats: 50,
        datetime: eventDate.toISOString().slice(0, 16)
    };
    await navigateToEventCreation(page);
    await createEvent(page, event);

    const seatsBeforeBooking = await getEventBookingCapacity(page, event);

    await navigateToBookEvent(page, event);

    const bookingRef = await bookEvent(page, {
        name: 'Travis Carlson',
        email: 'traviter@gmail.com',
        phone: '5205551234'
    });

    await confirmBookingIsListedInHistory(page, event, bookingRef);

    const seatsAfterBooking = await getEventBookingCapacity(page, event);

    expect(seatsBeforeBooking).toEqual(seatsAfterBooking + 1);
});

const login = async (page, credentials = { email: "traviter@gmail.com", password: "8sx!vWjw54jJBAS" }) => {
    await page.goto(loginUrl);
    await page.getByPlaceholder('you@email.com').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

const navigateToEventCreation = async (page, event) => {
    // Navigate to the event management tab
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();
}

const createEvent = async (page, event) => {
    await page.locator('#event-title-input').fill(event.title);
    await page.locator('#admin-event-form textarea').fill(event.description);
    await page.getByLabel('City').fill(event.city);
    await page.getByLabel('Venue').fill(event.venue);
    await page.getByLabel('Event Date & Time').fill(String(event.datetime));
    await page.getByLabel('Price ($)').fill(String(event.price));
    await page.getByLabel('Total Seats').fill(String(event.seats));
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();
}

const getEventBookingCapacity = async (page, event, book) => {
    // Navigate to the events page listing
    await page.getByTestId('nav-events').click();

    // Wait for event cards to load
    await expect(eventCards(page).first()).toBeVisible();

    // Filter the events for the particular event
    const targetEventCard = eventCard(page, event);

    // Event doesn't load proper number of seats immediately.  It updates based off parsed bookings.
    // I would probably classify this as a bug, but this allows the script to run and simulate actual user experience
    await page.waitForTimeout(2_000);

    // Parse out the number of remaining seats
    const seatText = await targetEventCard.locator('span').filter({ hasText: 'seats available' }).innerText();

    // Return the number of remaining seats
    return parseInt(seatText, 10);
}

const navigateToBookEvent = async (page, event) => await eventCard(page, event).getByTestId('book-now-btn').click();

const eventCards = (page) => page.getByTestId('event-card');
const eventCard = (page, event) => eventCards(page).filter({ hasText: event.title });

const bookEvent = async (page, attendee) => {
    // Ticket count should be 1 by default
    await expect(page.locator('#ticket-count')).toContainText('1');

    // Fill in details
    await page.getByLabel('Full Name').fill(attendee.name);
    await page.locator('#customer-email').fill(attendee.email);
    await page.getByPlaceholder('+91 98765 43210').fill(attendee.phone);

    // Make the booking
    await page.locator('.confirm-booking-btn').click();

    // Confirm booking
    const bookingRefElement = page.locator('.booking-ref').first();
    await expect(bookingRefElement).toBeVisible();

    // Return the booking reference number
    return (await bookingRefElement.innerText()).trim();
}

const confirmBookingIsListedInHistory = async (page, event, bookingRef) => {
    // Navigate to view bookigns
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    // Confirm URL
    await expect(page).toHaveURL(bookingsUrl);

    // Expect all bookings are loaded
    const allBookingCards = page.locator('#booking-card');
    await expect(allBookingCards.first()).toBeVisible();

    // Expect booking matching the reference number is present
    const targetBooking = allBookingCards.filter({ hasText: bookingRef });
    await expect(targetBooking).toBeVisible();
    await expect(targetBooking).toContainText(event.title);
}