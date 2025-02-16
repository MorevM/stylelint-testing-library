<!-- #region description -->

Maps to Stylelint's `codeFilename` option. \
Useful if your rule is supposed to work differently depending on the file name/path, for example:

1) Has different logic depending on the file extension (`.css` or `.scss` for example);
1) Should only work on files whose path matches a certain pattern.

<!-- #endregion description -->

::: code-group

```ts{8} [your-rule.test.ts]
import { yourRule } from './your-rule.ts';

const { ruleName } = yourRule;
const testRule = createTestRule({ ruleName });

testRule({
  config: [true],
  codeFilename: 'the-component.scss',
  accept: [
    { code: '.the-component {}' },
  ],
});
```

```ts{3} [your-rule.ts]
export const yourRule = (primary, secondaryOptions, context) => {
  return (root, result) => {
    console.log(root.source?.input.file); // the-component.scss
  };
};
```

:::
