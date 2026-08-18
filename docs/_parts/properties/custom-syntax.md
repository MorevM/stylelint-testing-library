<!-- #region description -->

Maps a custom syntax module name to
[Stylelint's `customSyntax`](https://stylelint.io/user-guide/configure/#customsyntax) option.

<!-- #endregion description -->

Can be configured for separate groups of tests, but if your plugin works exclusively with a single syntax (e.g. SCSS),
it may make sense to specify a parser here to reduce the amount of boilerplate code in the test files.

Example:

::: code-group

```ts [vitest.setup.js] {7}
import { assert, describe, expect, it } from 'vitest';
import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './src/index.js';

const { createTestRule, createTestRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
  customSyntax: 'postcss-scss',
  plugins,
});
```

:::
