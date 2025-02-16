import type { ConfigTestCase } from '#types';

export type InternalTestRuleConfigOptions = {
	testCase: ConfigTestCase;
	name: 'accept' | 'reject';
	index: number;
};
