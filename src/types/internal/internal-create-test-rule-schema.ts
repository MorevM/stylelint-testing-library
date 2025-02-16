import type { CreateTestRuleSchema, CreateTestUtilsSchema } from '#types';
import type { createUniversalMappings } from '#utils';

export type InternalCreateTestRuleSchema = {
	universal: ReturnType<typeof createUniversalMappings>;
	factorySchema: CreateTestRuleSchema;
	testUtilsSchema: CreateTestUtilsSchema;
};
