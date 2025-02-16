/**
 * A generic test case.
 */
export type TestCase = {
	/**
	 * Code of the test case.
	 */
	code: string;

	/**
	 * Description of the test case.
	 */
	description?: string;

	/**
	 * A filename for this `code` property.
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
};
