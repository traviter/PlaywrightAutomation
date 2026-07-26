import { test } from '@playwright/test';

function isFulfillOptions(obj) {
    return obj &&
        typeof obj === 'object' &&
        (
            'status' in obj ||
            'headers' in obj ||
            'json' in obj ||
            'body' in obj ||
            'path' in obj ||
            'contentType' in obj ||
            'response' in obj
        );
}

export const mockApi = async (page, url, mock = {}) => {
    let hitCount = 0;

    await page.route(url, async route => {
        const logText = `🎭 ${route.request().method()} ${route.request().url()}`;
        await test.step(logText,
            async () => {
                hitCount++;

                const generatedResponse = typeof mock === 'function' ? await mock(route) : mock;
                const fulfillment = isFulfillOptions(generatedResponse) ? generatedResponse : { json: generatedResponse }

                console.log(logText);

                await route.fulfill({
                    status: 200,
                    headers: {
                        'x-playwright-mock': 'true',
                    },
                    ...fulfillment,
                });
            }
        );
    });

    return {
        get wasHit() {
            return hitCount > 0;
        },

        get hitCount() {
            return hitCount;
        },
    };
}