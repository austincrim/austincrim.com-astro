---
title: 'COBOL’in 🏀: What a 60 year old language taught me about JavaScript'
lede: How my experience as a mainframe developer shapes my JavaScript code
datePublished: 2021-06-01
draft: false
layout: ../../layouts/PostLayout.astro
---

Hey, I'm Austin, and I started my career a few years ago as a 20-year-old COBOL developer.

I can already hear the questions:

> Why would you subject yourself to that? Why not something relevant? What the heck is COBOL?

COmmon Business Oriented Language is a programming language that showed up in the late 1950s. It saw widespread adoption throughout many large companies and was usually employed for large-scale batch processing. Although it's over 60 years old, it is [surprisingly common today](https://www.zdnet.com/article/cobol-turns-60-why-it-will-outlive-us-all/). More recently, it got some [time in the news](https://www.wired.com/story/cant-file-unemployment-dont-blame-cobol) when the governor of New Jersey made a public plea for COBOL developers to rescue the state unemployment system.

My COBOL story starts with my father who, after I finished high school, advised me to look into learning COBOL. He was a mainframe developer at a large university for almost the entirety of his career and with many of his contemporaries retiring, he knew that the amount of COBOL code still running would need maintainers with a specific set of skills (insert Liam Neeson gif). Unfortunately, I had to admit he was right. I landed a job as a mainframe engineer after just 18 months in school and started my career path in 2018 using technology from the 1950s.

I only spent a couple of years in that role before I transitioned to a team using a more modern stack and even though I now use things like React and Node every day, I have carried over some of the lessons I learned on the green screens.

Let's take a look at 3 ways that writing COBOL has made me a better web developer.

## Requiring Readability 📚

COBOL was designed to be readable by default. Its syntax is intentionally English-like in nature, with statements ending in periods and grouped by 'paragraphs'. Here's an example:

```cobol
MOVE 5 TO NUM.
ADD 10 TO NUM.
PERFORM UNTIL NUM LESS THAN 10
  DISPLAY NUM
  SUBTRACT 1 FROM NUM
END PERFORM.
```

While admittedly verbose, it's also free of arcane symbols or abbreviations. Its verbosity is a side effect of its explicitness. Now, I'm not going to say that programming languages need to be designed this way in order to be readable, in fact, even COBOL can't _enforce_ readable code, it can only encourage it. But this general notion of readability as a first-class idea leads me to my first point: **prioritizing readability pays off**.

We do a lot in the developer world in the name of readability. Everything from syntax highlighting and code formatters to abstractions like classes and functions improves our ability to quickly scan and reason about our code. So much time is spent in this realm because we have realized that **readability leads to maintainability**. Code that's hard to read is hard to understand, if it's hard to understand, it's hard to fix bugs and add features.

Here are some quick hitters on how to improve the readability of your code:

1. In general, avoid abbreviations when naming things. They oftn mk ur cod hrdr to read :).
2. Make purity and immutability the default. Functions that reach outside their scope and variables that unexpectedly change are common sources of confusion in codebases. Do your best to avoid these techniques when practical.
3. Keep functions small, without being dogmatic. It stands to reason that less code is easier to read than more code. Extracting another function costs very little, but can make a big difference in the long run. See more in the next section 👀.

One caveat that should go without saying, there are scenarios where you have to choose something like performance over readability, but when I write code I first ask myself "Is this readable?" before I try to optimize for anything else.

## Function Focused 🧐

COBOL has no scope. If you declare a variable, it is for all intents and purposes, global, even if COBOL'ers wouldn't use that word. COBOL also doesn't have functions. It is _procedural_, not functional or object-oriented ([sorta](https://www.ibm.com/docs/en/cobol-zos/4.2?topic=programs-writing-object-oriented)).\
A COBOL program is essentially a long list of instructions that get processed in a sequence. The way we organize these instructions in COBOL is with _paragraphs_. A paragraph is a named grouping of instructions, like this:

```cobol
COMPUTE-TOTAL.
    MULTIPLY TAX-RATE BY SUBTOTAL GIVING TAX.
    ADD SUBTOTAL TO TAX GIVING TOTAL.
    SUBTRACT DISCOUNT FROM TOTAL.
```

With our paragraph defined, we can then execute it whenever we want with the `PERFORM` keyword.

```cobol
PERFORM COMPUTE-TOTAL.
```

Since COBOL has no scope and no functions, it quickly becomes apparent that the frequent use of paragraphs is imperative to maintaining a halfway-decent codebase. Many teams even develop style guides with rules like:

- All code must be in a paragraph
- Paragraphs must be named clearly
- Paragraphs should have one primary responsibility

If these ideas around paragraphs sound familiar it's because many JavaScript developers talk similarly about _functions_.

Functional programming in JavaScript has become somewhat in vogue as of late and for good reason! If you're like me, you might have thought you hated programming when you were in Java class and got yet another `NullPointerException` trying to write a tip calculator. But pure functions offer a much clearer mental model: dump values in, get values out, consistently.\
Small, pure functions are the easiest to test, read, and maintain, so why not try to build your whole codebase out of such functions? Even COBOL, without the first-class notion of a function, understood code that can be grouped and reused is paramount to building applications for the long haul.

## Talking Testing 🧪

Up to this point, my comments on COBOL have been mostly positive, but that's about to change. The biggest hurdle in my time as a mainframe dev was _testing my code_. By their very nature, most COBOL codebases are supporting old, long-running processes and applications. They are often products of many different developers making changes over decades and, due to the lack of tooling, the resulting code is not easy to test. Impact analysis and unit testing were by far the most time-consuming tasks in any feature request or bugfix. There is rarely a path forward on how to execute your program under certain conditions or identifying what parts of the codebase your change might negatively affect.

Again, I mainly attribute this to the lack of sophisticated tooling and it brings me to my final point, _automated testing in JavaScript is a gift_.

To the chagrin of some, the JavaScript ecosystem has an embarrassment of riches when it comes to choice. There is an NPM package for checking if a number is even, for goodness sakes. Search NPM for "testing" and you get back 14,534 results. The point is you can write tests in just about any way imaginable; the barrier to entry has never been lower. Having an automated test suite in place skyrockets developers' confidence, encourages frequent refactors, and can singlehandedly change the future of a given application.\
There are umpteen resources out there telling you why testing is important, so I will stop preaching here, but I will offer up a couple thoughts on getting started.

1. Focus on the highest value, lowest friction tests first. End-to-end web tests using something like Cypress is a great way to ensure the main functionality of your app is working before you get to production.
2. Run tests automatically and frequently. Whether in continuous integration or a git hook, make sure your feedback loop is short and you get informed of test failures at the right times.
3. Kent C. Dodds puts it best: "The more your tests resemble the way your software is used, the more confidence they can give you."

## Closing Comments 🚪

When COBOL was released in the 1950s, programmers wanted to write resilient applications that solved problems and while our tools have changed dramatically, I would argue our goals mostly remain the same. Frameworks and languages come and go at a breakneck speed, but if we can glean principles from those who came before us, our knowledge will stand the erosion of time, not unlike a lot of COBOL code still running today.

Thanks for your time.
