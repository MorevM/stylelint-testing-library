import { inspect } from 'node:util';
import { capitalize, isEmpty, isNull, isString, isUndefined, stripIndent } from '@morev/utils';
import { applyModifiers, fetchErrorLine, getStylelintOptions, lintWithOptions, omitUndefinedValues } from '#utils';
import type { AcceptedTestCase, RejectedTestCase, TestRule, TestRuleSchema } from '#types';
import type { InternalCreateTestRuleSchema, InternalSetupOptions, InternalTestRuleSchema } from '#types/internal';

const setupTestCases = (options: InternalSetupOptions) => {
	const {
		testUtilsSchema: {
			testCaseWithoutDescriptionAppearance = 'case-index',
		},
		testUtilsSchema,
		testRuleSchema,
		factorySchema,
		universal,
	} = options;

	const validCases = options.cases.filter(Boolean);
	if (!validCases.length) return;

	const testGroup = applyModifiers(universal.describe, options.testRuleSchema);

	testGroup(options.name, () => {
		validCases.forEach((testCase, index) => {
			const testFunction = applyModifiers(universal.it, testCase);

			const shouldStripIndent = testCase.autoStripIndent
				?? testRuleSchema.autoStripIndent
				?? factorySchema.autoStripIndent
				?? testUtilsSchema.autoStripIndent;

			if (shouldStripIndent) {
				testCase.code = stripIndent(testCase.code);

				if ('fixed' in testCase && isString(testCase.fixed)) {
					testCase.fixed = stripIndent(testCase.fixed);
				}
			}

			const description = (() => {
				if (testCase.description) return testCase.description;
				return testCaseWithoutDescriptionAppearance === 'case-index'
					? `${capitalize(options.name)} test case #${index + 1}`
					: inspect(testCase.code);
			})();

			testFunction(description, options.comparisons(testCase, index));
		});
	});
};

const testRule = (schema: InternalTestRuleSchema) => {
	const {
		testUtilsSchema: {
			testGroupWithoutDescriptionAppearance,
		},
		factorySchema,
		testRuleSchema,
		groupIndex,
		universal,
	} = schema;

	const testGroupLine = testGroupWithoutDescriptionAppearance === 'line-in-file'
		? fetchErrorLine('testRuleTemplate')
		: null;

	// Check if there are test cases to run.
	universal.assert.ok(
		!isEmpty(testRuleSchema.accept) || !isEmpty(testRuleSchema.reject),
		'There are no test cases',
	);

	const nameSuffix = (() => {
		if (testRuleSchema.description) return testRuleSchema.description;
		return testGroupWithoutDescriptionAppearance === 'config'
			? inspect(testRuleSchema.config)
			: (() => {
				if (testGroupWithoutDescriptionAppearance === 'line-in-file' && !isNull(testGroupLine)) {
					return `line ${testGroupLine} in the source file`;
				}
				return `group #${groupIndex}`;
			})();
	})();

	const actualRuleName = testRuleSchema.ruleName ?? factorySchema.ruleName;
	universal.describe(`${actualRuleName}: ${nameSuffix}`, () => {
		// `Accept` scenarios
		!isEmpty(testRuleSchema.accept) && setupTestCases({
			...schema,
			name: 'accept',
			cases: testRuleSchema.accept,
			comparisons: (testCase: AcceptedTestCase) => async () => {
				const stylelintOptions = getStylelintOptions(testCase, schema);
				const { result } = await lintWithOptions(stylelintOptions);

				const { warnings, parseErrors, invalidOptionWarnings } = result;

				universal.assert.ok(result, 'No lint result');
				universal.assert.deepEqual(parseErrors, [], 'Parse errors are not empty');
				universal.assert.deepEqual(warnings, [], 'Warnings are not empty');
				universal.assert.deepEqual(
					invalidOptionWarnings,
					[],
					stripIndent(`
						Stylelint config errors are not empty.
						Please use \`testRuleConfig\` function to test configuration options.
					`),
				);
			},
		});

		// `Reject` scenarios
		!isEmpty(testRuleSchema.reject) && setupTestCases({
			...schema,
			name: 'reject',
			cases: testRuleSchema.reject,
			comparisons: (testCase: RejectedTestCase, caseIndex: number) => async () => {
				const stylelintOptions = getStylelintOptions(testCase, schema);
				const { result } = await lintWithOptions(stylelintOptions);

				universal.assert.ok(result, 'No lint result');

				const { warnings: actualWarnings, parseErrors, invalidOptionWarnings } = result;

				universal.assert.deepEqual(parseErrors, [], 'Parse errors are not empty');
				universal.assert.deepEqual(
					invalidOptionWarnings,
					[],
					stripIndent(`
						Stylelint config errors are not empty.
						Please use \`testRuleConfig\` function to test configuration options.
					`),
				);

				const expectedWarnings = (testCase.warnings ?? [testCase])
					.map((warning) => omitUndefinedValues({
						text: warning.message,
						line: warning.line,
						column: warning.column,
						endLine: warning.endLine,
						endColumn: warning.endColumn,
					}));

				const hasCasesWithoutDescription = expectedWarnings.some((warning) => isUndefined(warning.text));
				universal.assert.equal(
					hasCasesWithoutDescription,
					false,
					stripIndent(`
						Test case with index "${caseIndex}" does not have a "message" property.
						All "reject" test cases must have a "message" property at least.
					`),
				);

				if (expectedWarnings.length !== actualWarnings.length) {
					universal.assert.deepEqual(
						actualWarnings.length ? actualWarnings : expectedWarnings,
						[],
						stripIndent(`
							Warnings count does not match.
							Expected ${expectedWarnings.length} warning(s), but got ${actualWarnings.length}.
							Actual warnings are shown below.
						`),
					);
				}

				expectedWarnings.forEach((expectedWarning, index) => {
					universal.assert.toMatchObject(
						actualWarnings[index],
						expectedWarning,
						`Warning with index "${index}" does not match`,
						{ index },
					);
				});

				if (!testCase.fixed) return;

				const {
					result: fixedResult,
					outputCss: fixedCode,
				} = await lintWithOptions({ ...stylelintOptions, fix: true });

				universal.assert.deepEqual(fixedResult.parseErrors, [], 'Parse errors of the fixed code are not empty');
				universal.assert.equal(fixedCode, testCase.fixed, 'Fixed code does not match `fixed`');

				// Checks whether only errors other than those fixed are reported
				const { result: afterFixResult } = await lintWithOptions({
					...stylelintOptions,
					code: fixedCode ?? '',
					fix: true,
				});

				universal.assert.deepEqual(
					afterFixResult.warnings,
					fixedResult.warnings,
					'Warnings do not match',
				);
			},
		});
	});
};

/**
 * Creates a `testRule` function to test Stylelint rules.
 *
 * @param   schema   Options to setup Stylelint and rule name.
 *
 * @returns          A function to test the rule.
 */
export const createTestRule = (schema: InternalCreateTestRuleSchema): TestRule => {
	let index = 0;

	const bind = (testRuleSchema: TestRuleSchema) =>
		testRule({ ...schema, testRuleSchema, groupIndex: ++index });

	const testRuleTemplate = (testRuleSchema: TestRuleSchema) => bind(testRuleSchema);
	testRuleTemplate.skip = (testRuleSchema: TestRuleSchema) => bind({ ...testRuleSchema, skip: true });
	testRuleTemplate.only = (testRuleSchema: TestRuleSchema) => bind({ ...testRuleSchema, only: true });

	return testRuleTemplate as unknown as TestRule;
};
