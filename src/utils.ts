import { isString, isUndefined, toNumber, tsObject } from '@morev/utils';
import stylelint from 'stylelint';
import type { PlainObject } from '@morev/utils';
import type { LinterOptions, LinterResult } from 'stylelint';
import type { CreateTestUtilsSchema, TestCase, TestFunctions } from '#types';
import type { InternalTestRuleSchema } from '#types/internal';

/**
 * Gets the resulting CSS string from the `linterOutput`,
 * checking for necessary parts in the process.
 *
 * @param   linterOutput   Stylelint output.
 *
 * @returns                Resulting CSS string of the Stylelint output
 *                         or `null` in case of an error.
 */
const getOutputCss = (linterOutput: LinterResult) => {
	const { results } = linterOutput;
	const { _postcssResult: result } = results[0];

	if (result?.root && result?.opts) {
		return result.root.toString(result.opts.syntax);
	}

	return null;
};

/**
 * Clears the object of keys that have the value `undefined`.
 *
 * @param   source   The source object.
 *
 * @returns          A new object without keys that was declared as `undefined` in the source object.
 */
export const omitUndefinedValues = (source: PlainObject<unknown>) => {
	return tsObject.fromEntries(
		tsObject.entries(source)
			.filter(([key, value]) => !isUndefined(value)),
	);
};

/**
 * Conditionally applies `skip` or `only` modifier to the base `it` or `describe` function.
 *
 * @param   baseEntity       Global `it` or `describe` function to apply a modifier to.
 * @param   modifiers        Source to determine the `baseEntity` modifier.
 * @param   modifiers.only   Whether to return `baseEntity` with `only` modifier.
 * @param   modifiers.skip   Whether to return `baseEntity` with `skip` modifier.
 *
 * @returns                  The `baseEntity` with the `skip`/`only` modifier or as given.
 */
export const applyModifiers = <T extends Exclude<TestFunctions['describe'], undefined>>(
	baseEntity: T,
	modifiers: { only?: boolean; skip?: boolean },
) => {
	return modifiers.only
		? baseEntity.only as T
		: modifiers.skip
			? baseEntity.skip as T
			: baseEntity;
};

/**
 * Gets options to pass into `stylelint.lint()` method
 * considering test case and schema options.
 *
 * @param   testCase   A test case.
 * @param   schema     A test schema.
 *
 * @returns            Options ready to pass into `stylelint.lint()` method.
 */
export const getStylelintOptions = (testCase: TestCase, schema: InternalTestRuleSchema): LinterOptions => {
	const { testRuleSchema, factorySchema, testUtilsSchema } = schema;
	const plugins = testRuleSchema.plugins ?? factorySchema.plugins ?? testUtilsSchema.plugins;
	const ruleName = testRuleSchema.ruleName ?? factorySchema.ruleName;

	return {
		code: testCase.code,
		config: {
			plugins,
			rules: {
				[ruleName]: testRuleSchema.config,
				...testUtilsSchema.extraRules,
				...factorySchema.extraRules,
				...testRuleSchema.extraRules,
			},
		},
		customSyntax: (() => {
			if ('customSyntax' in testCase) return testCase.customSyntax;
			if ('customSyntax' in testRuleSchema) return testRuleSchema.customSyntax;
			if ('customSyntax' in factorySchema) return factorySchema.customSyntax;
			return testUtilsSchema.customSyntax;
		})(),
		codeFilename: (() => {
			if ('codeFilename' in testCase) return testCase.codeFilename;
			if ('codeFilename' in testRuleSchema) return testRuleSchema.codeFilename;
		})(),
	};
};

/**
 * Runs `stylelint.lint` method with specified options.
 *
 * @param   options   Stylelint options.
 *
 * @returns           An object containing linter output and its extracted result.
 */
export const lintWithOptions = async (options: LinterOptions) => {
	const output = await stylelint.lint(options);
	const { results: [result] } = output;
	const outputCss = getOutputCss(output);

	return { output, result, outputCss };
};

/**
 * Retrieves (from a stack trace) the line number of the call
 * that follows the call with the specified function.
 *
 * @param   previousCallFunctionName   The name of the function that precedes the desired output.
 *
 * @returns                            Number of the line or `null` in case it could not be determined.
 */
export const fetchErrorLine = (previousCallFunctionName: string) => {
	try {
		throw new Error('error-to-catch-the-line');
	} catch (error: any) {
		if (!error.stack || !isString(error.stack)) return null;
		const stack = error.stack.split('\n');
		const errorFileLineIndex = stack
			.findIndex((item: string) => item.includes(previousCallFunctionName)) + 1;

		return toNumber(stack[errorFileLineIndex]?.match(/(\d+):\d+$/)?.[1], null);
	}
};

/**
 * Creates universal mappings for a testing functions ensuring operation on any test platform.
 *
 * @param   testFunctions   Testing functions provided by the user.
 *
 * @returns                 Universal mappings for functions ensuring operation on any test platform.
 *
 * @throws                  Throws if there are no required functions for testing.
 */
export const createUniversalMappings = (testFunctions: CreateTestUtilsSchema['testFunctions']) => {
	// @ts-expect-error -- Could be here, but there is no need to type in the project
	const expect = testFunctions?.expect ?? globalThis.expect;
	// @ts-expect-error -- Could be here, but there is no need to type in the project
	const assert = testFunctions?.assert ?? globalThis.assert;
	// @ts-expect-error -- Could be here, but there is no need to type in the project
	const describe = testFunctions?.describe ?? globalThis.describe;
	// @ts-expect-error -- Could be here, but there is no need to type in the project
	const it = testFunctions?.it ?? globalThis.it;

	if (!describe) {
		throw new Error('You must either pass `testFunctions.describe` explicitly, or make sure that `describe` exists in the global scope.');
	}
	if (!it) {
		throw new Error('You must either pass `testFunctions.it` explicitly, or make sure that `it` exists in the global scope.');
	}
	if (!expect && !assert) {
		throw new Error('You must either pass `testFunctions.assert` or `testFunctions.expect` explicitly, or make sure that such functions exist in the global scope.');
	}

	return {
		describe: describe!,
		it: it!,
		assert: {
			ok(value: unknown, message: string) {
				if (assert && 'ok' in assert) return assert.ok(value, message);
				return expect(!!value, message).toBe(true);
			},
			equal(actual: unknown, expected: unknown, message: string) {
				if (assert && 'equal' in assert) return assert.equal(actual, expected, message);
				return expect(actual, message).toBe(expected);
			},
			deepEqual(actual: unknown, expected: unknown, message: string) {
				if (assert && 'deepEqual' in assert) return assert.deepEqual(actual, expected, message);
				return expect(actual, message).toEqual(expected);
			},
			notDeepEqual(actual: unknown, expected: unknown, message: string) {
				if (assert && 'notDeepEqual' in assert) return assert.notDeepEqual(actual, expected, message);
				return expect(actual, message).not.toEqual(expected);
			},
			toMatchObject(actual: PlainObject, expected: PlainObject, message: string, meta: { index: number }) {
				// `expect().toMatchObject` has a better visual output.
				if (expect) {
					expect(actual, message).toMatchObject?.(expected);
				// `assert.partialDeepStrictEqual` is available since Node 22.13.0
				// (https://github.com/nodejs/node/pull/54630)
				} else if (assert && 'partialDeepStrictEqual' in assert) {
					assert.partialDeepStrictEqual(actual, expected, message);
				// If there is no `expect` or `assert.partialDeepStrictEqual` available
				// (e.g. using native Node<22.13.0 test runner), then match properties individually.
				} else {
					tsObject.entries(actual).forEach(([key, value]) => {
						if (key in expected) {
							this.equal(
								value,
								expected[key],
								`Property "${key}" on the warning with index "${meta.index}" does not match.`,
							);
						}
					});
				}
			},
		},
	};
};
