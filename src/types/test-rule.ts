import type { TestRuleSchema } from './test-rule-schema';

// Note: `type`-style export does not allow adding properties to a function :(

/**
 * Function to test rules.
 *
 * @param   schema   Test cases of the group and its settings.
 */
type BaseTestRule = (schema: TestRuleSchema) => void;

export interface TestRule {
	/**
	 * Function to test rules.
	 *
	 * @param   schema   Test group and its settings.
	 */
	(schema: TestRuleSchema): BaseTestRule;
	skip: BaseTestRule;
	only: BaseTestRule;
}
