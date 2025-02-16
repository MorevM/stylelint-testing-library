import type { CreateTestRuleSchema, TestRule } from '#types';

/**
 * Creates a `testRule` function to test the rule
 * under different configuration options.
 *
 * @param   schema   Options.
 *
 * @returns          Ready-to-use `testRule` function.
 */
export type CreateTestRule = (schema: CreateTestRuleSchema) => TestRule;
