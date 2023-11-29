---
title: The two kinds of web components fans
lede: Reductionist? Yeah, I guess, but it's my blog.
datePublished: 2023-11-29
draft: false
---

## The source-first fans

These folks emphasize the "web native-ness" of web components. They might say things like "You'll never have to deal with breaking changes!" or "Have fun with your broken npm install 😏".

Since web components are a platform feature, you don't need special bundlers, dependencies, or incantations to use them. The source code of your web components will work until the heat-death of Google Chrome, theoretically, the same as the `<p>` tags that make up this blog post.

## The output-first fans

These folks emphasize the portability and interoperability of web components. They might use [Lit](https://lit.dev/), [Enhance](https://enhance.dev/), or something else to assuage the (IMO) terrible authoring experience, but the built artifact is what they are after anyways.

A functioning web component can be used in any page, any framework, any evergreen browser. Drop in a `<script>` tag and start using your `<special-little-component>`, regardless if the dev team is full of Svelte Stans or Religious Reacters. These fans are willing to put up with npm, major versions, and bundlers in order to achieve the output they want.
