<!-- #region description -->

Maps to Stylelint's [`computeEditInfo`](https://stylelint.io/user-guide/options/#computeeditinfo) option.
An explicit `fix` expectation enables this option for the initial lint of that test case.

<!-- #endregion description -->

Enable it globally to run all cases with edit information:

```ts
const { createTestRule } = createTestUtils({
  computeEditInfo: true,
});
```
