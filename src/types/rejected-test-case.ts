import type { PartialOptional } from '@morev/utils';
import type { TestCase, Warning } from '#types';

/**
 * A test case that should be rejected by `stylelint`.
 *
 * Use the `warnings` property, rather than `message`, `line`, and `column`,
 * if the test case is expected to produce more than one warning.
 */
export type RejectedTestCase = TestCase & PartialOptional<Warning, 'message'> & {
	/**
	 * Expected fixed code of the test case.
	 */
	fixed?: string;

	/**
	 * Warning objects containing expected `message`, `line` and `column` etc.
	 * Optional if `message` is used.
	 */
	warnings?: Warning[];
};
