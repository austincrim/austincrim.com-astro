---
title: "From React to React Native: a journal"
lede: Ongoing tips, lessons, and frustrations from a web guy taking on native development
datePublished: 2024-10-28
draft: false
---

## Why?

In January of 2024, I started a new, old job at Principal Financial Group. I worked there previously on web (and COBOL) stuff but in my return I joined the mobile app team. I have used React extensively without ever touching React Native. Now, I'm learning and cursing constantly, so I decided to write some stuff down here.

## React is incredible

In the span of a week, I developed features for a native app that runs on iOS and Android, debugged a web dashboard, and created a custom [Raycast](https://raycast.com) extension.

I used React every single time.

"Write once, run everywhere" is a cliche at this point, and I have plenty of gripes with React, but the power of React is proven every day with stories like this. `useState` is the same everywhere and that's more valuable to me now than ever, as any commonality with my web background empowers me in my new role today.

## The native toolchain is hard

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

It's honestly impressive that it usually works so well, but working on a large, brownfield app can feel like a Rube-Goldberg machine in the worst ways.

Make sure you have an alias for `rm -rf node_modules ios/Pods && npm i && cd ios && pod install`.

## Wait, where's the URL?

Mobile apps don't have a URL...[sort of](#deep-links). Most navigation is done using the **stack** concept where navigating to a screen pushes it on top of the navigation stack and swiping back or pressing the back button will remove it, similar to how the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) works on the web.

Stacks are defined using React components:

_[React Navigation](https://reactnavigation.org/) is the defacto standard for routing._

```tsx
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

let Stack = createNativeStackNavigator()
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

And you can navigate between screens using the `navigation` prop that is automatically passed into screen components by React Navigation:

```tsx
// navigation is passed into every screen component
function Home({ navigation }) {
  return (
    <Pressable onPress={() => navigation.navigate("Search")}>
      <Text>Go to Search</Text>
    </Pressable>
  )
}
```

It's pretty straightforward; even familiar if you've used versions React Router. But it can get hard to follow because navigators can be deeply nested anywhere in the React tree if it's a child of `<NavigationContainer>`.

Even different navigation paradigms like tabs and drawers can be found defined almost anywhere in your app, which can be convenient for code co-location but it can be a total mess for discoverability.

### Deep links

The URL does kind of exist in mobile apps in the form of **deep links**. Using a custom URL scheme like `myapp://home`, you can assign URLs to screen names in React Navigation. You can then navigate directly to screens using URLs, even including path and query parameters. Deep links are also used to open your app from an external source like a website or a push notification. They can send you **deep** into your app with specific state already set; like how tapping on an Uber notification could open your current trip details directly.

## Why do I always have to import stuff?

React Native components don't render to the DOM, they use native platform views instead of HTML. You have `<Text>` instead of `<p>`, `<View>` instead of `<div>`, and so on. You have to use Capital Letter components which you import from the `react-native` package. This feels like a weird friction point that could be easily solved by some build tooling (Babel and Metro are already required for React Native), much like how the new JSX transform allows you to write JSX without adding `import React from 'react'` everywhere. I don't know, maybe a minor gripe, but it consistently bothers me.

## What about CSS?

Like I mentioned above, React Native uses native views. This is one of its main selling points, but that also means HTML and CSS are out the window. The styling system used by RN tries to feel like CSS in that it uses a lot of the same property names and has similar concepts, but it's like the upside down version of CSS, namely there is no concept of the cascade. Styles must be explicity set wherever you want them to take effect. Here's what it looks like:

```tsx
function MyApp() {
  return (
    <View style={{ padding: 8, flex: 1, color: "blue" }}>
      <Text style={{ fontSize: 20 }}>This text will be black</Text>
      <Text style={{ color: "red", fontSize: 20 }}>This text will be red</Text>
    </View>
  )
}
```

You can also use the `StyleSheet.create` function from React Native, but it doesn't do anything special besides provide type information and some level of organization.

```tsx
import { StyleSheet } from "react-native"

function MyApp() {
  return (
    <View style={styles.myView}>
      <Text style={styles.myText}>Hello world</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  myView: {
    padding: 8,
    flex: 1
  },
  myText: {
    color: "red",
    fontSize: 20
  }
})
```

Since the cascade doesn't exist, it's very common to quickly feel the need to define wrapper components that only provide styling. Stuff like headings, paragraphs, buttons, and inputs will almost always get wrapped to enforce styling consistency. This feels ok to me, especially since components are React's whole thing, but there are times where you miss the great power and responsibility of the cascade.

<!-- ## Apps are SPAs -->

<!-- ## So, how does it actually work? -->

<!-- ## The web's distribution is undefeated -->
