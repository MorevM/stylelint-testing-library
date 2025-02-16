import{_ as a,c as i,ae as n,o as p}from"./chunks/framework.OCOI9reC.js";const d=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"_parts/properties/code-filename.md","filePath":"_parts/properties/code-filename.md"}'),e={name:"_parts/properties/code-filename.md"};function l(t,s,h,k,r,c){return p(),i("div",null,s[0]||(s[0]=[n(`<p>Maps to Stylelint&#39;s <code>codeFilename</code> option. <br> Useful if your rule is supposed to work differently depending on the file name/path, for example:</p><ol><li>Has different logic depending on the file extension (<code>.css</code> or <code>.scss</code> for example);</li><li>Should only work on files whose path matches a certain pattern.</li></ol><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-UiyiM" id="tab-ZiwherJ" checked><label data-title="your-rule.test.ts" for="tab-ZiwherJ">your-rule.test.ts</label><input type="radio" name="group-UiyiM" id="tab-6K6hyM3"><label data-title="your-rule.ts" for="tab-6K6hyM3">your-rule.ts</label></div><div class="blocks"><div class="language-ts vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { yourRule } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./your-rule.ts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ruleName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yourRule;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> testRule</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createTestRule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ ruleName });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testRule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">config: [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line highlighted"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">codeFilename:</span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;the-component.scss&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">accept: [</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ code:</span><span class="space"> </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;.the-component {}&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> yourRule</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">primary</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">secondaryOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">context</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">root</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">result</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span class="space"> </span><span class="space"> </span><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(root.source?.input.file); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// the-component.scss</span></span>
<span class="line"><span class="space"> </span><span class="space"> </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div></div></div>`,3)]))}const o=a(e,[["render",l]]);export{d as __pageData,o as default};
