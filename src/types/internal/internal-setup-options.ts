import type { AcceptedTestCase, RejectedTestCase, TestCase } from '#types';
import type { InternalTestRuleSchema } from '#types/internal';

export type InternalSetupOptions = InternalTestRuleSchema & {
	name: string;
	cases: TestCase[];
	comparisons: (
		testCase: AcceptedTestCase | RejectedTestCase,
		caseIndex: number
	) => () => Promise<void>;
};
