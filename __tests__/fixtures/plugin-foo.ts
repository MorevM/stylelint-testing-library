/* eslint-disable import-x/exports-last */
import { basename } from 'node:path';
import { isString } from '@morev/utils';
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
});

const ruleFunction: Rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		}, {
			actual: secondaryOptions,
			possible: {
				filename: [isString],
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

		root.walkRules((rule) => {
			const { selector } = rule;

			if (primary === selector) return;

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: rule,
				word: selector,
				fix: () => (rule.selector = primary),
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { fixable: true, url: '' };

export const plugin = createPlugin(ruleName, ruleFunction);
