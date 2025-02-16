import type { Config } from 'stylelint';
import type { ConfigTestCase } from '#types';

/**
 * Options of `testRuleConfig` utility function.
 */
export type TestRuleConfigSchema = {
	/**
	 * Name of the rule being tested. \
	 * Usually exported from the plugin.
	 *
	 * Optional if defined in `createTestRuleConfig`.
	 */
	ruleName?: string;

	/**
	 * Maps to Stylelint's `plugins` configuration property.
	 *
	 * Path to the file that exports the plugin object relative to the root,
	 * or the exported content itself.
	 *
	 * Optional if the option was already passed into `createTestUtils()`.
	 *
	 * @see https://stylelint.io/user-guide/configure#plugins
	 */
	plugins?: Config['plugins'];

	/**
	 * Testing group description.
	 */
	description?: string;

	/**
	 * Extra rules to apply.
	 *
	 * @default {}
	 */
	extraRules?: Record<string, any>;

	/**
	 * Whether to run only the test case.
	 *
	 * @default false
	 */
	only?: boolean;

	/**
	 * Whether to skip the test case.
	 *
	 * @default false
	 */
	skip?: boolean;

	/**
	 * Accepted test cases.
	 */
	accept?: ConfigTestCase[];

	/**
	 * Rejected test cases.
	 */
	reject?: ConfigTestCase[];
};
