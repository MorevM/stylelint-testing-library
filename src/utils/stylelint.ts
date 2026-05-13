import stylelint from 'stylelint';
import type { LinterOptions, LinterResult } from 'stylelint';
import type { TestCase } from '#types';
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
