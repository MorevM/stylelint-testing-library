import type { Config } from 'stylelint';

/**
 * Options of `createTestRule` utility function.
 */
export type CreateTestRuleSchema = {
	/**
	 * Name of the rule being tested.
	 */
	ruleName: string;

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
	 * Extra rules to apply.
	 */
	extraRules?: Record<string, any>;

	/**
	 * Maps to Stylelint's `customSyntax` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#customsyntax
	 */
	customSyntax?: string | undefined;

	/**
	 * Whether to always strip indentation of code blocks within test groups.
	 *
	 * @default false
	 */
	autoStripIndent?: boolean;
};
