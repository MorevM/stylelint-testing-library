# Setup using `jest`

---

[`jest`](https://jestjs.io/) is the traditional and most popular testing solution.

::: tip
You can see the described example as a code
in the repository [here](https://github.com/morevm/stylelint-testing-library/tree/master/examples/jest).
:::

::: info Author's Note

If you are starting a new project - first consider using `vite` as a test-runner. \
In most scenarios it is faster, easier to configure and has better documentation.

:::

::: warning Note
This section shows the minimal configuration - for full features and nice defaults,
check out the `API Reference` section or inspect all the options inline using editor's suggestions.
:::

---

First, install `jest` itself and some additional packages that you will need to get started:

::: code-group

```sh [npm]
npm add -D jest-expect-message
```

```sh [yarn]
yarn add -D jest-expect-message
```

```sh [pnpm]
pnpm add -D jest-expect-message
```

:::

If you are using TypeScript, install the modules required by `jest` to work with it:

::: code-group

```sh [npm]
npm add -D ts-jest ts-node @types/jest
```

```sh [yarn]
yarn add -D ts-jest ts-node @types/jest
```

```sh [pnpm]
pnpm add -D ts-jest ts-node @types/jest
```

:::

---

Next, create a `jest` config file with the following content (at least):

:::code-group

```ts [jest.config.ts]
import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
} as JestConfigWithTsJest;
```

:::

---

Next, create a file that will export functions for testing:

::: code-group

```ts [testing-functions.ts]
// 1. Import the factory that will create functions bound to `jest`
import { createTestUtils } from '@morev/stylelint-testing-library';
// 2. Import all the rules you want to test - this is usually
// the file that is the default export of your package.
// This step is generally optional - you can do it later,
// but it's recommended, as it reduces the amount of boilerplate code.
import plugins from './index';
// 3. Import a module that extends `jest` matchers
// for more detailed error messages
import 'jest-expect-message';

// 4. Create testing functions
// To see all available `createTestUtils` options, please
// refer to the `API Reference` section of this documentation
// or use inline IDE suggestions.
const { createTestRule, createTestRuleConfig } = createTestUtils();

// 5. Export these functions
// Unfortunately, you will need to import these functions
// within each of your test files, as `jest` test functions
// (`describe`, `it`, `expect`, etc) only exist in the context of such files.
// If you know how to access these variables outside this context -
// feel free to create a PR or issue.
export { createTestRule, createTestRuleConfig };

```

```ts [testing-functions.ts (without-comments)]
import { createTestUtils } from '@morev/stylelint-testing-library';
import plugins from './index';
import 'jest-expect-message';

const { createTestRule, createTestRuleConfig } = createTestUtils({ plugins });

export { createTestRule, createTestRuleConfig };

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

Next, create a script for testing in your `package.json`:

::: code-group

```json{4} [package.json]
{
  "name": "your-awesome-stylelint-plugin",
  "scripts": {
    "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js"
  },
}
```

:::

and you are ready to test your rules using the `npm run test` command:

::: code-group

```ts [rules/lowercase-selectors.test.ts]
import { createTestRule, createTestRuleConfig } from '../testing-functions';
import { messages, ruleName } from './lowercase-selectors';

const testRule = createTestRule({ ruleName });
const testRuleConfig = createTestRuleConfig({ ruleName });

testRuleConfig({ /* ... */ });
testRule({ /* ... */ });
```

::: code-group

---

**We're all set!** \
Next, follow the instructions on the [`Usage`](/guide/usage) page.
