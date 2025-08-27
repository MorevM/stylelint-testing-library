/* eslint-disable vars-on-top */
import { assert, describe, expect, it } from 'vitest';
import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './index';
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

const { createTestRule, createTestRuleConfig } = createTestUtils({
	testFunctions: { assert, describe, expect, it },
	plugins,
});

globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;

declare global {
	var createTestRule: CreateTestRule;
	var createTestRuleConfig: CreateTestRuleConfig;
}
