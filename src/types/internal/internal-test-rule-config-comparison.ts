import type { LintResult } from 'stylelint';

export type InternalTestRuleConfigComparison =
	(invalidOptionWarnings: LintResult['invalidOptionWarnings']) => void;
