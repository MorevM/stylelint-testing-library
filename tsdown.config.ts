import { defineConfig } from 'tsdown';

export default defineConfig({
	sourcemap: false,
	clean: true,
	target: 'esnext',
	format: ['cjs', 'esm'],
	outDir: './dist',
	dts: {
		entry: 'src/index.ts',
	},
	entry: [
		'src/index.ts',
	],
	outExtensions: ({ format }) => ({ js: format === 'cjs' ? `.${format}` : `.js` }),
});
