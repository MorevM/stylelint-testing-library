# `testRule`

The function returned by the `createTestRule` factory, this is the main function for testing user scenarios.

The function must always contain `config` and at least one `accept` or `reject` test.

## Minimal use case

::: info Note
It is assumed that you have declared the `createTestRule` function globally as specified in the `Guide` section
of the documentation and the `plugins` key is present within `createTestUtils`.
:::

```ts
import { yourRule } from './your-rule.ts';

const { ruleName } = yourRule;
const testRule = createTestRule({ ruleName });

testRule({
  config: true,
  accept: [
    { code: '.foo {}' },
  ],
});

// or

testRule({
  config: [true, { option: false }],
  reject: [
    { code: '.bar {}' },
  ],
});
```

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/src/types/test-rule-schema.ts).

### `ruleName`

The same option as described in [`createTestRule > Options > ruleName`](/api/create-test-rule#rulename)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: warning Note
It is **recommended** to define `ruleName` within `createTestRule` function to reduce the boilerplate code.
The option only exists to ensure that the project can be a drop-in replacement for an existing solutions for testing Stylelint plugins.
:::

::: details Show original description
<!-- @include: @/_parts/properties/rule-name.md -->
:::

### `plugins`

The same option as described in [`createTestUtils > Options > plugins`](/api/create-test-utils#plugins)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: warning Note
It is **recommended** to define `plugins` within `createTestUtils` or `createTestRule` functions to reduce the boilerplate code.
The option only exists to ensure that the project can be a drop-in replacement for an existing solutions for testing Stylelint plugins.
:::

::: details Show original description
<!-- @include: @/_parts/properties/rule-name.md#description -->
:::

### `extraRules`

The same option as described in [`createTestUtils > Options > extraRules`](/api/create-test-utils#extrarules)
but, if specified, appended to these rules.

::: details Show original description
<!-- @include: @/_parts/properties/extra-rules.md#description -->
:::

### `description`

Description of the test group. \
It is displayed in the console and makes it easier to identify the test when necessary.

::: code-group

```ts{2} [Test file contents]
testRule({
  description: '"ignore" option as array of strings',
  config: [true, { ignore: ['foo', 'bar'] }],
  accept: [
    { code: '.foo {}' }
    { code: '.bar {}' }
  ]
})
```

```bash{1} [Console output]
✓ {rule-name}: "ignore" option as array of strings (2)
  ✓ accept (2)
    ✓ Accept test case №1
    ✓ Accept test case №2
```

:::

### `config`

The configuration passed to the rule with the name as passed in `ruleName` to the `createTestRule()` function.

::: code-group

```ts{3,5,8} [your-rule.test.ts]
import { yourRule } from './your-rule.ts';

// Assume your rule is named `@scope/your-rule`
const { ruleName } = yourRule;
const testRule = createTestRule({ ruleName });

testRule({
  config: [true, { ignore: ['foo'] }],
  accept: [
    { code: '.foo {}' },
  ],
});
```

```ts{5} [stylelint.lint() call signature]
stylelint.lint({
  code: '.foo {}',
  config: {
    rules: {
      '@scope/your-rule': [true, { ignore: ['foo'] }],
    },
  },
});
```

:::

### `codeFilename`

<!-- @include: @/_parts/properties/code-filename.md -->

### `customSyntax`

The same option as described in [`createTestUtils > Options > customSyntax`](/api/create-test-utils#customsyntax)
and [`createTestRule > Options > customSyntax`](/api/create-test-rule#customsyntax)
but takes precedence over them if specified, allowing to overwrite the defaults for a particular set.

::: details Show original description
<!-- @include: @/_parts/properties/custom-syntax.md#description -->
:::

### `accept` & `reject`

An array of tests that should pass without warnings from Stylelint or where an error is expected, respectively. \
See more info about test cases in [Test cases](#test-cases) section below.

### `skip` & `only`

Controls whether to skip the group of tests or run only that group.

```ts{1,4}
// Only tests of this group will be run because of the `only` flag
testRule({
  config: true,
  only: true,
  accept: [
    { code: '.foo {}' },
    { code: '.bar {}' },
  ],
});

testRule({
  config: [true, { ignore: 'baz' }],
  accept: [
    { code: '.baz {}' },
    { code: '.qwe {}' },
  ],
});
```


### `autoStripIndent`

The same option as described in [`createTestUtils > Options > autoStripIndent`](/api/create-test-utils#autostripindent)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: details Show original description
<!-- @include: @/_parts/properties/auto-strip-indent.md -->

## Test cases

There are two types of tests:

* `accept` (code which Stylelint should not complain about);
* `reject` (code where a Stylelint error is expected).

They are located in the `accept` and `reject` keys of the `testRule()` options respectively.

Each group of tests described by the `testRule()` function must contain at least one test - no matter whether it is accepted or rejected.

### `accept` test case

These tests contain user scenarios that should pass Stylelint validation without warnings. \
Its properties described below:

#### `code`

Each test must necessarily have a `code` property, which is the string that is validated by Stylelint. A test without `code` just doesn't make sense.

You can automatically remove indentation in the case of multi-line input
using the [`autoStripIndent` option](/api/create-test-utils#autostripindent).

```ts
testRule({
  config: true,
  accept: [
    { code: '.foo {}' }
    {
      code: `
        .foo {
          @media (max-width: 480px) {
            color: red;
          }
        }
      `
    }
  ]
})
```

#### `description`

A test can have a description - it is displayed in the console and makes it easier to find the test if necessary. \
If no description is provided, then instead of description will be displayed either the test sequence number (by default)
or its code, depending on the [`testCaseWithoutDescriptionAppearance` option](/api/create-test-utils#testcasewithoutdescriptionappearance).

::: code-group

```ts{5} [Test file contents]
testRule({
  config: true,
  accept: [
    {
      description: 'Works with the simple selector',
      code: '.foo {}',
    },
  ],
});
```

```bash{3} [Console output]
✓ {rule-name}: group №1 (1)
  ✓ accept (1)
    ✓ Works with the simple selector
```

:::

#### `codeFilename`

The same option as described in [`codeFilename`](#codefilename) above
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: details Show original description
<!-- @include: @/_parts/properties/code-filename.md#description -->
:::

#### `customSyntax`

The same option as described in [`customSyntax`](#customsyntax) above
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: details Show original description
<!-- @include: @/_parts/properties/custom-syntax.md#description -->
:::

#### `autoStripIndent`

The same option as described in [`autoStripIndent`](#autostripindent) above
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: details Show original description
<!-- @include: @/_parts/properties/auto-strip-indent.md#description -->

#### `skip` & `only` flags

Controls whether to skip the test or run the only test.

```ts{5,7} [Test file contents]
testRule({
  config: true,
  accept: [
    { code: '.foo {}' },
    // Only this test will be run because of `only` flag.
    {
      only: true,
      code: '.bar {}',
    },
  ],
});
```

### `reject` test case

These tests contain user input where a Stylelint warning(s) is expected.

Can contain all the same properties as the `accept` test, but in addition:

#### `message`

All `reject` tests must have at least one additional field - `message`. \
It can be declared either in the case itself (if a single error is expected) or inside its `warnings`
if more than one error is expected or if you prefer to always use `warnings`, even for a single test case.

::: code-group

```ts{11} [Short form]
import { yourRule } from './your-rule.ts';

const { ruleName, messages } = yourRule;
const testRule = createTestRule({ ruleName });

testRule({
  config: true,
  reject: [
    {
      code: '.foo {}',
      message: messages.unexpected('.foo'),
    },
  ],
});

```

```ts{11-13} [Full form]
import { yourRule } from './your-rule.ts';

const { ruleName, messages } = yourRule;
const testRule = createTestRule({ ruleName });

testRule({
  config: true,
  reject: [
    {
      code: '.foo {}',
      warnings: [
        { message: messages.unexpected('.foo') },
      ],
    },
  ],
});
```

:::

#### `fixed`

If the rule contains a fixer, you can test its operation using the `fixed` property.

```ts{10}
// Let's pretend we are testing a rule that
// disallows the use of UPPERCASE and has a fixer

testRule({
  description: '"ignore" option as array of strings',
  config: true,
  reject: [
    {
      code: '.THE-SELECTOR {}',
      fixed: '.the-selector {}',
    }
  ]
})
```

### Additional features

The function can be called using its own `skip` and `only` methods to make
these modifiers more visible when using IDEs folding feature.

```ts{8} [Example of equivalent code]
testRule.skip({ // [!code focus]
  config: [true],
  accept: [
    { code: '.foo {}' },
  ],
});

// The same as:

testRule({ // [!code focus]
  skip: true, // [!code focus]
  config: [true],
  accept: [
    { code: '.foo {}' },
  ],
});

```
