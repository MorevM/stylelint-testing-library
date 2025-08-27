# Setup using `vitest`

---

[`vitest`](https://vitest.dev/) is the most modern and user-friendly testing platform built
on top of [`vite`](https://vite.dev/) with out-of-box ESM and TypeScript support.

::: tip
You can see the described example as a code
in the repository [here](https://github.com/morevm/stylelint-testing-library/tree/master/examples/vitest). \
Also you can explore [@morev/stylelint-plugin](https://github.com/MorevM/stylelint-plugin), which relies on this library to deliver a battle-tested set of rules enforcing BEM and (S)CSS best practices.
:::

::: warning Note
This section shows the minimal configuration - for full features and nice defaults,
check out the `API Reference` section or inspect all the options inline using editor's suggestions.
:::

Create a `vitest` setup file with the following content:

:::code-group

```ts [vitest.setup.ts]
// 1. Import testing functions
// This is optional - if you prefer globally declared functions for testing,
// the module will pick the necessary functions from the global scope by itself.
import { assert, describe, expect, it } from 'vitest';

// 2. Import the factory that will create functions bound to `vitest`
import { createTestUtils } from '@morev/stylelint-testing-library';

// 3. Import all the rules you want to test - this is usually
// the file that is the default export of your package.
// This step is generally optional - you can do it later,
// but it's recommended, as it reduces the amount of boilerplate code.
import plugins from './index';

// 4. Import types if you need to.
// You can declare global types directly in the same file (below).
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

// 5. Create testing functions
// Passing `testFunctions` is optional if you prefer globally declared functions.
// To see all available `createTestUtils` options, please
// refer to the `API Reference` section of this documentation
// or use inline IDE suggestions.
const { createTestRule, createTestRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
  plugins,
});

// 6. Make these functions globally available
// If you don't like to declare test functions globally -
// I guess you know how to design getting these functions as a separate hook :)
globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;

// 7. Declare a type for globally registered functions
// It's optional, but objectively there's no reason not to do it.
declare global {
  var createTestRule: CreateTestRule;
  var createTestRuleConfig: CreateTestRuleConfig;
}

```

```ts [vitest.setup.ts (without comments)]
import { assert, describe, expect, it } from 'vitest';
import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './index';
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

const { createTestRule, createTestRuleConfig } = createTestUtils({
  testFunctions: { assert, describe, expect, it },
  plugins,
});

globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;

declare global {
  var createTestRule: CreateTestRule;
  var createTestRuleConfig: CreateTestRuleConfig;
}

```

```ts [index.ts]
// All the rules that your plugin provides.
// This file is usually the default export of your package.
import lowercaseSelectorsRule from './rules/lowercase-selectors';

export default [
  lowercaseSelectorsRule,
];

```

:::

---

Next, specify the path to it in the `vitest` configuration file as [`setupFiles`](https://vitest.dev/config/#setupfiles) option:

:::code-group

```ts {5} [vitest.config.ts]
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'], // [!code focus]
  },
});

```

:::

---

Next, create a script for testing in your `package.json`:

::: code-group

```json{4} [package.json]
{
  "name": "your-awesome-stylelint-plugin",
  "scripts": {
    "test": "vitest"
  },
}
```

:::

---

**We're all set!** \
Next, follow the instructions on the [`Usage`](/guide/usage) page.
