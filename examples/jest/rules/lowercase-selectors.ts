import { isBoolean, isString } from '@morev/utils';
import stylelint from 'stylelint';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@morev/lowercase-selectors';

const messages = ruleMessages(ruleName, {
	unexpected: (selector: string) => `Unexpected upper case characters in the "${selector}" selector`,
});

const ruleFunction: stylelint.Rule = (primary, secondary) => {
	return (root, result) => {
		const areOptionsValid = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isBoolean],
		}, {
			actual: secondary,
			possible: {
				ignore: [isString],
			},
			optional: true,
		});
		if (!areOptionsValid) return;

		const ignoredSelectors = secondary?.ignore ?? [];

		root.walkRules((node) => {
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

const plugin = createPlugin(ruleName, ruleFunction);

export { messages, ruleName };
export default plugin;
