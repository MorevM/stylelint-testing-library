import type { TestRuleConfigSchema } from './test-rule-config-schema';

// Note: `type`-style export does not allow adding properties to a function :(

/**
 * Function to test rule configs.
 *
 * @param   schema   Test cases of the group and its settings.
 */
type BaseTestRuleConfig = (schema: TestRuleConfigSchema) => void;

export interface TestRuleConfig {
	/**
	 * Function to test rule configs.
	 *
	 * @param   schema   Test cases of the group and its settings.
	 */
	(schema: TestRuleConfigSchema): void;
	skip: BaseTestRuleConfig;
	only: BaseTestRuleConfig;
}
