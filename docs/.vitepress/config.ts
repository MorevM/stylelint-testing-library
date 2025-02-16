import { transformerRenderWhitespace } from '@shikijs/transformers';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Stylelint testing utils',
	description: 'Platform agnostic solution for testing Stylelint plugins',
	base: '/stylelint-testing-library/',
	markdown: {
		codeTransformers: [
			transformerRenderWhitespace({
				position: 'boundary',
			}),
		],
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		outline: {
			level: [2, 3],
		},

		nav: [
			{
				text: 'Guide',
				items: [
					{ text: 'Installation', link: '/guide/installation' },
					{ text: 'Usage', link: '/guide/usage' },
				],
			},
			{
				text: 'API reference',
				items: [
					{ text: 'createTestUtils', link: '/api/create-test-utils' },
					{ text: 'createTestRule', link: '/api/create-test-rule' },
					{ text: 'testRule', link: '/api/test-rule' },
					{ text: 'createTestRuleConfig', link: '/api/create-test-rule-config' },
					{ text: 'testRuleConfig', link: '/api/test-rule-config' },
				],
			},
		],

		sidebar: [
			{
				text: 'Guide',
				items: [
					{
						text: 'Installation',
						link: '/guide/installation',
						items: [
							{ text: 'Setup using `vitest`', link: '/guide/setup-using-vitest' },
							{ text: 'Setup using `jest`', link: '/guide/setup-using-jest' },
							{ text: 'Setup using `node:test`', link: '/guide/setup-using-node-test' },
						],
					},
					{
						text: 'Usage',
						link: '/guide/usage',
					},
				],
			},
			{
				text: 'API reference',
				items: [
					{
						text: 'createTestUtils',
						link: '/api/create-test-utils',
						items: [
							{
								text: 'createTestRule',
								link: '/api/create-test-rule',
								items: [
									{ text: 'testRule', link: '/api/test-rule' },
								],
							},
							{
								text: 'createTestRuleConfig',
								link: '/api/create-test-rule-config',
								items: [
									{ text: 'testRuleConfig', link: '/api/test-rule-config' },
								],
							},
						],
					},
				],
			},
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/morevm/stylelint-testing-library' },
		],
	},
});
