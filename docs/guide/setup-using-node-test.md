# Setup using `node:test`

---

[`node:test`](https://nodejs.org/api/test.html) - Node's built-in test runner.

::: tip
You can see the described example as a code
in the repository [here](https://github.com/morevm/stylelint-testing-library/examples/node-test).
:::

::: info Author's Note

Running tests written with TypeScript using a native test runner is a bit of an adventure,
and here we describe a use case with JavaScript.

DX of an error output also leaves a lot to be desired compared to other platforms,
but the obvious advantage of `node:test` is the lack of third-party dependencies,
if that's important to you.

:::

::: warning Note
This section shows the minimal configuration - for full features and nice defaults,
check out the `API Reference` section or inspect all the options inline using editor's suggestions.
:::

Create a `node.test.setup.js` file with the following content:

:::code-group

```ts [node.test.setup.js]
// 1. Import testing functions
import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// 2. Import the factory that will create functions bound to Node test runner
import { createTestUtils } from '@morev/stylelint-testing-library';

// 3. Create testing functions
// To see all available `createTestUtils` options, please
// refer to the `API Reference` section of this documentation
// or use inline IDE suggestions.
const { createTestRule, createTestRuleConfig } = createTestUtils({
  testFunctions: { it, describe, assert },
});

// 4. Make these functions globally available
// If you don't like to declare test functions globally -
// you should export these functions from a file
// and import it in each test.
globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;
```

```ts [node.test.setup.js (without comments)]
import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createTestUtils } from '@morev/stylelint-testing-library';

const { createTestRule, createTestRuleConfig } = createTestUtils({
  testFunctions: { it, describe, assert },
});

globalThis.createTestRule = createTestRule;
globalThis.createTestRuleConfig = createTestRuleConfig;
```

:::

---

Specify the types for these global functions if you need to (strongly recommended):

:::code-group

```ts [global.d.ts]
import type { CreateTestRule, CreateTestRuleConfig } from '@morev/stylelint-testing-library';

declare global {
  var createTestRule: CreateTestRule;
  var createTestRuleConfig: CreateTestRuleConfig;
}

export {};

```

```json{5} [tsconfig.json]
{
  "compilerOptions": {
    "strictNullChecks": true,
    "allowJs": true,
    "types": ["./global.d.ts"],
  },
}
```

:::

---

Next, create a script for testing in your `package.json`:

::: code-group

```json{4} [package.json]
{
  "name": "your-awesome-stylelint-plugin",
  "scripts": {
    "test": "node --import ./node.test.setup.js --test"
  },
}
```

and you are ready to test your rules using the `npm run test` command.

:::

---

**We're all set!** \
Next, follow the instructions on the [`Usage`](/guide/usage) page.
