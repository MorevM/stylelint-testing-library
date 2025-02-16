import type { Config } from 'stylelint';

export type CreateTestRuleConfigSchema = {
	/**
	 * Name of the rule being tested. \
	 * Usually exported from the plugin.
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
};
