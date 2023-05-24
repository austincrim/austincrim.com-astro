---
title: How I Added Themes to My Website Using Tailwind
lede: A brief look at my theming workflow
datePublished: 2021-04-07
draft: false
---

## Background

I recently added theming to my [website](https://austincrim.com/) and I wanted to quickly jot down my implementation. I ran into a little friction along the way, but I am really happy with how the result looks and feels. I'm excited about adding even more themes!\
A lot of this is based on Tailwind Labs' own [theming video](https://www.youtube.com/watch?v=MAtaT8BZEAo) and I highly encourage you to start there if you are interested in adding themes with Tailwind. All code examples will assume that your project is already integrated with TailwindCSS.

> Note ⚠️: Most of this article applies to any site, regardless if you use TailwindCSS. If you're not using Tailwind, feel free to read on, you might learn something!

## Overview

The modern mechanism for theming on the web today is through CSS Custom Properties (aka CSS Variables). They are incredibly flexible and make theming much simpler than it used to be. A basic workflow for adding theme support to a website looks something like this:

1. define color palettes in CSS variables
2. use CSS variables wherever a theme-specific value is needed
3. add/remove theme class names in the DOM based on some action (button click, dropdown select, etc.)
4. optionally persist a user's preference

In Tailwind, an extra step is required somewhere in that list: **generating new class names with your** **`tailwind.config.js`**. Therein lies the rub that makes theming with Tailwind different. I found this process to offer some friction, but being a major TW lover, I persevered in the name of not writing custom CSS classes by hand.

## Defining Your Palette in CSS Variables

This step honestly contained the bulk of the time spent in my case. I was trying to craft each theme from scratch, so coming up with all of the color values took a decent amount of trial and error.

Using the [full TailwindCSS color palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) as a reference, I copied and pasted RGB values into my CSS variables to preview them on my site. Not the best workflow, but I stuck with it and got a good result. I wanted to stay within Tailwind colors, but unfortunately, I don't know of a way to reference Tailwind colors in a plain CSS file. This resulted in my copy/paste workflow which, in my opinion, was the most painful part of the whole theming process.

After finishing a theme, my CSS would look something like this:

```css
.theme-dark {
  --color-base: 17, 24, 39; /* gray-900 */
  --color-text-base: 243, 244, 246; /* gray-100 */
  --color-off-base: 31, 41, 55; /* gray-800 */
  --color-text-muted: 229, 231, 235; /* gray-200 */
  --color-muted-offset: 209, 213, 219; /* gray-300 */
  --color-primary: 147, 197, 253; /* blue-300 */
  --color-secondary: 96, 165, 250; /* blue-400 */
}
```

As you can see, I attempted to name my variables generically enough to be reusable while maintaining clarity. I have a few base colors for backgrounds and text, as well as offsets, a primary, and a secondary. You can include as many different variables as your theme requires, but I tried to keep it reasonably simple.

## Generating and Using New Theme Classes

Once you have your themes outlined in CSS variables, you've done the hard bit. Now we are almost to the fun part! To use these dynamic theme colors in Tailwind, you have to generate utility classes using the config file. If you have never tweaked a `tailwind.config.js` file, this step might take some getting used to, but it is fairly straightforward once you have had some practice.

Here's a snippet from my config file:\
(For an explanation on the `withOpacity` function, please refer to the Tailwind Labs video linked above.)

```javascript
    function withOpacity(variableName) {
        return ({ opacityValue }) => {
            if (opacityValue) {
                return `rgba(var(${variableName}), ${opacityValue})`;
            }
            return `rgb(var(${variableName}))`;
        };
    }

    module.exports = {

       ...,

       theme: {
            // we want to extend the current colors instead of replacing them
            extend: {
            // this will generate utilities like `bg-base` and `bg-primary`
                backgroundColor: {
                    base: withOpacity('--color-base'),
                    'off-base': withOpacity('--color-off-base'),
                    primary: withOpacity('--color-primary'),
                    secondary: withOpacity('--color-secondary'),
                    muted: withOpacity('--color-text-muted'),
                },
            // these classes end up like `text-base` and `text-primary`
                textColor: {
                    base: withOpacity('--color-text-base'),
                    muted: withOpacity('--color-text-muted'),
                    'muted-offset': withOpacity('--color-muted-offset'),
                    primary: withOpacity('--color-primary'),
                    secondary: withOpacity('--color-secondary'),
                },
          }
    }
```

Since our utility classes reference CSS variables, their values will respond when we toggle our theme classes. In my example, I only generated utilities for `backgroundColor` and `textColor` specifically. You can generate classes for any applicable properties or generate classes for all color properties using the `theme.extend.colors` key in the config.\
Now using these classes is as simple as this:

```html
<span class="theme-dark bg-base text-primary"> Hello Tailwind Themes! </span>
```

It's also important to apply a theme class by default to ensure correct styling on the initial page load. You can also define your base theme on the CSS `:root` selector and those values will take effect by default, without adding any extra classes.

## Switching Themes on the Fly

Now that we have our classes generated and applied, we can start switching themes! This process just consists of toggling different class names on the document. On my website, I show a list of the different available themes and, when one is clicked, I run something like this:

```javascript
document.documentElement.classList.replace(currentTheme, newTheme)
```

Here, I am replacing the current theme class with whatever the user has selected. I'm doing it on the `documentElement` but you can apply this to wherever you want your top-level theme class to live.

> Note ⚠️: My website uses React, so I track the currentTheme in a piece of state. However, this can be done in several ways in vanilla JavaScript, like a global variable or a data-theme attribute. The important part is that you swap out the current theme for the user's selection.

## Hanging on to a User's Choice

If you've made it this far, congrats! You now have fully functioning themes on your site. But you might notice if you select a theme and refresh the page, you've lost your choice! This is where data persistence comes into play. Don't worry, it can be really simple! Here's a look at how my site does it:

```javascript
function pickTheme(newTheme) {
  if (newTheme === current) return
  document.documentElement.classList.replace(current, newTheme)
  localStorage.setItem('crimTheme', newTheme)
  setCurrent(newTheme)
}
```

This `pickTheme` function is called when a theme choice is selected.\
Let's break it down:

1. return early if they selected the theme that's currently applied to prevent unnecessary work
2. replace the current theme class with the new one
3. save the user's choice in browser local storage
4. update my current theme state (React style)

This is a great start! Now when a user selects a new theme, we get it applied to the DOM and then save it to the browser's local storage.\
There is one more step we have to do before the whole experience works smoothly. Currently, even though our theme choice is in local storage, if we refresh the page we don't see any difference. On page load, we need to check local storage and get the theme applied right away, before the user sees the default theme. Here's what I did:

```javascript
// theme.js
if (localStorage.crimTheme) {
  document.documentElement.classList.add(localStorage.crimTheme)
} else {
  document.documentElement.classList.add('theme-light')
  localStorage.setItem('crimTheme', 'theme-light')
}
```

Not too bad! We first check local storage for our theme and apply it if it exists. If not, we set them up with the default theme. I load this `theme.js` file directly in my `index.html` to ensure it runs early enough to prevent flashes.

## Conclusion 🎉

Big kudos to you if you made it this far. We have accomplished a lot!\
Let's review:

1. We set up our themes with CSS variables
2. We generated custom Tailwind classes to apply our CSS variable values
3. We allowed users to swap themes by updating our theme class in the DOM
4. Finally, we boosted the user experience by saving and retrieving a user's theme preference in local storage

Theming adds a lot of personality to sites and I hope to see more of it in the future. Reach out and show me your themed sites!
