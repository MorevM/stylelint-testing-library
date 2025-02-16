import type { Config } from 'stylelint';
import type { TestFunctions } from '#types';

/**
 * Options of `createTestUtils` utility function.
 */
export type CreateTestUtilsSchema = {
	/**
	 * Functions of your test platform to run tests. \
	 * `jest`, `vitest`, `node:test` are supported.
	 *
	 * It is recommended to pass as much as possible for better visual output.
	 */
	testFunctions?: TestFunctions;

	/**
	 * Maps to Stylelint's `plugins` configuration property.
	 *
	 * Path to the file that exports the plugin object relative to the root,
	 * or the exported content itself.
	 *
	 * @see https://stylelint.io/user-guide/configure#plugins
	 */
	plugins?: Config['plugins'];

	/**
	 * Extra rules to apply.
	 *
	 * @default {}
	 */
	extraRules?: Record<string, any>;

	/**
	 * Maps to Stylelint's `customSyntax` option.
	 *
	 * @see https://stylelint.io/user-guide/usage/options#customsyntax
	 */
	customSyntax?: string;

	/**
	 * How to display names of test groups (in the console)
	 * if they do not have descriptions.
	 *
	 * @default 'group-index'
	 */
	testGroupWithoutDescriptionAppearance?: 'group-index' | 'line-in-file' | 'config';

	/**
	 * How to display names of test cases (in the console)
	 * if they do not have descriptions.
	 *
	 * @default 'case-index'
	 */
	testCaseWithoutDescriptionAppearance?: 'case-index' | 'code';

	/**
	 * Whether to always strip indentation of code blocks within test groups.
	 *
	 * @default false
	 */
	autoStripIndent?: boolean;
};
