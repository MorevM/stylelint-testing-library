import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		exclude: [
			...configDefaults.exclude,
			'./examples/**',
		],
		watch: false,
		globals: true,
		reporters: ['verbose'],
		coverage: {
			enabled: false,
			provider: 'v8',
			all: false,
		},
	},
});
