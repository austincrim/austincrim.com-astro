---
title: Yet Another Portfolio Redesign
lede: Web developers love to change their website, right? Describing my motivation and goals behind the latest iteration of
datePublished: 2021-03-04
draft: false
---

Just give me the links!
[Old Portfolio](https://next-personal-site-4yvzrssbq.vercel.app/)
[New Portfolio](https://austincrim.com/)
[Source](https://github.com/austincrim/next-personal-site)

## My Website

Like any web developer, I love reworking and tweaking my personal website. I use it as a place to experiment, practice my design skills, and just have fun. This is the fourth iteration of my site and definitely my favorite so far. My site is relatively simple, just a home page and a blog page. It's built on Next.js and TailwindCSS and reads blog posts from Markdown files at build time.

## Redesign Goals

I began to grow tired of my previous design choices and decided my page needed a refresh. I had a few goals:

- Simplify the home page
- Dark mode
- Use a more muted color palette
- Introduce subtle, tasteful animations

By the time I finished, I think I checked every box! I once read that "great design doesn't ask what it can add, but what it can take away" and I kept this in mind throughout development. I wanted to remove extraneous details and increase negative space, while including all relevant information in an easily digestible way.

## Dark Mode 🌙

Adding dark mode has been something on my todo list for a long time, it's trendy, looks great, and provides a fun development challenge. In my implementation, I wanted to ensure that I respected OS level dark mode settings while allowing a user's choice to persist. I do something like this on page load to check for user preference from local storage or the os:

```javascript
    if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
```

This works because I'm using the class version of dark mode in TailwindCSS, so Tailwind will look for the `dark` class in my markup and then apply the correct classes.

## Summary

It's always fun to look back at your previous work just to see how far you have come. It helps validate all the hard work you put in and helps motivate you to keep grinding 💪. Let me know what you like about it or what you would change! See you again next year for another redesign.
