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
    {
      code: '.bar {}',
      message: 'Expected warning message',
    },
  ],
});
```

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/blob/master/src/types/test-rule-schema.ts).

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

---

### `plugins`

The same option as described in [`createTestUtils > Options > plugins`](/api/create-test-utils#plugins)
but takes precedence over values from both `createTestRule` and `createTestUtils` when specified.

::: warning Note
It is **recommended** to define `plugins` within `createTestUtils` or `createTestRule` functions to reduce the boilerplate code.
The option only exists to ensure that the project can be a drop-in replacement for an existing solutions for testing Stylelint plugins.
:::

::: details Show original description

<!-- @include: @/_parts/properties/plugins.md#description -->

:::

---

### `extraRules`

The same option as described in [`createTestUtils > Options > extraRules`](/api/create-test-utils#extrarules)
and [`createTestRule > Options > extraRules`](/api/create-test-rule#extrarules),
but is merged after those rules, so a rule with the same name replaces their value.

::: details Show original description

<!-- @include: @/_parts/properties/extra-rules.md#description -->

:::

---

### `warningsFrom`

List one or more rule names to check their warnings in this group.
Omit the option or pass `undefined` to check all rules.
An empty array raises an error when defining the group.
All configured rules run. The tester compares the selected warnings in Stylelint's reporting order.
Syntax diagnostics and configuration errors are checked independently, and `fixed` covers the full stylesheet.

```ts
testRule({
  ruleName: 'color-hex-length',
  config: 'long',
  extraRules: { 'block-no-empty': true },
  warningsFrom: ['color-hex-length'],
  accept: [{ code: 'a {}' }],
});
```

---

### `description`

Description of the test group. \
It is displayed in the console and makes it easier to identify the test when necessary.

::: code-group

```ts{2} [Test file contents]
testRule({
  description: '"ignore" option as array of strings',
  config: [true, { ignore: ['foo', 'bar'] }],
  accept: [
    { code: '.foo {}' },
    { code: '.bar {}' },
  ],
})
```

```bash{1} [Console output]
✓ {rule-name}: "ignore" option as array of strings (2)
  ✓ accept (2)
    ✓ Accept test case №1
    ✓ Accept test case №2
```

:::

---

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

---

### `languageOptions`

Override the [rule's language options](/api/create-test-rule#languageoptions) for this group.
Stylelint uses the selected grammar for lint, autofix, and the check of the fixed CSS.

```ts
testRule({
  ruleName: 'property-no-unknown',
  config: true,
  languageOptions: { syntax: { properties: { 'brand-ink': '<color>' } } },
  accept: [{ code: 'a { brand-ink: red; }' }],
});
```

---

### `computeEditInfo`

The same option as described in [`createTestUtils > Options > computeEditInfo`](/api/create-test-utils#computeeditinfo)
and [`createTestRule > Options > computeEditInfo`](/api/create-test-rule#computeeditinfo),
but takes precedence over them if specified. It can be overridden for a particular test case.

::: details Show original description

<!-- @include: @/_parts/properties/compute-edit-info.md#description -->

:::

---

### `referenceFiles`

Override the [rule's reference files](/api/create-test-rule#referencefiles) for this group.
Stylelint loads the selected files for lint, autofix, and the check of the fixed CSS.

```ts
testRule({
  ruleName: 'no-unknown-animations',
  config: true,
  referenceFiles: { files: 'fixtures/animations.css' },
  accept: [{ code: 'a { animation-name: pulse; }' }],
});
```

The example assumes `fixtures/animations.css` defines `@keyframes pulse`.

---

### `codeFilename`

<!-- @include: @/_parts/properties/code-filename.md -->

---

### `customSyntax`

The same option as described in [`createTestUtils > Options > customSyntax`](/api/create-test-utils#customsyntax)
and [`createTestRule > Options > customSyntax`](/api/create-test-rule#customsyntax)
but takes precedence over them if specified, allowing to overwrite the defaults for a particular set.

::: details Show original description

<!-- @include: @/_parts/properties/custom-syntax.md#description -->

:::

---

### `accept` & `reject`

An array of tests that should pass without warnings from Stylelint or where warnings are expected, respectively. \
See more info about test cases in [Test cases](#test-cases) section below.

---

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

---

### `autoStripIndent`

The same option as described in [`createTestUtils > Options > autoStripIndent`]
and [`createTestRule > Options > autoStripIndent`](/api/create-test-rule#autostripindent),
but takes precedence over them if specified.

:::: details Show original description

<!-- @include: @/_parts/properties/auto-strip-indent.md -->

::::

---

### `contextNewlineFallback`

The same option as described in [`createTestUtils > Options > contextNewlineFallback`](/api/create-test-utils#contextnewlinefallback)
and [`createTestRule > Options > contextNewlineFallback`](/api/create-test-rule#contextnewlinefallback),
but takes precedence over them if specified.

:::: details Show original description

<!-- @include: @/_parts/properties/context-newline-fallback.md -->

::::

## Test cases

There are two types of tests:

- `accept` (code that must produce no parse errors, invalid-option warnings, or rule warnings);
- `reject` (code that must parse successfully and produce the expected rule and configuration warnings).

They are located in the `accept` and `reject` keys of the `testRule()` options respectively.

Each group of tests described by the `testRule()` function must contain at least one test - no matter whether it is accepted or rejected.

### `accept` test case

These tests contain user scenarios that should pass Stylelint validation without warnings. \
Its properties described below:

#### `code`

Each test must necessarily have a `code` property, which is the string that is validated by Stylelint.
A test without `code` just doesn't make sense.

You can automatically remove indentation in the case of multi-line input
using the [`autoStripIndent` option][`createTestUtils > Options > autoStripIndent`].

```ts
testRule({
  config: true,
  accept: [
    { code: '.foo {}' },
    {
      code: `
        .foo {
          @media (max-width: 480px) {
            color: red;
          }
        }
      `
    },
  ],
});
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

#### `referenceFiles`

Replace the [group's reference files](#referencefiles) for one `accept` or `reject` case.
For example, pass `[]` to verify that an animation is reported as unknown when its definition is unavailable.

#### `codeFilename`

The same option as described in [`codeFilename`](#codefilename) above
but takes precedence over it if specified, allowing to overwrite the default for a particular test case.

::: details Show original description

<!-- @include: @/_parts/properties/code-filename.md#description -->

:::

#### `languageOptions`

Override the [group's language options](#languageoptions) for this `accept` or `reject` case.
The object replaces the inherited grammar in full. Pass `{}` to use Stylelint's standard grammar.

#### `customSyntax`

The same option as described in [`customSyntax`](#customsyntax) above
but takes precedence over it if specified, allowing to overwrite the default for a particular test case.

::: details Show original description

<!-- @include: @/_parts/properties/custom-syntax.md#description -->

:::

#### `computeEditInfo`

The same option as described in [`computeEditInfo`] above
but takes precedence over all other levels if specified.

::: details Show original description

<!-- @include: @/_parts/properties/compute-edit-info.md#description -->

:::

#### `autoStripIndent`

The same option as described in [`autoStripIndent`](#autostripindent) above
but takes precedence over it if specified, allowing to overwrite the default for a particular test case.

:::: details Show original description

<!-- @include: @/_parts/properties/auto-strip-indent.md#description -->

::::

#### `contextNewlineFallback`

The same option as described in [`contextNewlineFallback`](#contextnewlinefallback) above
but takes precedence over it if specified, allowing to overwrite the default for a particular test case.

:::: details Show original description

<!-- @include: @/_parts/properties/context-newline-fallback.md -->

::::

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

Each expected rule warning requires a `message`.
Declare it directly on the test case for a single warning, or on each entry in `warnings`.

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

#### `warnings`

An array of expected warnings. Use it when a test must produce more than one warning,
or when you prefer the same shape for single- and multiple-warning cases.

When `warnings` is present, it is used instead of the warning properties declared directly on the test case.

```ts{6-13}
testRule({
  config: true,
  reject: [
    {
      code: '.foo, .bar {}',
      warnings: [
        {
          message: 'Unexpected selector ".foo"',
        },
        {
          message: 'Unexpected selector ".bar"',
        },
      ],
    },
  ],
});
```

#### `invalidOptionWarnings`

Use this field when a rule reports a configuration error only after it encounters particular CSS.
List the expected messages in the order Stylelint reports them. A string matches the full text,
and a regular expression matches a pattern within it. Omitting the field expects zero configuration warnings.

Set `warnings: []` when the rule produces only configuration warnings.
Use `fixed: code` to check that autofix leaves the input unchanged.

```ts
const code = '.foo {}';

testRule({
  config: ['.replacement', { preserveSelectors: ['.foo'] }],
  reject: [
    {
      code,
      invalidOptionWarnings: [/Cannot replace preserved selector/],
      warnings: [],
      fixed: code,
    },
  ],
});
```

#### `line`, `column`, `endLine` & `endColumn`

Expected source positions of a warning. They can be declared directly on the test case in the short form,
or on individual objects inside `warnings`. All four properties are optional and are compared only when specified.

```ts{7-10}
testRule({
  config: true,
  reject: [
    {
      code: '.foo {}',
      message: 'Expected warning message',
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 5,
    },
  ],
});
```

#### `fix`

Provide `{ range, text }` to check an editor edit, or `null` to check that the warning has no edit.
Either expectation enables [`computeEditInfo`] for the initial lint of this case.
Omit `fix` to skip the edit assertion for that warning.

```ts{9-12}
testRule({
  config: true,
  reject: [
    {
      code: 'a { -webkit-transform: none; }',
      warnings: [
        {
          message: 'Vendor-prefixed property "-webkit-transform" (property-no-vendor-prefix)',
          fix: {
            range: [4, 12],
            text: '',
          },
        },
      ],
    },
  ],
});
```

#### `fixed`

If the rule contains a fixer, you can test its operation using the `fixed` property.
The library runs Stylelint with autofix enabled, compares the resulting code,
then lints the fixed code again to verify any remaining warnings.

```ts{11}
// Let's pretend we are testing a rule that
// disallows the use of UPPERCASE and has a fixer

testRule({
  description: '"ignore" option as array of strings',
  config: true,
  reject: [
    {
      code: '.THE-SELECTOR {}',
      message: 'Unexpected uppercase selector',
      fixed: '.the-selector {}',
    },
  ],
});
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

[`computeEditInfo`]: #computeeditinfo
[`createTestUtils > Options > autoStripIndent`]: /api/create-test-utils#autostripindent
