import { createTestRule, createTestRuleConfig } from '../testing-functions';
import { messages, ruleName } from './lowercase-selectors';

const testRule = createTestRule({ ruleName });
const testRuleConfig = createTestRuleConfig({ ruleName });

testRuleConfig({
	description: 'Primary option',
	accept: [
		{
			description: 'Rule turned on',
			config: true,
		},
		{
			description: 'Rule turned off',
			config: true,
		},
		{
			description: 'Rule is skipped (handled by Stylelint)',
			config: true,
		},
	],
});

testRuleConfig({
	description: 'Secondary option',
	accept: [
		{
			description: 'Secondary option is optional',
			config: [true, undefined],
		},
		{
			description: 'Key `ignore` is an array of strings',
			config: [true, { ignore: ['.FOO'] }],
		},
	],
	reject: [
		{
			description: 'Key `ignore` is a boolean',
			config: [true, { ignore: true }],
		},
		{
			description: 'Key `ignore` is not an array containing only strings',
			config: [true, { ignore: ['.FOO', true] }],
		},
	],
});

testRule({
	// description: 'Intentionally no description',
	config: true,
	accept: [
		{
			description: 'Class selector',
			code: '.foo {}',
		},
		{
			description: 'ID selector',
			code: '#foo {}',
		},
	],
	reject: [
		{
			// description: 'Intentionally no description',
			code: '.FOO {}',
			fixed: '.foo {}',
			message: messages.unexpected('.FOO'),
			line: 1, column: 1,
			endLine: 1, endColumn: 5,
		},
		{
			description: 'Multiple selectors',
			autoStripIndent: true,
			code: `
				.FOO {}
				.BAR {}
			`,
			fixed: `
				.foo {}
				.bar {}
			`,
			warnings: [
				{
					message: messages.unexpected('.FOO'),
					line: 1, column: 1,
					endLine: 1, endColumn: 5,
				},
				{
					message: messages.unexpected('.BAR'),
					line: 2, column: 1,
					endLine: 2, endColumn: 5,
				},
			],
		},
	],
});


testRule({
	description: 'Using `ignore` key',
	config: [true, { ignore: ['.FOO'] }],
	accept: [
		{
			description: 'Ignores selector specified by `ignore`',
			code: '.FOO {}',
		},
	],
	reject: [
		{
			description: 'Still reports other selectors',
			code: '.BAR {}',
			fixed: '.bar {}',
			warnings: [
				{
					message: messages.unexpected('.BAR'),
					line: 1, column: 1,
					endLine: 1, endColumn: 5,
				},
			],
		},
		{
			description: 'Skips only ignore selector',
			autoStripIndent: true,
			code: `
				.FOO {}
				.BAR {}
			`,
			fixed: `
				.FOO {}
				.bar {}
			`,
			warnings: [
				{
					message: messages.unexpected('.BAR'),
					line: 2, column: 1,
					endLine: 2, endColumn: 5,
				},
			],
		},
	],
});
