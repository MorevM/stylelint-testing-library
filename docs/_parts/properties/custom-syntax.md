<!-- #region description -->
Maps to [Stylelint's `customSyntax`](https://stylelint.io/user-guide/configure/#customsyntax) configuration property, has the same signature.
<!-- #endregion description -->

Can be configured for separate groups of tests, but if your plugin works exclusively with a single syntax (e.g. SCSS),
it may make sense to specify a parser here to reduce the amount of boilerplate code in the test files.

Example:

::: code-group

```ts [src/index.js] {6}
import { assert, describe, expect, it } from 'vitest';
import plugins from './src/index.js';

const { createTestRule, testRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
  customSyntax: 'postcss-scss',
  plugins,
});
```

:::
