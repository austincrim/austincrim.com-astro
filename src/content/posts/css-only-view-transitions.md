---
title: CSS-only View Transitions in 60 seconds
lede: It's just two steps. Seriously.
datePublished: 2023-05-17
draft: true
---

1. Use Chrome or Arc browser with the `view-transition-on-navigation` flag enabled
1. Add this tag to your document's `<head>`:

```html
<meta name="view-transition" content="same-origin" />
```

It's done!

By default, the browser will crossfade between pages on navigation
