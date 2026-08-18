import { createDefaultEsmPreset } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
	tsconfig: {
		module: 'ES2022',
	},
});

export default {
	...presetConfig,
	testEnvironment: 'node',
} satisfies JestConfigWithTsJest;
