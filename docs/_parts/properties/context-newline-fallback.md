Controls which line break notation should be provided in the Stylelint context (`context.newline`)
if the test string does not contain an explicit line break.

The override can wrap plugin objects passed through `plugins`, but not plugins referenced by a module path string.

You can read the details of the issue [in the Stylelint repository](https://github.com/stylelint/stylelint/issues/9281).

```ts
/**
 * @default 'system'
 */
type ContextNewlineFallback = 'system' | 'lf' | 'crlf';
```
