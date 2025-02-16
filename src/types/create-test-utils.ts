import type { CreateTestRule, CreateTestRuleConfig } from '#types';

/**
 * Creates Stylelint testing utilities bound to the testing platform functions
 * with useful defaults applied to them.
 *
 * @param   schema   Options.
 *
 * @returns          Ready-to-use `testRule` and `testRuleConfig` functions.
 */
export type CreateTestUtils = {
	/**
	 * Creates a `testRule` function to test the rule
	 * under different configuration options.
	 *
	 * @param   schema   Options.
	 *
	 * @returns          Ready-to-use `testRule` function.
	 */
	createTestRule: CreateTestRule;

	/**
	 * Creates a `testRuleConfig` function to test rule configurations
	 * using logical grouping.
	 *
	 * @param   schema   Rule name, optional plugins.
	 */
	createTestRuleConfig: CreateTestRuleConfig;
};
