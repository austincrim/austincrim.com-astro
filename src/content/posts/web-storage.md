---
title: "Every way to store data in the browser"
lede: "The browser can store data now. Like a lot of data."
datePublished: 2024-08-01
draft: true
---

# Why

I think you should store data in your user's browser. Or at least thinking about it.

So many web apps today introduce latency, errors, and loading spinners in order to pass tiny blobs of JSON back and forth from a server. These packets are usually in the realm of 10s of kilobytes.

# A note about data durability

The data you store in a browser is ultimately in your users' hands. Like anything you ship to a user, there's a chance they are going to screw it up. At any time, a user can hit the "Clear browser storage" button which will wipe out most of the storage mechanisms I mention below.

This means that browser storage should usually _enhance_ the user experience rather than define it. Storing data in the browser should be viewed as another kind of progressive enhancement.

## The Safari problem

**Safari** in particular has a reputation of ditching your stored data at seemingly random intervals. This is due to their ["Intelligent Tracking Prevention"](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) feature. If a user hasn't interacted with a given site for seven days, Safari will automatically clear most forms of browser storage used by that site. Each user interaction will reset this clock, though, so regular users of your app shouldn't be affected.

In any case, do not depend on your data being accessible 100% of the time and opt to store data that can be easily replaced.

Go forth and code defensively.

---

<p class='bg-slate-100 border dark:border-slate-700 dark:bg-slate-800 rounded p-8'>
For the purposes of this post, I'm defining <b>storing data</b> as any means of persisting some information on the client through a full page reload.
</p>

# Cookies

- Little bits of data usually set by the server in a `Set-Cookie` header.
- Can set cookies in the browser using the (kinda gross) `document.cookie` API.
- can only access in browser JavaScript if not `HttpOnly`
- deleted with "Clear cookies" browser action
- sync api
- 100s of cookies per domain
- ~4kb limit per cookie
- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

```js
document.cookie = "has_visited=true"
```

# localStorage

- kv store
- keys/values are always strings
- persists between sessions
- deleted with "Clear cookies" browser action
- sync api
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

- all the same as `localStorage`
- does not persist through session (closing the tab/window)
- does persist through refreshes
- deleted with "Clear cookies" browser action
- sync api
- ~5mb limit
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

```js
let text = document.querySelector("textarea")
sessionStorage.setItem("saved-message", text.value)
```

# IndexedDB

- more database-like
- indexes, transactions, cursors
- very cumbersome api
- web storage quotas
- deleted with "Clear cookies" browser action
- async api
- raw example would make this post too long
- [`idb`](https://github.com/jakearchibald/idb) wrapper that is heavily recommended
- [`absurd-sql`](https://github.com/jlongster/absurd-sql) can run sqlite backed by IndexedDB
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

- kv store where the key is a `Request` or url and the value is a `Response`
- frequently used in service workers, but available under `window` global as well
- does not respect cache headers
- will not cache cookies
- web storage quotas
- entries don't expire until deleted
- deleted with "Clear cookies" browser action
- async api
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

- not visible in the user's file system
- explicit user permission not required
- file system scoped by origin
- optimized for performance
- can run sqlite
- web storage quotas
- **not** deleted with "Clear cookies" browser action
- sync and async apis
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)

```js
let root = navigator.storage.getDirectory()
let notesHandle = await root.getDirectoryHandle("notes", { create: true })
for await (let [name, handle] of notesHandle) {
  if (handle.kind === "file") {
    let file = await handle.getFile()
    let contents = await file.text()
    console.log(name, contents)
  }
}
```

---

Notes:

- Incognito browsers typically delete all storage when the session ends
- Web Storage API quotas
  - Firefox: 10% of total disk size
    - 50% in persistent mode
    - `navigator.storage.persist()`
  - Chromium: 60% of total disk size
  - Safari: 20% of total disk size
    - no more than 80% across all origins
    - special usage-based eviction when using cross-site tracking prevention, 7 days with no activity = all data deleted besides server-set cookies
  - `QuotaExceededError`
  - Browsers use LRU cache to evict data when space is low
  - all data is deleted at once when evicted to avoid consistency issues
  - StorageManager API: `await navigator.storage.estimate()`
