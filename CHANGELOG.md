## [1.2.0](https://github.com/MorevM/stylelint-testing-library/compare/v1.1.1...v1.2.0) (2026-11-18)

### Testing warnings and fixes

#### Check warnings from one rule

In an integration test with multiple rules, use `warningsFrom: [ruleName]` to check warnings from just the rule under test.
Here the empty block triggers the helper rule, but the color rule has nothing to report.
All configured rules still run, and `fixed` checks their combined output.

```ts
const testRule = createTestRule({ ruleName: 'color-hex-length' });

testRule({
  config: 'long',
  extraRules: { 'block-no-empty': true },
  warningsFrom: ['color-hex-length'],
  accept: [{ code: 'a {}' }],
});
```

#### Check the edit an editor would offer

Use `fix` to check the [range and replacement text](https://stylelint.io/user-guide/node-api/#edit-info) for one warning.
Use `fix: null` to assert that the warning offers no edit. Either expectation enables
[`computeEditInfo`](https://stylelint.io/user-guide/options/#computeeditinfo) automatically. Omit `fix` to skip this check.

```ts
testRule({
  config: 'long',
  reject: [{
    code: 'a { color: #fff }',
    message: 'Expected "#fff" to be "#ffffff" (color-hex-length)',
    fix: { range: [14, 15], text: 'ffff' },
    fixed: 'a { color: #ffffff }',
  }],
});
```

#### Check configuration errors that depend on the CSS

Some rules only discover a configuration error when they encounter particular CSS.
List the expected [`invalidOptionWarnings`](https://stylelint.io/user-guide/node-api/#result-object) in reporting order,
using strings or regular expressions. For a rule that replaces selectors, this case checks what happens when it encounters a protected one.

```ts
const code = '.keep {}';

testSelectorRule({
  config: ['.replacement', { preserveSelectors: ['.keep'] }],
  reject: [{
    code,
    invalidOptionWarnings: [/Cannot replace preserved selector/],
    warnings: [],
    fixed: code
  }],
});
```

### Testing with your project's CSS

#### Share grammar and reference files

Set [`languageOptions`](https://stylelint.io/user-guide/configure/#languageoptions) once
to share your project's CSS grammar (Stylelint 16.15+).
Use [`referenceFiles`](https://stylelint.io/user-guide/configure/#referencefiles) to load definitions such as keyframes (Stylelint 17.9+).
You can replace either setting for one rule, group, or individual case.

```ts
const { createTestRule } = createTestUtils({
  languageOptions: { syntax: { properties: { 'brand-ink': '<color>' } } },
  referenceFiles: ['fixtures/animations.css'],
});
```

#### Pass a PostCSS syntax object

TypeScript now accepts an imported syntax object directly in Stylelint's
[`customSyntax`](https://stylelint.io/user-guide/options/#customsyntax) option.

```ts
import scss from 'postcss-scss';

const testRule = createTestRule({ ruleName: 'block-no-empty', customSyntax: scss });
```

### Other fixes

- For a fixer that removes the entire input, `fixed: ''` now checks that the resulting stylesheet is empty.
- Test cases can be reused across groups. Stripping indentation now preserves the original `code` and `fixed` strings.
- `testRuleConfig` now includes `extraRules` when validating a configuration.
- The TypeScript signature for `testRule(...)` now reflects its `void` return value.

The setup guides and examples for Jest, Vitest, and Node’s test runner have also been updated.

## [1.1.1](https://github.com/MorevM/stylelint-testing-library/compare/v1.1.0...v1.1.1) (2026-08-17)

### Bug fixes

* Relint the fixed code in report mode ([#232](https://github.com/MorevM/stylelint-testing-library/issues/232)) ([6335f9a](https://github.com/MorevM/stylelint-testing-library/commit/6335f9a791dadeae43ec460b3de9ab2f2cdc6720))


## [1.1.0](https://github.com/MorevM/stylelint-testing-library/compare/v1.0.3...v1.1.0) (2026-05-13)

### Features

* Add `contextNewlineFallback` setting ([#166](https://github.com/MorevM/stylelint-testing-library/issues/166)) ([89c44c1](https://github.com/MorevM/stylelint-testing-library/commit/89c44c13ab8528a3ed53e8d3c205c40a7cdd1662)) to allow platform-independent tests that rely on Stylint's `context.newline`.


## [1.0.3](https://github.com/MorevM/stylelint-testing-library/compare/v1.0.2...v1.0.3) (2026-05-10)

### Chores

* Allow `stylelint` versions 16+ ([#153](https://github.com/MorevM/stylelint-testing-library/issues/153)) ([dd3d19e](https://github.com/MorevM/stylelint-testing-library/commit/dd3d19ecdf45d4e534abb261fb0a24263ed2d486))


## [1.0.2](https://github.com/MorevM/stylelint-testing-library/compare/v1.0.1...v1.0.2) (2025-09-02)


### Chores

* Add `stylelint` to `peerDependencies` of the package ([#65](https://github.com/MorevM/stylelint-testing-library/issues/65)) ([4e15101](https://github.com/MorevM/stylelint-testing-library/commit/4e1510103c5f530df2d893dec6b5b17a174bf813))

## [1.0.1](https://github.com/MorevM/stylelint-testing-library/compare/v1.0.0...v1.0.1) (2025-08-27)


### Bug fixes

* Check fixed code with the same `fix` option as before ([32b617e](https://github.com/MorevM/stylelint-testing-library/commit/32b617e9dde1b0a5716062d1326426daa3aff2df))

### Documentation

* Add links to stylelint plugin that uses the library ([30403fe](https://github.com/MorevM/stylelint-testing-library/commit/30403fe1fe3c3dde1f571f791fcc86004a6a4973))
* Align the documentation with actual examples ([176dc6e](https://github.com/MorevM/stylelint-testing-library/commit/176dc6e850fe54a03349ce4a19e9331e8b8212f9))
* Fix broken repo links ([599b428](https://github.com/MorevM/stylelint-testing-library/commit/599b42814424f5266a27ba4b867a83fc037fa96b))
* Fix package name in the installation instructions ([1e26ce7](https://github.com/MorevM/stylelint-testing-library/commit/1e26ce7fe38614bdc3f31970c3c6181c7b181b75))
* Fix the code syntax in the docs ([7c2b0dc](https://github.com/MorevM/stylelint-testing-library/commit/7c2b0dc763d027d3ddd8b722c702879d36f1bd26))

# Changelog

## 1.0.0 (2025-02-16)

It's time :)

## 0.0.0 (2025-02-16)
