/* eslint-disable vars-on-top -- Global test API declarations must use `var` so `globalThis` assignments are typed. */
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

declare global {
	var createTestRule: CreateTestRule;
	var createTestRuleConfig: CreateTestRuleConfig;
}
