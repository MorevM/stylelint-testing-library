import { inspect } from 'node:util';
import { capitalize, isEmpty, isNull, stripIndent } from '@morev/utils';
import { applyModifiers, fetchErrorLine, lintWithOptions } from '#utils';
import type { TestRuleConfig, TestRuleConfigSchema } from '#types';
import type { InternalCreateTestRuleConfigSchema, InternalTestRuleConfigComparison, InternalTestRuleConfigOptions, InternalTestRuleConfigSchema } from '#types/internal';

const testRuleConfig = (schema: InternalTestRuleConfigSchema) => {
	const {
		testUtilsSchema,
		testRuleConfigSchema,
		factorySchema,
		groupIndex,
		universal,
	} = schema;

	const {
		testCaseWithoutDescriptionAppearance,
		testGroupWithoutDescriptionAppearance,
	} = testUtilsSchema;

	// Check if there are test cases to run.
	universal.assert.ok(
		!isEmpty(testRuleConfigSchema.accept) || !isEmpty(testRuleConfigSchema.reject),
		'There are no test cases',
	);

	const plugins = testRuleConfigSchema.plugins ?? factorySchema.plugins ?? testUtilsSchema.plugins;
	const ruleName = testRuleConfigSchema.ruleName ?? factorySchema.ruleName;

	const testConfig = (
		options: InternalTestRuleConfigOptions,
		comparisons: InternalTestRuleConfigComparison,
	) => {
		const { testCase, name, index } = options;
		const testFunction = applyModifiers(universal.it, {
			...testRuleConfigSchema,
			...testCase,
		});

		const description = (() => {
			if (testCase.description) return testCase.description;
			return testCaseWithoutDescriptionAppearance === 'case-index'
				? `${capitalize(name)} test case #${index + 1}`
				: inspect(testCase.config);
		})();

		testFunction(description, async () => {
			const { result } = await lintWithOptions({
				code: '',
				config: {
					plugins,
					rules: {
						[ruleName]: testCase.config,
					},
				},
			});

			comparisons(result.invalidOptionWarnings);
		});
	};

	const groupLineIndex = testGroupWithoutDescriptionAppearance === 'line-in-file'
		? fetchErrorLine('testRuleTemplate')
		: null;

	const testGroup = applyModifiers(universal.describe, testRuleConfigSchema);
	const actualRuleName = testRuleConfigSchema.ruleName ?? factorySchema.ruleName;
	const nameSuffix = (() => {
		if (testRuleConfigSchema.description) return testRuleConfigSchema.description;
		if (testGroupWithoutDescriptionAppearance === 'line-in-file' && !isNull(groupLineIndex)) {
			return `line ${groupLineIndex} in the source file`;
		}
		return `group #${groupIndex}`;
	})();

	testGroup(`\`${actualRuleName}\` configs: ${nameSuffix}`, () => {
		// Accept test cases
		!isEmpty(testRuleConfigSchema.accept) && universal.describe('accept', () => {
			testRuleConfigSchema.accept!.forEach((testCase, index) => {
				testConfig({ testCase, name: 'accept', index }, (warnings) => {
					universal.assert.deepEqual(
						warnings,
						[],
						stripIndent(`
							The config is invalid, but should be considered valid.
							Errors are shown below
						`),
					);
				});
			});
		});
		// Reject test cases
		!isEmpty(testRuleConfigSchema.reject) && universal.describe('reject', () => {
			testRuleConfigSchema.reject!.forEach((testCase, index) => {
				return testConfig({ testCase, name: 'reject', index }, (warnings) => {
					universal.assert.notDeepEqual(warnings, [], 'The config is valid, but should be considered invalid');
				});
			});
		});
	});
};

/**
 * Creates a `testRuleConfig` function to test Stylelint rule configs.
 *
 * @param   factorySchema   Options to setup Stylelint and rule name.
 *
 * @returns                 A function to test the rule configs.
 */
export const createTestRuleConfig = (
	factorySchema: InternalCreateTestRuleConfigSchema,
): TestRuleConfig => {
	let index = 0;

	const bind = (testRuleConfigSchema: TestRuleConfigSchema) =>
		testRuleConfig({
			...factorySchema,
			testRuleConfigSchema,
			groupIndex: ++index,
		});

	const testRuleTemplate = (testRuleConfigSchema: TestRuleConfigSchema) =>
		bind(testRuleConfigSchema);
	testRuleTemplate.skip = (testRuleConfigSchema: TestRuleConfigSchema) =>
		bind({ ...testRuleConfigSchema, skip: true });
	testRuleTemplate.only = (testRuleConfigSchema: TestRuleConfigSchema) =>
		bind({ ...testRuleConfigSchema, only: true });

	return testRuleTemplate as unknown as TestRuleConfig;
};
