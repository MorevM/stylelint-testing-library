import type { CreateTestRuleConfigSchema, TestRuleConfig } from '#types';

/**
 * Creates a `testRuleConfig` function to test rule configs
 * under different configuration options.
 *
 * @param   schema   Rule name, test cases and other options.
 */
export type CreateTestRuleConfig = (schema: CreateTestRuleConfigSchema) => TestRuleConfig;
