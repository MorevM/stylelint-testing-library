/* eslint-disable import-x/exports-last */
import { basename } from 'node:path';
import { isBoolean, isString } from '@morev/utils';
import stylelint from 'stylelint';
import type { Rule } from 'stylelint';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = 'plugin/foo';

export const messages = ruleMessages(ruleName, {
	rejected: (selector) => `No \`${selector.toString()}\` selector`,
	expectFilename: (expected, actual) => `Expect \`${actual.toString()}\` to be \`${expected.toString()}\``,
	expectNewline: (selector) => `Expect to start with a newline in the \`${selector.toString()}\` selector`,
});

const ruleFunction: Rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		}, {
			actual: secondaryOptions,
			possible: {
				filename: [isString],
				prependNewline: [isBoolean],
				brokenFixer: [isBoolean],
				withoutFixer: [isString],
			},
			optional: true,
		});

		if (!validOptions) return;

		const expectedFilename = secondaryOptions?.filename;
		const actualFilename = basename(root.source?.input.file ?? '');

		if (expectedFilename && expectedFilename !== actualFilename) {
			report({
				result,
				ruleName,
				message: messages.expectFilename(expectedFilename, actualFilename),
				node: root,
			});

			return;
		}

		secondaryOptions?.prependNewline && root.walkRules((rule) => {
			if ((rule.raws.before ?? '').includes('\n')) return;

			report({
				result,
				ruleName,
				message: messages.expectNewline(rule.selector),
				node: rule,
				word: rule.selector,
				fix: () => {
					rule.raws.before = (context.newline ?? '\n') + (rule.raws.before ?? '');
				},
			});
		});

		root.walkRules((rule) => {
			const { selector } = rule;

			if (primary === selector) return;

			// `brokenFixer` hands Stylelint a fixer that repairs nothing.
			// Stylelint discards whatever a fixer returns and counts it as applied,
			// so it silences its own problem while leaving the code exactly as it was.
			const fix = (() => {
				if (secondaryOptions?.withoutFixer === selector) return undefined;
				if (secondaryOptions?.brokenFixer) return () => {};

				return () => (rule.selector = primary);
			})();

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: rule,
				word: selector,
				fix,
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { fixable: true, url: '' };

export const plugin = createPlugin(ruleName, ruleFunction);
