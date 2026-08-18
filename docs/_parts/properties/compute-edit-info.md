<!-- #region description -->

Maps to Stylelint's [`computeEditInfo`](https://stylelint.io/user-guide/options/#computeeditinfo) option.
When enabled, expected warnings can include the edit produced by the rule's fixer.

<!-- #endregion description -->

Enable it globally if most rule tests assert exact fixer edits:

```ts
const { createTestRule } = createTestUtils({
  computeEditInfo: true,
});
```
