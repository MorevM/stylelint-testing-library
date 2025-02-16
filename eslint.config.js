import { combine, defineConfiguration, defineIgnores } from '@morev/eslint-config';

export default combine([
	defineIgnores({}),
	defineConfiguration('javascript'),
	defineConfiguration('node'),
	defineConfiguration('json'),
	defineConfiguration('markdown', {
		overrides: {
			'markdownlint/md033': 'off',
		},
	}),
	defineConfiguration('yaml'),
	defineConfiguration('html'),
	defineConfiguration('vitest', {
		overrides: {
			'vitest/require-hook': 'off',
		},
	}),
	defineConfiguration('typescript'),
]);
