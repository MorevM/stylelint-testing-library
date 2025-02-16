import type { CreateTestRuleConfigSchema, CreateTestUtilsSchema } from '#types';
import type { createUniversalMappings } from '#utils';

export type InternalCreateTestRuleConfigSchema = {
	universal: ReturnType<typeof createUniversalMappings>;
	factorySchema: CreateTestRuleConfigSchema;
	testUtilsSchema: CreateTestUtilsSchema;
};
