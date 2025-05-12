# `createTestRuleConfig`

A function that allows you to create test groups to check configuration options of a rule.

## Minimal use case

::: info Note
It is assumed that you have declared the `createTestRuleConfig` function globally as specified in the `Guide` section
of the documentation and the `plugins` key is present within `createTestUtils`.

`plugins` is a required property **only if you have not specified it in `createTestUtils`**.
:::

```ts
import { yourRule } from './your-rule.ts';

const { ruleName } = yourRule;
const testRuleConfig = createTestRuleConfig({ ruleName }); // [!code focus]

testRuleConfig({
  // ...
});
```

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/tree/master/src/types/create-test-rule-config-schema.ts).

### `ruleName`

::: info Info
This is the only required option *(if you have specified `plugins` in `createTestUtils`)*.
:::

The name of the rule that is being tested.

Used for output in the console, and for binding the `config` property of the `testRuleConfig` function to a rule from the plugins list.

### `plugins`

The same option as described in [`createTestUtils > Options > plugins`](/api/create-test-utils#plugins)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

**Required** if `plugins` is not specified when declaring `createTestUtils`.

::: details Show original description
<!-- @include: @/_parts/properties/plugins.md#description -->
:::
