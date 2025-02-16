/**
 * Testing functions provided by a test platform (`jest`, `vitest` or `node:test`/`node:assert`).
 */
export type TestFunctions = {
	describe?: Function & {
		skip: Function;
		only: Function;
	};
	it?: Function & {
		skip: Function;
		only: Function;
	};
	assert?: {
		ok: Function;
		deepEqual: Function;
		notDeepEqual: Function;
		strictEqual: Function;
		equal: Function;
		notEqual: Function;
		partialDeepStrictEqual?: Function;
	};
	expect?: (...args: any) => {
		toMatchObject?: Function;
		toBe: Function;
		toEqual: Function;
		not: {
			toEqual: Function;
		};
	};
};
