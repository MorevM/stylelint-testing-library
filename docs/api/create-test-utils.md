# `createTestUtils`

This is the main function that provides access to other testing functions
(`createTestRule` and `createTestRuleConfig`) bound to your testing platform.

Here you can configure some useful defaults described below.

## Options

You can always see the actual options in the source code
[here](https://github.com/morevm/stylelint-testing-library/tree/master/src/types/create-test-utils-schema.ts).

### `testingFunctions`

Testing functions provided by your test platform, if you want to be explicit. \
This is also an example of recommended use case.

::: code-group

```ts [vitest]
import { assert, describe, expect, it } from 'vitest';

const { createTestRule, testRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
});
```

```ts [jest]
import { describe, expect, it } from '@jest/globals';

const { createTestRule, testRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
});
```

```ts [node:test]
import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { createTestRule, testRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, it },
});
```

:::

::: info Info

Passing functions for testing is optional. \
If your test platform injects them into the global scope, the module will pick them on its own.

:::

---


### `plugins`

<!-- @include: @/_parts/properties/plugins.md -->

### `extraRules`

<!-- @include: @/_parts/properties/extra-rules.md -->

### `customSyntax`

<!-- @include: @/_parts/properties/custom-syntax.md -->

### `testGroupWithoutDescriptionAppearance`

The option controls how test groups are displayed in the console output if they do not have a description.
It is **recommended** to always use a description for a group of tests - it allows to find the right set faster.

```ts
/**
 * @default 'group-index'
 */
type testGroupWithoutDescriptionAppearance = 'group-index' | 'config' | 'line-in-file';
```

We have three options:

* Use the group index *(default)*;
* Use the stringified `config` property passed to the [`testRule`](/api/test-rule) utility;
* Line number in the file where the [`testRule`](/api/test-rule) call is located *(experimental)*.

The output of all of them is shown below:

::: details `group-index` (default)

A clean, minimalistic look that helps to quickly locate the right group of tests
(especially when using folding feature in the editor).

**Note**: this is a sequence number, not an index in the programming sense, so it starts with `1`.

```bash
✓ {rule-name}: group №1 (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
✓ {rule-name}: group №2 (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
```

:::

::: details `config`

Using configuration as a hint seems logical, but practice shows that it is not very useful due to the fact that output is
almost always not the same as specified in the file, meaning that you can not just select it and search the file -
and you have to count the index, or extract individual properties from the config and search for them - this is inconvenient.

The option exists to ensure that the project can be a drop-in replacement
for an existing solutions for testing Stylelint plugins that did not provide
the ability to set a description for a test group.

```bash
✓ {rule-name}: [ true ] (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
✓ {rule-name}: [ true, { ignore: 'foo' } ] (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
```

:::


::: details `error-line` *(experimental)*

Using the `group-index` property is usually more convenient than `config`,
but for existing codebases with a large number of tests it can still be quite painful
and require routine counting work.

This option allows you to use the line number in the file where
the `testRule` call is located as a description of the test script group.

::: code-group

```ts [Test file contents]
testRule({
  config: [true],
  accept: [
    { /* ... */ },
    { /* ... */ },
  ],
});

testRule({
  config: [true],
  accept: [
    { /* ... */ },
    { /* ... */ },
  ],
});
```

```bash [Console output]
✓ {rule-name}: line 1 in the source file (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
✓ {rule-name}: line 9 in the source file (9) # [!code focus]
  ✓ accept (5)
    ✓ ...
  ✓ reject (4)
    ✓ ...
```

:::

### `testCaseWithoutDescriptionAppearance`

The option controls how test cases are displayed in the console output if they do not have a description.
It is **recommended** to always use a description for a test cases - it allows to find the right one faster.

```ts
/**
 * @default 'case-index'
 */
type TestCaseWithoutDescriptionAppearance = 'case-index' | 'code';
```

We have two options: use the test index or its code, the output of both is shown below:

::: details `case-index` (default)

A clean, minimalistic look that helps to quickly locate the right test case.

```bash
✓ {rule-name}: group №1 (9)
  ✓ accept (2)
    ✓ Accept test case №1 # [!code focus]
    ✓ Accept test case №2 # [!code focus]
  ✓ reject (2)
    ✓ Reject test case №1 # [!code focus]
    ✓ Reject test case №2 # [!code focus]
```

:::

::: details `code`

Using the code as a hint seems logical, but practice shows that it is not very useful due to the fact that output is
usually pretty verbose and not the same as written in the file (in case of multi-line code),
meaning that you can not just select the code and search the file - and you have to count the index,
or extract individual entities from the code and search for them - this is inconvenient.

The option exists to ensure that the project can be a drop-in replacement
for an existing solutions for testing Stylelint plugins that did not provide
the ability to set a description for a test cases.

```bash
✓ {rule-name}: group №1 (9)
  ✓ accept (2)
    ✓ '.the-component {}' # [!code focus]
    ✓ '.the-component {\n\t&__element {}\n}' # [!code focus]
  ✓ reject (1)
    ✓ '.the-component {\n\t$b: #{&};\n\n\t#{$b} {}\n}' # [!code focus]
```

:::

### `autoStripIndent`

<!-- @include: @/_parts/properties/auto-strip-indent.md -->

::: info Note
You can always redefine this global setting for a group of tests or a single test.
:::
