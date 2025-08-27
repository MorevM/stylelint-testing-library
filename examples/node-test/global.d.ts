/* eslint-disable vars-on-top */
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

declare global {
	var createTestRule: CreateTestRule;
	var createTestRuleConfig: CreateTestRuleConfig;
}

// eslint-disable-next-line unicorn/require-module-specifiers -- https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2710
export {};
