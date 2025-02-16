<!-- #region description -->
Object in form compatible with [Stylelint's `rules` property](https://stylelint.io/user-guide/configure/#rules),
that allows to run `stylelint` with extra rules in addition to the one being tested.
<!-- #endregion description -->

```ts
/**
 * @default {}
 */
type ExtraRules = Record<string, any>;
```

It is a good practice to test a rule in isolation from all others,
but in edge cases you may want to test how rules work together - this setting allows you to do that.
