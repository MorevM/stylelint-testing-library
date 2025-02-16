import type { CreateTestRuleSchema, CreateTestUtilsSchema, TestRuleSchema } from '#types';
import type { createUniversalMappings } from '#utils';

export type InternalTestRuleSchema = {
	universal: ReturnType<typeof createUniversalMappings>;
	groupIndex: number;
	testRuleSchema: TestRuleSchema;
	factorySchema: CreateTestRuleSchema;
	testUtilsSchema: CreateTestUtilsSchema;
};
