import { assert, describe, expect, it } from 'vitest';
import * as ts from 'typescript';
import { createTestUtils, stripIndent } from '#';

const SOURCE_FILE_LOCATION = './src/index.ts';

describe('create-test-utils', () => {
	it('Has an export of the main function', () => {
		expect(createTestUtils).toBeInstanceOf(Function);
	});

	it('Has an export of the `stripIndent` function', () => {
		expect(stripIndent).toBeInstanceOf(Function);
	});

	it('The factory returns `createTestRule` and `createTestRuleConfigs` functions', () => {
		const { createTestRule, createTestRuleConfig } = createTestUtils({
			testFunctions: { describe, it, expect, assert },
		});

		expect(createTestRule).toBeInstanceOf(Function);
		expect(createTestRuleConfig).toBeInstanceOf(Function);
	});

	it('Has an export of types needed by the end user', () => {
		const program = ts.createProgram([SOURCE_FILE_LOCATION], {});
		const sourceFile = program.getSourceFile(SOURCE_FILE_LOCATION)!;
		const checker = program.getTypeChecker();
		const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile)!;
		const moduleExports = checker.getExportsOfModule(sourceFileSymbol);

		expect(moduleExports.some((symbol) => symbol.escapedName as string === 'CreateTestRule')).toBe(true);
		expect(moduleExports.some((symbol) => symbol.escapedName as string === 'CreateTestRuleConfig')).toBe(true);
		expect(moduleExports.some((symbol) => symbol.escapedName as string === 'TestRule')).toBe(true);
		expect(moduleExports.some((symbol) => symbol.escapedName as string === 'TestRuleConfig')).toBe(true);
	});
});
