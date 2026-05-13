import { assert, describe, expect, it, vi } from 'vitest';
import { isString } from '@morev/utils';
import { createUniversalMappings, getStylelintOptions } from '#utils';
import type { Plugin, Rule, RuleContext } from 'stylelint';

type RulePlugin = Extract<Plugin, { rule: Rule; ruleName: string }>;

const testFunctions = { describe, it, assert };
const universal = createUniversalMappings(testFunctions);
const TEST_CODE = 'a {}';

const createPlugin = () => {
	let capturedContext: RuleContext | undefined;
	const ruleName = 'plugin/foo';

	const rule = vi.fn((primary, secondaryOptions, context: RuleContext) => {
		capturedContext = context;
		return () => ({ primary, secondaryOptions, context });
	}) as unknown as Rule;

	rule.ruleName = ruleName;
	rule.messages = {};
	rule.meta = { fixable: true, url: '' };

	const plugin: Plugin = { ruleName, rule };

	return {
		plugin,
		rule,
		getCapturedContext: () => capturedContext,
	};
};

const getFirstPlugin = (options: ReturnType<typeof getStylelintOptions>) => {
	const { plugins } = options.config;

	return Array.isArray(plugins)
		? plugins[0]
		: plugins;
};

const expectRulePlugin = (plugin: Plugin | string | undefined): RulePlugin => {
	expect(plugin).toBeDefined();
	expect(typeof plugin).not.toBe('string');

	if (!plugin || isString(plugin) || !('rule' in plugin)) {
		throw new TypeError('Expected plugin object with direct `rule` property');
	}

	return plugin;
};

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
					universal,
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

		describe('contextNewlineFallback', () => {
			it('Wraps object plugins when `contextNewlineFallback` is set and code has no linebreaks', () => {
				const { plugin, rule, getCapturedContext } = createPlugin();
				const options = getStylelintOptions({ code: TEST_CODE, contextNewlineFallback: 'lf' }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [plugin],
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo' },
				});

				const wrappedPlugin = expectRulePlugin(getFirstPlugin(options));
				const context = { fix: true };

				expect(wrappedPlugin).not.toBe(plugin);
				expect(wrappedPlugin.rule).not.toBe(rule);
				expect(wrappedPlugin.rule.ruleName).toBe(rule.ruleName);
				expect(wrappedPlugin.rule.messages).toBe(rule.messages);
				expect('newline' in context).toBe(false);

				wrappedPlugin.rule(true, undefined, context);

				expect(getCapturedContext()).toMatchObject({
					fix: true,
					newline: '\n',
				});
				expect(getCapturedContext()).not.toBe(context);
				expect('newline' in context).toBe(false);
			});

			it('Does not wrap object plugins when code already contains linebreaks', () => {
				const { plugin, rule } = createPlugin();
				const options = getStylelintOptions({ code: 'a {\n}', contextNewlineFallback: 'crlf' }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [plugin],
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo' },
				});

				const actualPlugin = expectRulePlugin(getFirstPlugin(options));

				expect(actualPlugin).toBe(plugin);
				expect(actualPlugin.rule).toBe(rule);
			});

			it('Does not wrap string plugins even when `contextNewlineFallback` is set', () => {
				const options = getStylelintOptions({ code: TEST_CODE, contextNewlineFallback: 'crlf' }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: ['./plugin.js'],
					},
					testRuleSchema: { config: true, accept: [] },
					factorySchema: { ruleName: 'foo' },
				});

				expect(options.config?.plugins).toStrictEqual(['./plugin.js']);
			});

			it('Uses test-case fallback with higher priority than schema fallbacks', () => {
				const { plugin, getCapturedContext } = createPlugin();
				const options = getStylelintOptions({ code: TEST_CODE, contextNewlineFallback: 'crlf' }, {
					universal,
					groupIndex: 1,
					testUtilsSchema: {
						testFunctions,
						plugins: [plugin],
						contextNewlineFallback: 'lf',
					},
					testRuleSchema: {
						config: true,
						accept: [],
						contextNewlineFallback: 'lf',
					},
					factorySchema: {
						ruleName: 'foo',
						contextNewlineFallback: 'lf',
					},
				});

				const wrappedPlugin = expectRulePlugin(getFirstPlugin(options));
				wrappedPlugin.rule(true, undefined, {});

				expect(getCapturedContext()).toMatchObject({
					newline: '\r\n',
				});
			});
		});

		describe('customSyntax', () => {
			it('Reads `customSyntax` from `testUtilsSchema`', () => {
				const options = getStylelintOptions({ code: TEST_CODE }, {
					universal,
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
					universal,
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
					universal,
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
					universal,
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
					universal,
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
					universal,
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
					universal,
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
