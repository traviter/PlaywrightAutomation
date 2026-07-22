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

export async function typeText(locator, value) {
    for (const char of value) {
        await locator.press(char);
        await locator.page().waitForTimeout(getTypingDelay(char));
    }
}