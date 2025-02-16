/* eslint-disable import-x/exports-last */
import { isBoolean, isString } from '@morev/utils';
import stylelint from 'stylelint';
import type { Root, Rule } from 'postcss';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const ruleName = '@morev/lowercase-selectors';

export const messages = ruleMessages(ruleName, {
	unexpected: (selector: string) => `Unexpected upper case characters in the "${selector}" selector`,
});

const ruleFunction = (primary: boolean, secondary: { ignore: string | string[] }) => {
	return (root: Root, result: any) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isBoolean],
		}, {
			actual: secondary,
			possible: {
				ignore: [isString],
			},
			optional: true,
		});
		if (!validOptions) return;

		const ignoredSelectors = secondary?.ignore ?? [];

		root.walkRules((node: Rule) => {
			const { selector } = node;
			// No upper case in the selector
			if (!/\p{Lu}/u.test(selector)) return;
			// The selector is ignored by `ignore` secondary option.
			if (ignoredSelectors.includes(selector)) return;

			report({
				result,
				ruleName,
				message: messages.unexpected(selector),
				node,
				word: selector,
				fix: () => {
					node.selector = selector.toLocaleLowerCase();
				},
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { fixable: true, url: '' };

export default createPlugin(ruleName, ruleFunction);
