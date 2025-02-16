import { beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

describe('Build', () => {
	beforeAll(() => execSync('yarn build'));

	it('Forms ESM exports', () => {
		expect(existsSync('./dist/index.js')).toBe(true);
		expect(existsSync('./dist/index.d.ts')).toBe(true);
	});

	it('Forms CJS exports', () => {
		expect(existsSync('./dist/index.cjs')).toBe(true);
		expect(existsSync('./dist/index.d.cts')).toBe(true);
	});
});
