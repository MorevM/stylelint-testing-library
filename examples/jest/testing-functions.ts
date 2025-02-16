import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './index';
import 'jest-expect-message';

const { createTestRule, createTestRuleConfig } = createTestUtils({ plugins });

export { createTestRule, createTestRuleConfig };
