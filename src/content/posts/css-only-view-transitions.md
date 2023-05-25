---
title: CSS-only View Transitions in 60 seconds
lede: It's just two steps. Seriously.
datePublished: 2023-05-25
draft: false
---

1. Use Chrome or Arc browser with the `view-transition-on-navigation` flag enabled (go to chrome://flags to check)
1. Add this tag to the `<head>` of the HTML pages you want to transition between:

```html
<meta name="view-transition" content="same-origin" />
```

It's done!

By default, the browser will crossfade between pages on navigation.

To get fancier, start adding `view-transition-name` properties to elements on each page. If an element has the same `view-transition-name` between pages, the browser will try to ease between them, morphing its height, width, color, etc. to produce a decently convincing effect.

But that explanation is for another time.
