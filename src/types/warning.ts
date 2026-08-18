import type { EditInfo } from 'stylelint';

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
