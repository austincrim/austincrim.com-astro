---
title: 'Building Notarize 📓: a simple note-taking experience'
lede: The process of building a note-taking app and my first experience with implementing authentication
datePublished: 2021-01-31
draft: false
layout: ../../layouts/PostLayout.astro
---

### What I Built

[Notarize](https://notarize-react.vercel.app/) is simplistic take on a Markdown note taking app. It allows you to login with GitHub and immediately start taking notes. Notarize supports Markdown, basic search functionality, and note downloading, all through a simple UI that strives to blend in while you focus on writing.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1612320848869/b2FSFLThc.png)

### Why I Built It

A note taking app intrigued me for a couple of reasons. First, I knew it was an attainable goal in the short time I had to develop. I aimed to keep the UI and functionality basic, to ensure I ended up with a finished product with a fair amount of polish. Secondly, note taking apps are practical! I always find myself needed to jot things down quickly and I wanted a minimal app that could be there for me when I needed it. Lastly, I wanted to pick a project where I had to implement authentication. I have never implemented an authentication flow on my own and I felt it was time for that challenge.

### What Tools I Used

Notarize is a Next.js application hosted on Vercel. I used [react-query](https://react-query.tanstack.com/) for data fetching, which is an incredible tool that simplifies caching server-side state in your React app. I took advantage of [Prisma](https://www.prisma.io/) and [Postgres on Heroku](https://www.heroku.com/postgres) for data persistence, tied in with [Next-Auth](https://next-auth.js.org/) for the GitHub login flow. All styling was handled by my trusty friend, [TailwindCSS](https://tailwindcss.com/). Overall, I immensely enjoyed working in this stack. The combination of react-query, Next.js API routes, and Prisma made data persistence and caching a piece of cake and, thanks to TypeScript, I had the convenience of type checking up and down the stack. One challenge I faced was authentication. Having never tackled it on my own, to say I was intimidated is an understatement. Thankfully, Next-Auth helped make my first experience less painful. Its API is simple and the docs are fairly straightforward, and, as an added bonus, it integrates nicely with Prisma for handling users and sessions.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1612322376782/dWmivfbLw.gif)

### The Future

During the development of Notarize, I started compiling a list of future features that I would love to implement! Here's just a few that are on my roadmap:

- Improved Markdown editor
- Fall back to local storage when network is not available
- Optimistic UI updates
- Dark Mode 🌗

### Wrapping Up

All told, I had an absolute blast during the Vercel/Hashnode Hackathon. It was a great chance to flex my dev muscles and learn some new skills. Big shout out to Vercel and Hashnode for putting it on!

### Usage Note

Your GitHub account must have a publicly accessible email for the app to work correctly. Go to Github -> Settings -> Select a public email. I hope to fix this in the near future.
