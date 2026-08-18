# `createTestRule`

This is a function that allows to create sets of tests bound to a specific rule. \
You should always pass `ruleName` into it, and you can also configure some useful defaults
or overwrite those described in [`createTestUtils`](/api/create-test-utils) for a particular rule.

## Minimal use case

::: info Note
It is assumed that you have declared the `createTestRule` function globally as specified in the `Guide` section
of the documentation and the `plugins` key is present within `createTestUtils`.

When testing a plugin rule, provide its plugin through `createTestUtils` or this factory.
Core Stylelint rules do not require `plugins`.
:::

```ts
import { yourRule } from './your-rule.ts';

const { ruleName } = yourRule;
const testRule = createTestRule({ ruleName }); // [!code focus]

testRule({
  // ...
});
```

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/blob/master/src/types/create-test-rule-schema.ts).

### `ruleName`

::: info Info
This is the only required option. All others are optional, but can improve your DX.
:::

<!-- @include: @/_parts/properties/rule-name.md -->

---

### `plugins`

The same option as described in [`createTestUtils > Options > plugins`](/api/create-test-utils#plugins)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

**Required** if `plugins` is not specified when declaring `createTestUtils`.

:::: details Show original description

<!-- @include: @/_parts/properties/plugins.md#description -->

::::

---

### `extraRules`

The same option as described in [`createTestUtils > Options > extraRules`](/api/create-test-utils#extrarules)
but is merged after those rules, so a rule with the same name replaces the value from `createTestUtils`.

:::: details Show original description

<!-- @include: @/_parts/properties/extra-rules.md#description -->

::::

---

### `computeEditInfo`

The same option as described in [`createTestUtils > Options > computeEditInfo`](/api/create-test-utils#computeeditinfo)
but takes precedence over it if specified. It can be overridden for a particular group or test case.

:::: details Show original description

<!-- @include: @/_parts/properties/compute-edit-info.md#description -->

::::

---

### `customSyntax`

The same option as described in [`createTestUtils > Options > customSyntax`](/api/create-test-utils#customsyntax)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

:::: details Show original description

<!-- @include: @/_parts/properties/custom-syntax.md#description -->

::::

---

### `autoStripIndent`

The same option as described in [`createTestUtils > Options > autoStripIndent`](/api/create-test-utils#autostripindent)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

:::: details Show original description

<!-- @include: @/_parts/properties/auto-strip-indent.md -->

::::

---

### `contextNewlineFallback`

The same option as described in [`createTestUtils > Options > contextNewlineFallback`](/api/create-test-utils#contextnewlinefallback)
but takes precedence over it if specified, allowing to overwrite the defaults for a particular rule.

:::: details Show original description

<!-- @include: @/_parts/properties/context-newline-fallback.md -->

::::
