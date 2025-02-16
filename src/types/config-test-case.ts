/**
 * A configuration test case.
 */
export type ConfigTestCase = {
	/**
	 * Config of the test case.
	 */
	config: unknown;

	/**
	 * Description of the test case.
	 */
	description?: string;

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
};
