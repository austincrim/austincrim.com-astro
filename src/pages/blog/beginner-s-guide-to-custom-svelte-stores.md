---
title: Beginner’s guide to custom Svelte stores
lede: undefined
datePublished: 9999-99-99
draft: true
layout: ../../layouts/PostLayout.astro
---

## What are Svelte stores?

Svelte stores are a subscription-based state management solution offered directly by [Svelte](https://svelte.dev). They are similar in spirit to [MobX](https://mobx.js.org/README.html) or [RxJS Observables](https://rxjs.dev/guide/observable). In essence, a store holds a value and notifies any subscribers when the value changes.

At its core, a `writable` Svelte store (`readable` and `derived` are types of stores that differ slightly) is a plain object with three functions: `subscribe`, `update`, and `set`.

`subscribe` sets up a callback function that re-runs whenever the value of the store changes (via `update` or `set`).

`update` …well, updates the value of the store. It takes a callback which, given the current value of the store, returns the new value.

`set` directly changes the value of the store. No callback function; it takes a plain value that will immediately overwrite the current store value.

Here’s a basic example I adapted from the [Svelte docs](https://svelte.dev/docs#run-time-svelte-store):

```javascript
import { writable } from 'svelte/store'

const count = writable(0) // defaults the store value to 0

/**
 * `subscribe` takes a callback function that is executed once when `subscribe` is called
 *  and again whenever the value is changed via `set` or `update`.
 *  It returns an `unsubscribe` cleanup function.
 */
const unsubscribe = count.subscribe((value) => {
  console.log(value)
}) // logs '0'

count.update((value) => value + 1) // logs '1'

count.set(2) // logs '2'

unsubscribe()
```

Stores also have a special sugary syntax when used inside of Svelte components. Svelte automatically handles the subscription (and un-subscription) and allows you to access the reactive value at any time by prefixing the store name with a `$` . This might come up later.

```html
<script>
  import { myStore } from './store.js'

  // sugary syntax for calling `myStore.set('Hello world!')`
  $myStore = 'Hello world!'
</script>

<!-- automatically uses the reactive store value, no boilerplate! -->
<p>{$myStore}</p>
```

Stores are incredibly ergonomic and are often used for shared component state, but we can take them further.

A point that I glossed over earlier is that the return value of `writable()` is just a plain object with three functions on it. In fact, **any object that correctly implements the** **`subscribe`** **function is a valid Svelte store**. This is called the [store contract](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract), and it’s the basis behind the concept of custom stores.

## The simplest custom store

As long as an object contains the correct `subscribe` function, it can be used like any other Svelte store (sugary component syntax included).

```javascript
// store.js
import { writable } from 'svelte/store'

// writable returns a plain object with `subscribe`, `update`, and `set`
const { subscribe, set, update } = writable(0)

// this is still a valid Svelte store
export const count = {
  subscribe
}
```

In the above snippet, `count` is still a valid Svelte store, but it isn’t updatable by anyone importing it because the `set` and `update` methods have been omitted from the export. It’s common to want to protect shared state from being freely mutated by anyone who can import it, instead providing a more constrained API.

We might not want to **return** `set` or `update`, but we can still **use** them!

```javascript
// store.js
import { writable } from 'svelte/store'

const { subscribe, set, update } = writable(0)

export const count = {
  subscribe,
  increment() {
    update((count) => count + 1)
  },
  decrement() {
    update((count) => count - 1)
  },
  reset() {
    set(0)
  }
}
```

```html
<script>
  // counter.svelte
  import { count } from './store.js'
</script>

<h1>The count is {$count}</h1>
<button on:click="{count.increment}">Add</button>
<button on:click="{count.decrement}">Subtract</button>
<button on:click="{count.reset}">Reset</button>
```

Consumers of the store can’t directly change the store value, but they can still interact with it through the methods we chose to expose. The store is still reactive and works in every context that a regular store does, but now we have the power to implement custom logic.

And that is our first custom Svelte store — reactive data and related logic in one package.

## Going further

The count example above is one of the simplest forms a custom store can take, but I hope it has your gears turning with more ideas. You can do essentially anything within a custom store, but I often think of them as similar to custom hooks in React. They can encapsulate any state and logic you want to share between components.

Here’s a custom `readable` store from Svelte maintainer [Geoff Rich](https://twitter.com/geoffrich_) to track a user’s [reduced motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion):

```javascript
// source https://geoffrich.net/posts/svelte-prefers-reduced-motion-store/
// annotations my own
import { readable } from 'svelte/store'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const getInitialMotionPreference = () =>
  window.matchMedia(reducedMotionQuery).matches

// setup a `readable` store with the initial value of reduced motion media query.
// callback function will run after the first subscription to the store.
export const reducedMotion = readable(getInitialMotionPreference(), (set) => {
  const updateMotionPreference = (event) => {
    set(event.matches)
  }

  const mediaQueryList = window.matchMedia(reducedMotionQuery)
  // update store if media query ever changes
  mediaQueryList.addEventListener('change', updateMotionPreference)

  // cleanup function will run after the last subscriber unsubscribes from store
  return () => {
    mediaQueryList.removeEventListener('change', updateMotionPreference)
  }
})
```

This `local` function returns a custom store that syncs the store value to `localStorage`:

```javascript
import { writable, get } from 'svelte/store'

export function local(key, initialValue) {
  const store = writable(initialValue)

  function sync(key, value) {
    if (typeof localStorage == 'undefined') return
    store.set(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return {
    subscribe: store.subscribe,
    set(value) {
      sync(key, value)
    },
    update(callback) {
      const currentValue = get(store)
      const newValue = callback(currentValue)

      sync(key, newValue)
    }
  }
}
```
