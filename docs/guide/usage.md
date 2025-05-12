# Usage

::: warning Important

Keep in mind that what is demonstrated on this page is a very simple use case -
the project allows you to flexibly customize many parts of it, which can improve your DX.

Please refer to the `API Reference` section where all possible options are written in more detail,
or inspect function arguments using the inline autocomplete suggestions in your IDE -
detailed JSDoc's are written for all functions.

:::

Install the package and configure your test runner to work with it using the instructions in the [`Installation`](/guide/installation) section.

::: info Note
Here it is assumed that the steps described on the [`Setup using Vitest`](/guide/setup-using-vitest) page have been followed,
and that the `plugins` property is specified directly in the `createTestUtils` declaration.
:::

Next, create the test file and setup the tests:

::: details Environment for understanding the following example

---
**Testing platform setup:**

It is assumed that you have declared the `createTestRule` and `createTestRuleConfig` functions
globally as specified in the `Guide` section of the documentation,
and the `plugins` key is present within `createTestUtils`.

---

**Rule options:**

Let's pretend that your rule takes a boolean argument as the `primary` option
and an optional object with the `ignore` key, in which an array of strings is expected,
as the `secondary` option.

E.g. configurations `true`, `[true, { ignore: '.foo' }]` are valid;

---

**Rule implementation:**

Let's pretend that a rule disallows the use of upper case selectors (e.g. `.FOO {}` is invalid),
and has a fixer that changes the selector to lower case format (e.g. `.FOO {}` becomes `.foo {}` ),
and does this with all selectors that do not match the `ignore` values from the secondary options.

E.g. with a configuration `[true, { ignore: '.FOO' }]` the rule transforms `.FOO {} .BAR {}` into `.FOO {} .bar {}`
:::

::: code-group

```ts [Test file preparation]
// 1. Import your rule
import rule from './foo-rule';
// 2. Extract its meta-information, which you'll need next
const { ruleName, messages } = rule;
// 3. Create test functions
const testRuleConfig = createTestRuleConfig({ ruleName });
const testRule = createTestRule({ ruleName });

// Further instructions for configuration and implementation testing
// are provided in the respective tabs above the code ^^^
// Imagine adding the contents of this tab on top of each of the other tabs.
```

```ts [Test rule configuration]
// 4. Test your rule configurations

testRuleConfig({
  // It is a good practice to specify a human-understandable name
  // for test groups and test cases - it is displayed in the console
  // when running tests and allows you to navigate faster
  // (find a specific test group or a test case itself)
  // in case an error occurred that you were not expecting.
  description: 'Primary option',
  // Here are examples of configurations that your rule considers valid.
  // According to the content of the `details` element above -
  // we just have a boolean value.
  accept: [
    {
      description: 'Enabled rule',
      config: true,
    },
    {
      description: 'Disabled rule',
      config: false,
    },
    {
      description: 'Skipped rule (handled by Stylelint)',
      config: null,
    },
  ],
  // Here are examples of invalid configurations.
  reject: [
    {
      description: 'Not a boolean as a primary option',
      config: 'foo',
    },
  ],
});

// You can create several groups of tests using the same testing function
// (for example, to test the primary and secondary options separately)

testRuleConfig({
  description: 'Secondary option',
  accept: [
    {
      description: 'Valid secondary option value #1',
      config: [true, { ignore: ['.FOO'] }],
    },
  ],
  reject: [
    {
      description: '`ignore` key is missing',
      config: [true, {}],
    },
    {
      description: '`ignore` key value is not an array',
      config: [true, { ignore: '.FOO' }],
    },
    {
      description: '`ignore` key value is not an array of strings',
      config: [true, { ignore: [true, false] }],
    },
  ],
});
```

```ts [Test rule implementation]
// 5. Test your rule implementation

testRule({
  description: 'Default options',
  // This config applies to all nested test cases.
  config: [true],
  // Code examples that should not trigger any Stylelint warnings
  // if you include your rule with the `config` configuration above.
  accept: [
    {
      description: 'No upper case selectors',
      code: `.foo {}`,
    },
    {
      description: 'No upper case selectors (multiline)',
      code: `
        .foo {}
        .bar {}
      `,
    },
  ],
  // Here are code samples where your rule is expected to call the `report`
  // function, with the option (optionally) to check the value after
  // applying the fixer as well (if Stylelint is run with the `--fix` flag).
  reject: [
    {
      description: 'Selector in upper case',
      code: `.FOO {}`,
      // `fixed` code is not a required field (for example,
      // if your rule doesn't have a fixer or you don't want to check
      // fixes for a particular script for some reason).
      // But it is good practice to always test as much as possible.
      fixed: `.foo {}`,
      // In the case when a single warning is expected,
      // you can describe its parameters directly in the test case.
      // Only `message` is a required field, but it is good practice
      // to always specify start and end positions.
      message: messages.unexpected('.FOO'),
      line: 1, column: 1,
      endLine: 1, endColumn: 5,
    },
    {
      description: 'Selectors in upper case (multiline)',
      code: `
        .FOO {}
        .BAR {}
      `,
      code: `
        .foo {}
        .bar {}
      `,
      // In the case where multiple errors are expected,
      // they are described inside the `warnings` key.
      // It is good practice to always use `warnings`
      // even in the case of a single error (to maintain consistency).
      warnings: [
        {
          message: messages.unexpected('.FOO'),
          line: 1, column: 1,
          endLine: 1, endColumn: 5,
        },
        {
          message: messages.unexpected('.BAR'),
          line: 2, column: 2,
          endLine: 1, endColumn: 5,
        },
      ],
    },
  ],
});

// Create test groups in order to test different user scenarios
// for different configurations passed to your rule.

testRule({
  description: 'With secondary option',
  // This config is different from the previous one.
  config: [true, { ignore: '.FOO' }],
  accept: [
    {
      description: 'Ignores `.FOO` selector as specified',
      code: `.FOO {}`,
    },
  ],
  reject: [
    {
      description: 'Still works for other selectors',
      code: `.BAR {}`,
      fixed: `.bar {}`,
      warnings: [
        {
          message: messages.unexpected('.FOO'),
          line: 1, column: 1,
          endLine: 1, endColumn: 5,
        },
      ],
    },
    {
      description: 'Reports selectors except ignored one',
      code: `
        .FOO {}
        .BAR {}
      `,
      code: `
        .FOO {}
        .bar {}
      `,
      warnings: [
        {
          message: messages.unexpected('.BAR'),
          line: 2, column: 2,
          endLine: 1, endColumn: 5,
        },
      ],
    },
  ],
});
```

:::
