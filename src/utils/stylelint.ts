import { deepClone, isString, toArray } from '@morev/utils';
import stylelint from 'stylelint';
import type { LinterOptions, LinterResult, Plugin, Rule, RuleContext } from 'stylelint';
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
 * Wraps a Stylelint rule and overrides the `context.newline` value.
 *
 * This is required because Stylelint derives `context.newline`
 * from the tested source code. When the source contains no line breaks,
 * the value becomes platform-dependent (`\n` or `\r\n`), which makes
 * snapshot and autofix tests non-deterministic across operating systems.
 *
 * @see https://github.com/stylelint/stylelint/issues/9281
 *
 * @param   rule           Original Stylelint rule function.
 * @param   newlineStyle   Newline style to inject into the rule context.
 *
 * @returns                Wrapped rule with overridden `context.newline`.
 */
const withContextNewline = (rule: Rule, newlineStyle: 'lf' | 'crlf') => {
	const newlineSequence = newlineStyle === 'lf'
		? '\n'
		: '\r\n';

	const wrappedRule = (
		primaryOption: any,
		secondaryOptions: any,
		context: RuleContext,
	) => {
		return rule(
			primaryOption,
			secondaryOptions,
			Object.create(
				Object.getPrototypeOf(context),
				{
					...Object.getOwnPropertyDescriptors(context),
					newline: {
						value: newlineSequence,
						writable: true,
						enumerable: true,
						configurable: true,
					},
				},
			),
		);
	};

	Object.defineProperties(
		wrappedRule,
		Object.getOwnPropertyDescriptors(rule),
	);

	return wrappedRule as Rule;
};

/**
 * Wraps a Stylelint rule with deterministic `context.newline` override.
 *
 * @param   plugin_        Stylelint plugin object.
 * @param   newlineStyle   Newline style to inject into rule contexts.
 *
 * @returns                A new plugin instance with wrapped rules.
 */
const wrapPluginRule = (plugin_: Plugin, newlineStyle: 'lf' | 'crlf') => {
	// `deepClone` prevents mutation of shared plugin instances
	// that may be reused across multiple tests.
	const plugin = deepClone(plugin_);

	if ('default' in plugin && plugin.default) {
		plugin.default.rule = withContextNewline(plugin.default.rule, newlineStyle);
	}

	if ('rule' in plugin && plugin.rule) {
		plugin.rule = withContextNewline(plugin.rule, newlineStyle);
	}

	return plugin;
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
export const getStylelintOptions = (testCase: TestCase, schema: InternalTestRuleSchema) => {
	const { testRuleSchema, factorySchema, testUtilsSchema } = schema;
	const ruleName = testRuleSchema.ruleName ?? factorySchema.ruleName;

	let plugins = testRuleSchema.plugins
		?? factorySchema.plugins
		?? testUtilsSchema.plugins;

	const newlineFallback = testCase.contextNewlineFallback
		?? testRuleSchema.contextNewlineFallback
		?? factorySchema.contextNewlineFallback
		?? testUtilsSchema.contextNewlineFallback
		?? 'system';

	// Stylelint uses `node:os.EOL` as a fallback for `context.newline` if source
	// does not explicitly contain a line break character (`\n`, `\r\n`),
	// which makes the tests platform-dependent.
	// This code replaces the context with the specified value in such cases.
	// @see https://github.com/stylelint/stylelint/issues/9281
	const codeContainsNewline = !!testCase.code.match(/\r?\n/);
	if (plugins && !codeContainsNewline && newlineFallback !== 'system') {
		plugins = toArray(plugins).map((plugin) => {
			if (isString(plugin)) return plugin;

			return wrapPluginRule(plugin, newlineFallback);
		});
	}

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
	} satisfies LinterOptions;
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
