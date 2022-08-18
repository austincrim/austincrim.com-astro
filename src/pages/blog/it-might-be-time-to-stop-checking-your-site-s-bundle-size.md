---
title: It Might Be Time to Stop Checking Your Site's Bundle Size
lede: Taking a look at when performance might not matter
datePublished: 2021-08-13
draft: false
layout: ../../layouts/PostLayout.astro
---

Now that you are here ready to berate me for the irresponsible advice in my title, first, my site does not have comments, so joke's on you, and second, I think you will find the thrust of the article less inflammatory than my clickbait-adjacent title might have led you to believe.

So put down your virtual pitchforks, read to the end, and then send me your scathing critiques if you still feel they are necessary.

## Caveats

Web performance is a critical part of making content broadly accessible, especially to those in under-served areas with low bandwidth or limited internet access. I think, in general, the ecosystem has not emphasized progressive enhancement enough and has funneled us towards shipping [bloated JavaScript bundles](https://twitter.com/n_moore/status/1415067187446960129?s=20) to sites that often do not need any JavaScript at all.

There has been no shortage of ink spilled on this problem but my article is not about that.

I want to talk about **shipping stuff**.

## A Story

My most recent public project, [Perusing the Platform,](https://perusingtheplatform.com) started with humble enough origins. I happened upon the Mozilla Developer Network documentation about the Web Notification API and, eventually, found their page listing every native Web API available. I was blown away at all the goodies tucked away under the `window` and `navigator` objects; notifications, audio processing, file system access, window-to-window communication, the list went on. Wow! I could learn this stuff and create a resource to help others discover it: the birth of a new side project.

But soon after, the associated new project dread set in.

What tech stack should I choose?

What will it be named?

How will I design it?

CSS strategy?

Hosting provider?

Content management system?

Not to mention: how will it perform?

You get the idea.

I knew I could build something rather quickly using Next.js but I had just read a tweet about how it ships big JavaScript bundles to totally static pages. That sounds bad! What if my project hits the big time and I get Twitter-shamed for my kilobyte count?

These questions can be paralyzing and they led me to postpone my exciting new project idea for several weeks. I even finished building a prototype (complete with my first article) and ended up scrapping it, in part because of (web) performance anxiety.

## On Shipping

I'm happy to say that I did eventually push "deploy" on Perusing the Platform and, while it is in its infancy, I'm proud of what I have accomplished so far and I look forward pouring in more content, but the above story serves to illustrate a greater point: **putting something out into the public is scary**. There are already enough considerations when creating something without the threatening stocks of internet humiliation and the many, all-to-willing tomato-throwers.

When the [Agile methodology](https://en.wikipedia.org/wiki/Agile_software_development) of software development came along and disrupted the industry (for better or worse), it popularized the concept of iteration and early feedback being more desirable than meticulous, up-front planning. While this has been easy for me to contextualize with "feature work", I seem to forget this principle as it relates to things like performance, accessibility, and even content like this blog post. These things can be iterated on just like "regular", everyday feature work! It can be tempting to view performance in a "waterfall planning" mode, where you want to get everything right once and then check the "performance" box of you to-do list, but this is impractical. There's an old adage: _software is never finished_, and it stands to reason that the parts of a specific piece of software will also be in constant flux.

So, performance is iterative in nature, but it's also _contextual_. The performance requirements of a federal government website are different than those of your 11th to-do list side project that only you will see. If I'm making a photo album web app for my mom down the street who has a gigabit connection and the latest iPhone, I should not be sweating over kilobytes and network requests. Still, the requirements of your app and the needs of your user base can only be fully known if you _actually ship something_.

In closing, here is my request: don't be afraid to send out your buggy, slow code. Put it out there in all of its bloated, un-optimized glory.

By all means, iterate, improve, and make your stuff broadly accessible when the time comes, but a shipped project with a 5mb bundle is infinitely more valuable than a potentially golden idea relegated to the side project graveyard.
