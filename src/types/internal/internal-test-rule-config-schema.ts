import type { TestRuleConfigSchema } from '../test-rule-config-schema';
import type { InternalCreateTestRuleConfigSchema } from './internal-create-test-rule-config-schema';

export type InternalTestRuleConfigSchema = InternalCreateTestRuleConfigSchema & {
	testRuleConfigSchema: TestRuleConfigSchema;
	groupIndex: number;
};
