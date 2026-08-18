/**
 * Declared locally because Stylelint 16 omits `EditInfo` from its ESM type exports.
 *
 * TODO [peer:stylelint@>=17]: Replace this declaration with Stylelint's `EditInfo`.
 */
type EditInfo = {
	/**
	 * Pair of 0-based source indices to replace.
	 */
	range: [number, number];

	/**
	 * Replacement text.
	 */
	text: string;
};

/**
 * A warning.
 */
export type Warning = {
	/**
	 * Expected message from the test case.
	 */
	message: string;

	/**
	 * Expected line number of the warning.
	 */
	line?: number;

	/**
	 * Expected column number of the warning.
	 */
	column?: number;

	/**
	 * Expected end line number of the warning.
	 */
	endLine?: number;

	/**
	 * Expected end column number of the warning.
	 */
	endColumn?: number;

	/**
	 * Expected edit information of the warning.
	 */
	fix?: EditInfo;
};
