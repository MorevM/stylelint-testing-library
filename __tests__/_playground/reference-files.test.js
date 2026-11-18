import { fileURLToPath } from 'node:url';
import { toNumber } from '@morev/utils';
import stylelintPackage from 'stylelint/package.json' with { type: 'json' };
import { createTestUtils } from '../../src';

const [major, minor] = stylelintPackage.version.split('.').map((part) => toNumber(part));
const shouldSkip = major < 17 || (major === 17 && minor < 9);
const animations = fileURLToPath(new URL('../fixtures/animations.css', import.meta.url));
const fade = fileURLToPath(new URL('../fixtures/fade.css', import.meta.url));
const { createTestRule } = createTestUtils({ referenceFiles: { files: animations } });
const testRule = createTestRule({ ruleName: 'no-unknown-animations' });
const pulse = 'a { animation-name: pulse; }';
const unknownPulse = { code: pulse, message: 'Unknown animation "pulse" (no-unknown-animations)' };

testRule({
	skip: shouldSkip,
	config: true,
	accept: [{ code: pulse }],
	reject: [{
		code: 'a { animation-name: pulse, missing; }',
		message: 'Unknown animation "missing" (no-unknown-animations)',
		fixed: 'a { animation-name: pulse, missing; }',
	}],
});

const testFade = createTestRule({ ruleName: 'no-unknown-animations', referenceFiles: fade });

testFade({
	skip: shouldSkip,
	config: true,
	accept: [{ code: 'a { animation-name: fade; }' }],
	reject: [unknownPulse],
});

testFade({
	skip: shouldSkip,
	config: true,
	referenceFiles: [animations],
	accept: [{ code: pulse, referenceFiles: undefined }],
	reject: [{ ...unknownPulse, referenceFiles: [] }],
});
