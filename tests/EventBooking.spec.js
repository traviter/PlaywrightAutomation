import { expect, test } from '@playwright/test';

const baseUrl = "https://eventhub.rahulshettyacademy.com";
const loginUrl = baseUrl;
const bookingsUrl = baseUrl + "/bookings";

const loginEmail = "traviter@gmail.com";
const loginPassword = "8sx!vWjw54jJBAS";


test.only('E2E Event Booking', async ({ page }) => {
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

    const seatsBeforeBooking = await getEventBookingCapacity(page, event, true);

    const bookingRef = await bookEvent(page, {
        name: 'Travis Carlson',
        email: 'traviter@gmail.com',
        phone: '5205551234'
    });

    await confirmBookingIsListedInHistory(page, event, bookingRef);

    const seatsAfterBooking = await getEventBookingCapacity(page, event, false);

    expect(seatsBeforeBooking).toEqual(seatsAfterBooking + 1);
});

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

const getEventBookingCapacity = async (page, event, book) => {
    // Navigate to the events page listing
    await page.getByTestId('nav-events').click();

    // Wait for event cards to load
    const eventCards = page.getByTestId('event-card');
    await expect(eventCards.first()).toBeVisible();

    // Filter the events for the particular event
    const targetEventCard = eventCards.filter({ hasText: event.title });

    // Event doesn't load proper number of seats immediately.  It updates based off parsed bookings.
    // I would probably classify this as a bug, but this allows the script to run and simulate actual user experience
    await page.waitForTimeout(2_000);

    // Parse out the number of remaining seats
    const seatText = await targetEventCard.locator('span').filter({ hasText: 'seats available' }).innerText();

    // Book the event
    if (book) {
        await targetEventCard.getByTestId('book-now-btn').click();
    }

    // Return the number of remaining seats
    return parseInt(seatText, 10);
}


const confirmBookingIsListedInHistory = async (page, event, bookingRef) => {
    await page.getByRole('link', { name: 'View My Bookings' }).click();

    await expect(page).toHaveURL(bookingsUrl);

    const allBookingCards = page.locator('#booking-card');

    // Expect all bookings are loaded
    await expect(allBookingCards.first()).toBeVisible();

    // Expect booking matching the reference number is present
    const targetBooking = allBookingCards.filter({ hasText: bookingRef });
    await expect(targetBooking).toBeVisible();
    await expect(targetBooking).toContainText(event.title);
}


test('test', async ({ page }) => {
    if (true) {
        return;
    }
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed! 🎉' })).toBeVisible();
    await expect(page.getByText('Booking RefT-NFP8TD')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('T-NFP8TD');
    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page.getByTestId('booking-card')).toBeVisible();
    await expect(page.getByTestId('booking-card').getByRole('heading')).toContainText('Test Event 1784600354756');
    await page.getByTestId('nav-events').click();
    await expect(page.getByText('Dilli Diwali MelaTue, 20')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('49 seats available');
});

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

const login = async (page) => {
    await page.goto(loginUrl);
    await page.getByPlaceholder('you@email.com').fill(loginEmail);
    await page.getByLabel('Password').fill(loginPassword);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}