import { setWorldConstructor } from '@cucumber/cucumber';

export class CustomWorld {
    loginPage;
    upcomingEventsPage;
    page;
    browser;
    context;
}

setWorldConstructor(CustomWorld);