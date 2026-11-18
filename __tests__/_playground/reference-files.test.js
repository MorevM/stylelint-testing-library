import { fileURLToPath } from 'node:url';
import { toNumber } from '@morev/utils';
import stylelintPackage from 'stylelint/package.json' with { type: 'json' };
import { createTestUtils } from '../../src';

const [major, minor] = stylelintPackage.version.split('.').map((part) => toNumber(part));
const { createTestRule } = createTestUtils();
const testRule = createTestRule({ ruleName: 'no-unknown-animations' });

testRule({
	skip: major < 17 || (major === 17 && minor < 9),
	config: true,
	referenceFiles: { files: fileURLToPath(new URL('../fixtures/animations.css', import.meta.url)) },
	accept: [{ code: 'a { animation-name: pulse; }' }],
	reject: [{
		code: 'a { animation-name: pulse, missing; }',
		message: 'Unknown animation "missing" (no-unknown-animations)',
		fixed: 'a { animation-name: pulse, missing; }',
	}],
});
