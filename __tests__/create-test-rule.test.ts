import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import { createTestUtils } from '#';
import { plugin, ruleName } from './fixtures/plugin-foo';
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

		expect(describeMock).toHaveBeenCalledWith('plugin/foo: line 88 in the source file', expect.any(Function));
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

	// TODO: More tests for all custom features
});
