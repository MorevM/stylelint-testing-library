# `testRuleConfig`

The function for testing rule configurations returned by the `createTestRuleConfig` factory.

## Minimal use case

::: info Note
It is assumed that you have declared the `createTestRuleConfig` function globally as specified in the `Guide` section
of the documentation and the `plugins` key is present within `createTestUtils`.
:::

```ts{4,6,7,17}
import { yourRule } from './your-rule.ts';

const { ruleName } = yourRule;
const testRuleConfig = createTestRuleConfig({ ruleName });

testRuleConfig({
  accept: [
    {
      description: 'Primary option is "always"',
      config: 'always',
    },
    {
      description: 'Secondary option is a string as expected',
      config: ['always', '.foo'],
    },
  ],
  reject: [
    {
      description: 'Primary option is an unexpected string',
      config: 'just-a-random-one',
    },
    {
      description: 'Secondary option is not a string',
      config: ['always', true],
    },
  ],
});

```

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/src/types/test-rule-config-schema.ts).

### `ruleName`

The same option as described in [`createTestRuleConfig > Options > ruleName`](/api/create-test-rule-config#rulename)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: warning Note
It is **recommended** to define `ruleName` within `createTestRuleConfig` function to reduce the boilerplate code.
The option only exists to ensure that the project can be a drop-in replacement for an existing solutions for testing Stylelint plugins.
:::

::: details Show original description
The name of the rule that is being tested.

Used for output in the console, and for binding the `config` property of the `testRuleConfig` function to a rule from the plugins list.
:::

### `plugins`

The same option as described in [`createTestUtils > Options > plugins`](/api/create-test-utils#plugins)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

::: warning Note
It is **recommended** to define `plugins` within `createTestUtils` or `createTestRuleConfig` functions to reduce the boilerplate code.
The option only exists to ensure that the project can be a drop-in replacement for an existing solutions for testing Stylelint plugins.
:::

::: details Show original description
<!-- @include: @/_parts/properties/rule-name.md#description -->
:::


### `description`

Description of the test group. \
It is displayed in the console and makes it easier to identify the test when necessary. \
If not specified, the call sequence number in the file will be used.

::: code-group

```ts{2} [Test file contents]
testRuleConfig({
  description: 'Primary option',
  accept: [
    {
      description: 'Keyword "always"',
      config: 'always'
    },
    {
      description: 'Keyword "never"',
      config: 'always'
    },
  ],
});
```

```bash{1} [Console output]
✓ `{rule-name}` configs: Primary option (2)
  ✓ accept (2)
    ✓ Keyword "always"
    ✓ Keyword "never"
```

:::


### `accept` & `reject`

An array of configuration tests that should pass without warnings from Stylelint
or where a configuration error is expected, respectively. \
See more info about test cases in [Test cases](#test-cases) section below.

### `skip` & `only`

Controls whether to skip the group of tests or run only that group.

```ts{1,4}
// Only tests of this group will be run because of the `only` flag
testRuleConfig({
  description: 'Primary option',
  only: true,
  accept: [
    {
      description: 'Keyword "always"',
      config: 'always'
    },
    {
      description: 'Keyword "never"',
      config: 'always'
    },
  ],
});

testRuleConfig({
  description: 'Secondary options',
  accept: [
    {
      description: 'Key "ignore" as a string',
      config: ['always', { ignore: 'foo' }]
    },
    {
      description: 'Key "ignore" as an array of string',
      config: ['always', { ignore: ['foo', 'bar'] }]
    },
  ],
});
```

## Test cases

There are two types of tests:

* `accept` (code which Stylelint should not complain about);
* `reject` (code where a Stylelint error is expected).

They are located in the `accept` and `reject` keys of the `testRuleConfig()` options respectively.

Each group of tests described by the `testRuleConfig()` function must contain at least one test - no matter whether it is accepted or rejected.

Both the accepted test case and the rejected one have the same set of properties described below:

### `config`

Each test must necessarily have a `config` property, which is a mapping of the configuration options that will be passed by the end user. \
A configuration test without `config` just doesn't make sense.

::: code-group

```ts{5,9} [Test file contents]
testRuleConfig({
  accept: [
    {
      description: 'Keyword "always"',
      config: 'always'
    },
    {
      description: 'Keyword "always" with secondary option',
      config: ['always', { ignore: 'foo' }]
    },
  ],
});
```

```ts{1,4,6} [Example of a custom configuration it tests]
// .stylelintrc.js
export default {
  rules: {
    'your-rule/foo': 'always',
    // or
    'your-rule/foo': ['always', { ignore: ['foo'] }],
  }
}
```

:::

### `description`

A test can have a description - it is displayed in the console and makes it easier to find the test if necessary. \
If no description is provided, then instead of description will be displayed either the test sequence number (by default)
or its `config`, depending on the [`testCaseWithoutDescriptionAppearance` option](/api/create-test-utils#testcasewithoutdescriptionappearance).

::: code-group

```ts{4,8} [Test file contents]
testRuleConfig({
  accept: [
    {
      description: 'Keyword "always"',
      config: 'always'
    },
    {
      // description: 'no description here',
      config: 'always'
    },
  ],
});
```

```bash{3,4} [Console output]
✓ {rule-name}: group №1 (1)
  ✓ accept (1)
    ✓ Keyword "always"
    ✓ Accept test case №2
```

:::

### `skip` & `only` flags

Controls whether to skip the test or run the only test.

```ts{5}
testRuleConfig({
  accept: [
    // Only this test will be run because of `only` flag. // [!code focus]
    { // [!code focus]
      only: true, // [!code focus]
      description: 'Keyword "always"', // [!code focus]
      config: 'always' // [!code focus]
    }, // [!code focus]
    {
      description: 'Keyword "never"',
      config: 'never'
    },
  ],
});
```

## Additional features

The function can be called using its own `skip` and `only` methods to make these modifiers more visible when using folding.

```ts{10} [Example of equivalent code]
testRuleConfig.skip({ // [!code focus]
  accept: [
    {
      description: 'Keyword "never"',
      config: 'never',
    },
  ],
});

// The same as:

testRuleConfig({ // [!code focus]
  skip: true, // [!code focus]
  accept: [
    {
      description: 'Keyword "never"',
      config: 'never',
    },
  ],
});

```
