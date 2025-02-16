import{_ as a,c as n,ae as p,o as e}from"./chunks/framework.OCOI9reC.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"_parts/properties/auto-strip-indent.md","filePath":"_parts/properties/auto-strip-indent.md"}'),i={name:"_parts/properties/auto-strip-indent.md"};function t(l,s,c,h,o,d){return e(),n("div",null,s[0]||(s[0]=[p(`<p>Controls whether indentation should be automatically stripped out of code blocks.</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span class="space"> </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">*</span><span class="space"> </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> false</span></span>
<span class="line"><span class="space"> </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">*/</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AutoStripIndent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><details class="details custom-block"><summary>Um, why?</summary><p>It can be quite tedious to calculate error positions when testing complex multi-line rules. <br> Let&#39;s pretend we have the following sample code and we expect to see an error highlighting on the <code>.another-component</code> selector:</p><div class="highlight-spaces-inside"><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">description</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Side-effect within \`@media\`-query on the root level&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">code</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.the-component {}</span></span>
<span class="line"></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@media (max-width: 320px) {</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.another-component {}</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></div><p>You would say that the error should start on line <code>4</code> and column <code>3</code>, wouldn&#39;t you? <br> But in fact, for this particular code block, the error will start on line <code>5</code> and column <code>9</code>!</p><p>This is because the input is a string that contains all linebreaks and indentation:</p><div class="highlight-spaces-inside"><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span>.the-component {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span>@media (max-width: 320px) {</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span>.another-component {}</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span>}</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span>\`</span></span></code></pre></div></div><p>Not very similar to how our CSS usually looks like. <br> Imagine you are designing a rule that interacts with indentation...</p><p>With the <code>autoStripIndent</code> option enabled, all code blocks automatically remove the start/end spaces as well as the extra indentation, so the string becomes exactly what we would see in the CSS file:</p><div class="highlight-spaces-inside"><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.the-component {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@media (max-width: 320px) {</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span>.another-component {}</span></span>
<span class="line"><span>}</span></span></code></pre></div></div></details>`,3)]))}const g=a(i,[["render",t]]);export{k as __pageData,g as default};
