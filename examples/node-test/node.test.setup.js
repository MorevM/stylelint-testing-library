import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './index.js';

const { createTestRule, createTestRuleConfig } = createTestUtils({
	testFunctions: { it, describe, assert },
	plugins,
});

globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;
