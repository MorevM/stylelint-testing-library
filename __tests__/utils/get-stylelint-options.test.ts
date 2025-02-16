import { assert, describe, expect, it } from 'vitest';
import { createUniversalMappings, getStylelintOptions } from '#utils';

const testFunctions = { describe, it, assert };
const universal = createUniversalMappings(testFunctions);
const TEST_CODE = 'a {}';

describe('utils', () => {
	describe('get-stylelint-options', () => {
		describe('plugins', () => {
			it('Reads `plugins` from `testUtilsSchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: ['test-utils-schema'],
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: ['test-utils-schema'],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});

			it('Reads `plugins` from `factorySchema`, it takes precedence over `testUtilsSchema` if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: ['test-utils-schema'],
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: {
						ruleName: 'foo',
						plugins: ['factory-schema'],
					},
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: ['factory-schema'],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});

			it('Reads `plugins` from `testRuleSchema`, it takes precedence over `testUtilsSchema` and `factorySchema` if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: ['test-utils-schema'],
					},
					testRuleSchema: {
						config: true,
						accept: [],
						plugins: ['test-rule-schema'],
					},
					factorySchema: {
						ruleName: 'foo',
						plugins: ['factory-schema'],
					},
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: ['test-rule-schema'],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});
		});

		describe('customSyntax', () => {
			it('Reads `customSyntax` from `testUtilsSchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: 'test-utils',
					codeFilename: undefined,
				});
			});

			it('Reads `customSyntax` from `factorySchema`, it takes precedence over `testUtilsSchema` if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo', customSyntax: 'factory' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: 'factory',
					codeFilename: undefined,
				});
			});

			it('`customSyntax` can be set as `undefined` from `factorySchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo', customSyntax: undefined },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});

			it('Reads `customSyntax` from `testRuleSchema`, it takes precedence over `testUtilsSchema` and `factorySchema` if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [], customSyntax: 'test-rule' },
					factorySchema: { ruleName: 'foo', customSyntax: 'factory' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: 'test-rule',
					codeFilename: undefined,
				});
			});

			it('`customSyntax` can be set as `undefined` from `testRuleSchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [], customSyntax: undefined },
					factorySchema: { ruleName: 'foo', customSyntax: 'factory' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});

			it('Reads `customSyntax` from a test case, it takes precedence over schemas if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE, customSyntax: 'test' }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [], customSyntax: 'test-rule' },
					factorySchema: { ruleName: 'foo', customSyntax: 'factory' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: 'test',
					codeFilename: undefined,
				});
			});

			it('`customSyntax` can be set as `undefined` within a test case', () => {
				const options = getStylelintOptions({ code: TEST_CODE, customSyntax: undefined }, {
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
						customSyntax: 'test-utils',
					},
					testRuleSchema: { config: true, accept: [], customSyntax: 'test-rule' },
					factorySchema: { ruleName: 'foo', customSyntax: 'factory' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});
		});

		describe('codeFilename', () => {
			it('Reads `codeFilename` from `testUtilsSchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
					},
					testRuleSchema: { config: true, accept: [], codeFilename: 'test-rule.css' },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: 'test-rule.css',
				});
			});

			it('Reads `codeFilename` from a test case, it takes precedence over `testRuleSchema` if specified', () => {
				const options = getStylelintOptions({ code: TEST_CODE, codeFilename: 'test.css' }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
					},
					testRuleSchema: { config: true, accept: [], codeFilename: 'test-rule.css' },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: 'test.css',
				});
			});

			it('`codeFilename` can be set as `undefined` in a test case', () => {
				const options = getStylelintOptions({ code: TEST_CODE, codeFilename: undefined }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [],
					},
					testRuleSchema: { config: true, accept: [], codeFilename: 'test-rule.css' },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options).toStrictEqual({
					code: TEST_CODE,
					config: {
						plugins: [],
						rules: {
							foo: true,
						},
					},
					customSyntax: undefined,
					codeFilename: undefined,
				});
			});
		});
	});
});
