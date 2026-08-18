import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import stylelint from 'stylelint';
import { createTestUtils } from '#';
import { messages, plugin, ruleName } from './fixtures/plugin-foo';
import type { CreateTestUtilsSchema } from '#types';

const createTestingVariables = (options?: Omit<CreateTestUtilsSchema, 'testFunctions'>) => {
	const describeMock = vi.fn();
	const itMock = vi.fn();

	const { createTestRule } = createTestUtils({
		testFunctions: {
			/* @ts-expect-error -- Trust me */
			it: itMock,
			/* @ts-expect-error -- Trust me */
			describe: describeMock,
			assert,
			expect,
		},
		...options,
	});

	return { createTestRule, describeMock, itMock };
};

// Unlike `createTestingVariables`, this one runs the `describe` callback, so the
// comparisons registered through `it` can be picked up and awaited by hand.
const createRunnableTestingVariables = (options?: Omit<CreateTestUtilsSchema, 'testFunctions'>) => {
	const itMock = vi.fn();

	const { createTestRule } = createTestUtils({
		testFunctions: {
			/* @ts-expect-error -- Trust me */
			it: itMock,
			/* @ts-expect-error -- Trust me */
			describe: (_description: string, callback: () => void) => callback(),
			assert,
			expect,
		},
		...options,
	});

	const runFirstCase = async () => {
		const [, comparison] = itMock.mock.calls[0] as unknown as [string, () => Promise<void>];

		return comparison();
	};

	return { createTestRule, runFirstCase };
};

describe('create-test-rule', () => {
	afterEach(() => { vi.resetAllMocks(); });

	it('Throws if there are no test cases', () => {
		const { createTestRule } = createTestingVariables();
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		expect(() => testRule({ config: true, accept: [], reject: [] })).toThrow('There are no test cases');
	});

	it('Reads `ruleName` from the factory', () => {
		const { createTestRule, describeMock } = createTestingVariables();
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenCalledWith('plugin/foo: group #1', expect.any(Function));
	});

	it('Reads `ruleName` from `testRule`, it takes precedence over the factory `ruleName` if specified', () => {
		const { createTestRule, describeMock } = createTestingVariables({});
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			ruleName: 'plugin/bar',
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenCalledWith('plugin/bar: group #1', expect.any(Function));
	});

	it('Respects `testGroupWithoutDescriptionAppearance === \'group-index\'` (default) option', () => {
		const { createTestRule, describeMock } = createTestingVariables({});
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenCalledWith('plugin/foo: group #1', expect.any(Function));
	});

	it('Respects `testGroupWithoutDescriptionAppearance === \'config\'` option', () => {
		const { createTestRule, describeMock } = createTestingVariables({ testGroupWithoutDescriptionAppearance: 'config' });
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenCalledWith('plugin/foo: true', expect.any(Function));
	});

	it('Respects `testGroupWithoutDescriptionAppearance === \'line-in-file\'` option', () => {
		const { createTestRule, describeMock } = createTestingVariables({ testGroupWithoutDescriptionAppearance: 'line-in-file' });
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			config: true,
			reject: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenCalledWith('plugin/foo: line 115 in the source file', expect.any(Function));
	});

	it('Increments group index on consecutive calls', () => {
		const { createTestRule, describeMock } = createTestingVariables({});
		const testRule = createTestRule({ ruleName,	plugins: [plugin] });

		testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenLastCalledWith('plugin/foo: group #1', expect.any(Function));

		testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(describeMock).toHaveBeenLastCalledWith('plugin/foo: group #2', expect.any(Function));
	});

	it('Does not mutate test cases when stripping indentation', () => {
		const { createTestRule } = createRunnableTestingVariables();
		const testRule = createTestRule({ ruleName, plugins: [plugin] });
		const testCase = {
			code: `
				#a {}
			`,
			fixed: `
				.a {}
			`,
			message: messages.rejected('#a'),
		};
		const originalTestCase = { ...testCase };

		testRule({
			autoStripIndent: true,
			config: ['.a'],
			reject: [testCase],
		});

		expect(testCase).toStrictEqual(originalTestCase);
	});

	it('Fails a `reject` case whose fixer silences the problem without repairing it', async () => {
		const { createTestRule, runFirstCase } = createRunnableTestingVariables();
		const testRule = createTestRule({ ruleName, plugins: [plugin] });

		testRule({
			config: ['.a', { brokenFixer: true }],
			reject: [
				{
					code: '#a {}',
					fixed: '#a {}',
					message: messages.rejected('#a'),
				},
			],
		});

		await expect(runFirstCase()).rejects.toThrow(
			'A fixer may have suppressed a warning without resolving it.',
		);
	});

	it('Preserves fixable changes when another problem has no fixer', async () => {
		const { createTestRule, runFirstCase } = createRunnableTestingVariables();
		const testRule = createTestRule({ ruleName, plugins: [plugin] });

		testRule({
			config: ['.b', { withoutFixer: '#a' }],
			reject: [
				{
					code: `
						#a {}
						#b {}
					`,
					fixed: `
						#a {}
						.b {}
					`,
					warnings: [
						{ message: messages.rejected('#a') },
						{ message: messages.rejected('#b') },
					],
				},
			],
		});

		await expect(runFirstCase()).resolves.not.toThrow();
	});

	it('Checks an empty `fixed` value', async () => {
		const { createTestRule, runFirstCase } = createRunnableTestingVariables();
		const testRule = createTestRule({ ruleName, plugins: [plugin] });

		testRule({
			config: ['.a'],
			reject: [
				{
					code: '#a {}',
					fixed: '',
					message: messages.rejected('#a'),
				},
			],
		});

		await expect(runFirstCase()).rejects.toThrow('Fixed code does not match `fixed`');
	});

	it('Uses inherited `computeEditInfo` only for the initial lint', async () => {
		const lintSpy = vi.spyOn(stylelint, 'lint');
		const { createTestRule, runFirstCase } = createRunnableTestingVariables({ computeEditInfo: true });
		const testRule = createTestRule({ ruleName: 'property-no-vendor-prefix' });

		testRule({
			config: true,
			reject: [
				{
					code: 'a { -webkit-transform: none; }',
					fixed: 'a { transform: none; }',
					warnings: [
						{
							message: 'Vendor-prefixed property "-webkit-transform" (property-no-vendor-prefix)',
							fix: {
								range: [4, 12],
								text: '',
							},
						},
					],
				},
			],
		});

		await expect(runFirstCase()).resolves.not.toThrow();
		expect(lintSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ computeEditInfo: true }));
		expect(lintSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({ computeEditInfo: false, fix: true }));
		expect(lintSpy).toHaveBeenNthCalledWith(3, expect.objectContaining({ computeEditInfo: false, fix: false }));
	});

	it('Fails when warning fix information does not match', async () => {
		const { createTestRule, runFirstCase } = createRunnableTestingVariables();
		const testRule = createTestRule({ ruleName: 'property-no-vendor-prefix' });

		testRule({
			config: true,
			computeEditInfo: true,
			reject: [
				{
					code: 'a { -webkit-transform: none; }',
					warnings: [
						{
							message: 'Vendor-prefixed property "-webkit-transform" (property-no-vendor-prefix)',
							fix: {
								range: [0, 1],
								text: 'invalid',
							},
						},
					],
				},
			],
		});

		await expect(runFirstCase()).rejects.toThrow('Warning with index "0" does not match');
	});

	it('Returns `void`', () => {
		const { createTestRule } = createTestingVariables();
		const testRule = createTestRule({ ruleName, plugins: [plugin] });
		const result: void = testRule({
			config: true,
			accept: [{ code: '' }],
		});

		expect(result).toBeUndefined();
	});

	// TODO: More tests for all custom features
});
