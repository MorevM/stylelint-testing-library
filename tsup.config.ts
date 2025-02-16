import type { Options } from 'tsup';

export const tsup: Options = {
	sourcemap: false,
	clean: true,
	target: 'esnext',
	format: ['cjs', 'esm'],
	outDir: './dist',
	dts: {
		entry: 'src/index.ts',
	},
	entryPoints: [
		'src/index.ts',
	],
	external: [
		'@morev/utils',
		'stylelint',
		'vitest',
	],
	outExtension: ({ format }) => ({ js: format === 'cjs' ? `.${format}` : `.js` }),
};
