import { assert, describe, expect, it } from 'vitest';
import { createTestUtils } from '#';
import { plugin, ruleName } from '../fixtures/plugin-foo';

const { createTestRuleConfig } = createTestUtils({
	testFunctions: { it, describe, assert, expect },
	plugins: [plugin],
	testGroupWithoutDescriptionAppearance: 'line-in-file',
});
const testRuleConfig = createTestRuleConfig({ ruleName });

testRuleConfig({
	accept: [
		{
			description: 'Rule turned off',
			config: null,
		},
		{
			description: 'Rule turned off with valid secondary option',
			config: [null, { filename: 'foo.scss' }],
		},
		{
			description: 'Rule turned off with invalid secondary option',
			config: [null, { filename: true }],
		},
		{
			description: 'Primary option is a string as expected',
			config: 'always',
		},
		{
			// description: 'Test case without description',
			config: '',
		},
		{
			description: 'With valid secondary option',
			config: ['foo', { filename: 'foo.css' }],
		},
	],
	reject: [
		{
			description: 'Primary is boolean type',
			config: true,
		},
		{
			description: 'Primary is valid, but secondary is not',
			config: ['foo', { filename: 1 }],
		},
		{
			description: 'Primary is valid, but secondary is missed',
			config: ['foo', { foo: 1 }],
		},
	],
});
