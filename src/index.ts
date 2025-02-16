import { createTestRule, createTestRuleConfig } from '#lib';
import { createUniversalMappings } from '#utils';
import type { CreateTestRuleConfigSchema, CreateTestRuleSchema, CreateTestUtils, CreateTestUtilsSchema } from '#types';

/**
 * Creates testing functions bound to testing platform functions.
 *
 * @param   schema   Testing functions and useful defaults for the functions.
 *
 * @returns          Object containing ready-to-use utilities for testing.
 */
export const createTestUtils = (schema?: CreateTestUtilsSchema): CreateTestUtils => {
	const DEFAULT_OPTIONS: Partial<CreateTestUtilsSchema> = {
		testCaseWithoutDescriptionAppearance: 'case-index',
		testGroupWithoutDescriptionAppearance: 'group-index',
	};

	// Different test platforms provide slightly different APIs,
	// so a universal mapping is needed.
	const universal = createUniversalMappings(schema?.testFunctions);

	const createTestRuleBind = (createTestRuleSchema: CreateTestRuleSchema) =>
		createTestRule({
			universal,
			testUtilsSchema: { ...DEFAULT_OPTIONS, ...schema },
			factorySchema: createTestRuleSchema,
		});

	const testRuleConfigBind = (testRuleConfigSchems: CreateTestRuleConfigSchema) =>
		createTestRuleConfig({
			universal,
			testUtilsSchema: { ...DEFAULT_OPTIONS, ...schema },
			factorySchema: testRuleConfigSchems,
		});

	return {
		createTestRule: createTestRuleBind,
		createTestRuleConfig: testRuleConfigBind,
	};
};

export { stripIndent } from '@morev/utils';
export type { CreateTestRule, CreateTestRuleConfig, TestRule, TestRuleConfig } from '#types';
