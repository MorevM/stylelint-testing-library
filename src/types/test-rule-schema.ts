import type { Config } from 'stylelint';
import type { AcceptedTestCase, RejectedTestCase } from '#types';

/**
 * A test schema.
 */
export type TestRuleSchema = {
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
	 * Config to pass to the rule.
	 */
	config: unknown;

	/**
	 * Maps to Stylelint's `codeFilename` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#codefilename
	 */
	codeFilename?: string;

	/**
	 * Maps to Stylelint's `customSyntax` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#customsyntax
	 */
	customSyntax?: string | undefined;

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
	 * Whether to always strip indentation of code blocks within test groups.
	 *
	 * @default false
	 */
	autoStripIndent?: boolean;

	/**
	 * Extra rules to apply.
	 *
	 * @default {}
	 */
	extraRules?: Record<string, any>;
} & ({
	/**
	 * Accepted test cases.
	 */
	accept: AcceptedTestCase[];

	/**
	 * Rejected test cases.
	 */
	reject?: RejectedTestCase[];
} | {
	/**
	 * Accepted test cases.
	 */
	accept?: AcceptedTestCase[];

	/**
	 * Rejected test cases.
	 */
	reject: RejectedTestCase[];
});
