---
title: 'From React to React Native: a journal'
lede: Ongoing tips, lessons, and frustrations from a web guy taking on native development
datePublished: 2024-05-22
draft: false
---

## Why?

In January of 2024, I started a new, old job at Principal Financial Group. I worked there previously on web (and COBOL) stuff but in my return I joined the mobile app team. I have used React extensively without ever touching React Native. Now, I'm learning and cursing constantly, so I decided to write some stuff down here..

## React is incredible

In the span of a week, I developed features for a native app that runs on iOS and Android, debugged a web dashboard, and created a custom [Raycast](https://raycast.com) extension.

I used React every single time.

"Write once, run everywhere" is a cliche at this point, and I have plenty of gripes with React, but the power of the React model is proven every day with stories like this. `useState` is the same everywhere and that's more valuable to me now than ever, as any commonality with my web background empowers me in my new role today.

## The native toolchain <s>sucks</s> is hard

If you thought npm dependency hell was bad, React Native is truly the 7th circle.

It's an incredible technology, but at any given point you could see:

- JavaScript
- Swift
- Objective-C
- Java
- Kotlin
- Ruby
- Maven
- Cocoapods

It's honestly impressive that the happy path works as well as it does, but working on a large, brownfield app can feel like a Rube-Goldberg machine in the worst ways.

Make sure you have an alias for `rm -rf node_modules ios/Pods && npm i && cd ios && pod install`.
