import { EOL } from 'node:os';
import { createTestUtils } from '#';
import { messages, plugin, ruleName } from '../fixtures/plugin-foo';

const { createTestRule } = createTestUtils({
	testGroupWithoutDescriptionAppearance: 'line-in-file',
});

const testRule = createTestRule({ ruleName,	plugins: [plugin] });

testRule({
	config: ['.a'],
	accept: [
		{
			code: '.a {}',
			// description: 'Simplest scenario',
		},
		{
			description: 'Example with description',
			code: '.a {}',
		},
		{
			description: 'Example with another description',
			code: '.a {}',
		},
	],

	reject: [
		{
			code: '#a {}',
			fixed: '.a {}',
			message: messages.rejected('#a'),
		},
		{
			code: '#a {}',
			fixed: '.a {}',
			message: messages.rejected('#a'),
			description: 'with description',
		},
		{
			code: '#a {}',
			fixed: '.a {}',
			message: messages.rejected('#a'),
			description: 'with location',
			line: 1, column: 1,
			endLine: 1, endColumn: 3,
		},
		{
			code: '#a {} #b {}',
			fixed: '.a {} .a {}',
			description: 'multiple warnings',
			warnings: [
				{
					message: messages.rejected('#a'),
				},
				{
					message: messages.rejected('#b'),
					line: 1, column: 7,
					endLine: 1, endColumn: 9,
				},
			],
		},
		{
			code: '#a {',
			message: 'Unclosed block (CssSyntaxError)',
			description: 'syntax error',
		},
	],
});

testRule({
	description: 'Some description',
	config: ['.a'],
	reject: [
		{
			code: '#a {}',
			fixed: '.a {}',
			message: messages.rejected('#a'),
		},
	],
});

testRule({
	config: ['.a', { filename: 'foo.css' }],
	codeFilename: 'foo.css',

	accept: [
		{ code: '.a {}' },
		{ code: '.a {}', codeFilename: 'foo.css' },
	],

	reject: [
		{
			code: '#a {}',
			codeFilename: 'bar.css',
			message: messages.expectFilename('foo.css', 'bar.css'),
		},
	],
});


testRule({
	config: ['.a', { prependNewline: true }],

	reject: [
		{
			description: 'preserves CRLF if explicitly defined',
			code: '.a {\r\n}',
			fixed: '\r\n.a {\r\n}',
			message: messages.expectNewline('.a'),
		},
		{
			description: 'preserves LF if explicitly defined',
			code: '.a {\n}',
			fixed: '\n.a {\n}',
			message: messages.expectNewline('.a'),
		},
		{
			description: 'falls back to system EOL by default',
			code: '.a {}',
			fixed: `${EOL}.a {}`,
			message: messages.expectNewline('.a'),
		},
		{
			description: 'falls back to CRLF if defined',
			code: '.a {}',
			fixed: `\r\n.a {}`,
			contextNewlineFallback: 'crlf',
			message: messages.expectNewline('.a'),
		},
		{
			description: 'falls back to LF if defined',
			code: '.a {}',
			fixed: `\n.a {}`,
			contextNewlineFallback: 'lf',
			message: messages.expectNewline('.a'),
		},
	],
});
