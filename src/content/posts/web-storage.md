---
title: "Every way to store data in the browser"
lede: "The browser can store data now. Like a lot of data."
datePublished: 2024-08-01
draft: true
---

# Why

I think you should store data in your user's browser. Or at least consider it.

Many web apps today introduce latency, errors, and slow interactions in order to pass tiny blobs of JSON back and forth from a server. These packets are usually in the 10s kilobytes. TODO insert example. I want you to consider whether that architecture is always the right choice for your entire app. While reading this (and you will read to the end, right?), think about the experiences you could build if the relevant data was always at your fingertips.

You might be thinking, "this just sounds like another caching layer", and you would be right! Good job. It might sound difficult to manage, but come on, how hard can cache invalidation be?

# A note about data durability

The data you store in a browser is ultimately in your users' hands and, like anything you ship to a user, there's a chance they are going to screw it up. At any time, they can hit the "Clear browser storage" button which will wipe out most of the storage mechanisms I mention below.

This means that browser storage should usually _enhance_ the user experience rather than create it. Storing data in the browser should be viewed as another kind of progressive enhancement.

You _can_ tell the browser your data is important by opting in to [**persistent mode**](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist), but this only prevents the browser from automatically evicting your data if the [storage quota](#browser-storage-quotas) is getting low. The user can still remove data at any time.

## The Safari problem

_Thanks to Kent C. Dodds for [calling this to my attention.](https://x.com/kentcdodds/status/1820638244041802016)_

**Safari** in particular has a reputation of ditching your stored data at seemingly random intervals. This is due to their ["Intelligent Tracking Prevention"](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) feature. If a user hasn't interacted with a given site for seven days, Safari will automatically clear most forms of browser storage used by that site. Each user interaction will reset this clock, though, so regular users of your app shouldn't be affected.

In any case, do not depend on your data being accessible 100% of the time and opt to store data that can be easily replaced.

Go forth and code defensively.

---

<p class='bg-slate-100 border dark:border-slate-700 dark:bg-slate-800 rounded p-8'>
For the purposes of this post, I'm defining <b>storing data</b> as any means of persisting some information in the browser through a full page reload.
</p>

# Cookies

- Little bits of data usually set by the server in a `Set-Cookie` header.
- You can set cookies in the browser using the (gross) `document.cookie` API.
- You can only access them from browser JavaScript if `HttpOnly` is not set
- Deleted with "Clear browser storage" button
- Synchronous API
- 100s of cookies per domain
- ~4kb limit per cookie
- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

```js
document.cookie = "has_visited=true"
```

# localStorage

- Key/value store
- Keys and values must always be strings
- Persists through closing/opening tabs
- Deleted with "Clear browser storage" button
- Synchronous API
- ~5mb limit
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

```js
localStorage.setItem(
  "prefs",
  JSON.stringify({ theme: "dark", notifications: true })
)

let preferences = JSON.parse(localStorage.getItem("prefs"))
```

# sessionStorage

- Mostly the same as `localStorage` but
- Deleted when tab/window is closed
- Deleted with "Clear browser storage" button
- Synchronous API
- ~5mb limit
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

```js
let text = document.querySelector("textarea")
sessionStorage.setItem("saved-message", text.value)
```

# IndexedDB

- More database-like storage
- Supports indexes, transactions, cursors
- Very cumbersome API
- Adheres to [browser storage quotas](#browser-storage-quotas)
- Deleted with "Clear browser storage" button
- Async API
- Example with raw API would make this post too long, use a wrapper
- [`idb`](https://github.com/jakearchibald/idb) is heavily recommended for general purpose use
- [`absurd-sql`](https://github.com/jlongster/absurd-sql) can run Sqlite backed by IndexedDB
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

```js
import { openDB } from "idb"
let db = await openDB("my-app", 1, {
  upgrade(db) {
    db.createObjectStore("notes")
  }
})
let myNotes = await db.getAll("notes")
```

# Cache API

- Key/value store where the key is either a `Request` or a URL string and the value is a `Response`
- Often used in service workers, but available in the main thread as well
- Does not respect `Response` cache headers
- Will not cache cookies
- Adheres to [browser storage quotas](#browser-storage-quotas)
- Entries will never expire until you delete theme
- Deleted with "Clear browser storage" button
- Async API
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

```js
const cache = await caches.open("fetches")
async function getUrl(url, opts = {}) {
  let match = await cache.match(url)
  if (match) return match

  let response = await fetch(url, opts)
  await cache.put(url, response.clone())

  return response
}
```

# Origin Private File System

- Full on file system
- Not visible in the user's operating system
- Scoped by origin
- Optimized for performance
- Can run Sqlite
- Adheres to [browser storage quotas](#browser-storage-quotas)
- **not** deleted with "Clear browser storage" button
- Both synchronous and async APIs
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)

```js
let root = navigator.storage.getDirectory()
let recipesHandle = await root.getDirectoryHandle("recipes", { create: true })
for await (let [name, handle] of recipesHandle) {
  if (handle.kind === "file") {
    let file = await handle.getFile()
    let contents = await file.text()
    console.log(name, contents)
  }
}
```

---

# Browser storage quotas

The following quotas apply only to the **Cache API**, **IndexedDB** and the **Origin Private File System**.

- **Firefox**: 10% of disk, 50% in persistent mode
- **Chromium**: 50% of disk in either mode
- **Safari**: 20% of disk, 60% if saved to Home Screen or Dock
  - no more than 80% across all origins
- Will throw `QuotaExceededError` if there is insufficient space when performing a storage operation
- [StorageManager API](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate)
  - `await navigator.storage.estimate()` returns a best estimate of how much total storage is available

# Sundries

- Incognito browsers typically delete all storage when the session ends
- Safari uses a usage-based eviction when using cross-site tracking prevention, 7 days with no activity = all data deleted besides server-set cookies
- Browsers use a least recently used (LRU) cache by origin to evict data when space is low
- All data for a given origin is deleted at once when evicted to avoid consistency issues
