import { test } from '@playwright/test';
import { setStepLoggingImplementation } from '../../src/util/behavior.js';

setStepLoggingImplementation((name, callback) =>
    test.step(name, callback)
);