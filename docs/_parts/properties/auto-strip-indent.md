Controls whether indentation should be automatically stripped out of code blocks.

```ts
/**
 * @default false
 */
type AutoStripIndent = boolean;
```

::: details Um, why?

It can be quite tedious to calculate error positions when testing complex multi-line rules. \
Let's pretend we have the following sample code and we expect to see an error highlighting on the `.another-component` selector:

<div class="highlight-spaces-inside">

  ```ts
  {
    description: 'Side-effect within `@media`-query on the root level',
    code: `
      .the-component {}

      @media (max-width: 320px) {
        .another-component {}
      }
    `,
  }

  ```

</div>

You would say that the error should start on line `4` and column `3`, wouldn't you? \
But in fact, for this particular code block, the error will start on line `5` and column `9`!

This is because the input is a string that contains all linebreaks and indentation:

<div class="highlight-spaces-inside">

  ```text
  `
        .the-component {}

        @media (max-width: 320px) {
          .another-component {}
        }
      `
  ```

</div>

Not very similar to how our CSS usually looks like. \
Imagine you are designing a rule that interacts with indentation...

With the `autoStripIndent` option enabled, all code blocks automatically remove the start/end spaces
as well as the extra indentation, so the string becomes exactly what we would see in the CSS file:

<div class="highlight-spaces-inside">

  ```text
  .the-component {}

  @media (max-width: 320px) {
    .another-component {}
  }
  ```

</div>

:::
