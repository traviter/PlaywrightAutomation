import test from "@playwright/test";

import {
    typingSpeed,
    typingVariation,
    typingSpacePause
} from "./constants";

function getTypingDelay(character) {
    const variation = Math.random() * (typingVariation * 2) - typingVariation;

    const delay = typingSpeed + variation;

    if (character === ' ') {
        return delay + typingSpacePause;
    }

    return delay;
}

export const typeText = async (locator, text) => {
    await test.step('Typing ' + text, async () => {
        for (const char of text) {
            await locator.press(char);
            await locator.page().waitForTimeout(getTypingDelay(char));
        }
    });
}