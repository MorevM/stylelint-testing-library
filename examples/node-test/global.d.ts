/* eslint-disable no-autofix/no-var, vars-on-top */
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

declare global {
	var createTestRule: CreateTestRule;
	var createTestRuleConfig: CreateTestRuleConfig;
}

export {};
