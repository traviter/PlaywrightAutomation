import test from "@playwright/test";

import {
    typingSpeed,
    typingVariation,
    typingSpacePause
} from "./constants.js";

function getTypingDelay(character) {
    const variation = Math.random() * (typingVariation * 2) - typingVariation;

    const delay = typingSpeed + variation;

    if (character === ' ') {
        return delay + typingSpacePause;
    }

    return delay;
}

export const typeText = async (locator, text) => {
    await logStep('Typing ' + text, async () => {
        for (const char of text) {
            await locator.press(char);
            await locator.page().waitForTimeout(getTypingDelay(char));
        }
    });
}

export let logStep = async (text, action) => await action();

export const setStepLoggingImplementation = (impl) => {
    logStep = impl;
}