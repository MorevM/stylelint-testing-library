<!-- #region description -->
Maps to [Stylelint's `plugins`](https://stylelint.io/user-guide/configure/#plugins) configuration property, has the same signature. \
Expected either the path to the JS file that provides your rule, or its contents,
or an array of such elements in the case you are testing a plugin pack.
<!-- #endregion description -->

Minimal example:

::: code-group

```ts [src/index.js]
import stylelint from 'stylelint';
import { fooRule } from './rules/foo-rule.js';
import { barRule } from './rules/bar-rule.js';

export default [
  stylelint.createPlugin('scope/foo-rule', fooRule),
  stylelint.createPlugin('scope/bar-rule', barRule),
];

```

```ts [vitest.config.js]
import { assert, describe, expect, it } from 'vitest';
import plugins from './src/index.js'; // [!code focus]

const { createTestRule, testRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
  plugins, // [!code focus]
});

```

:::
