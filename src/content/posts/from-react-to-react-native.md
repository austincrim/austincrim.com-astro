---
title: 'From React to React Native: a journal'
lede: Ongoing tips, lessons, and frustrations from a web guy taking on native development
datePublished: 2024-05-22
draft: false
---

## Why?

In January of 2024, I started a new, old job at Principal Financial Group. I worked there previously on web (and COBOL) stuff but in my return I joined the mobile app team. I have used React extensively without ever touching React Native. Now, I'm learning and cursing constantly, so I decided to write some stuff down here.

## React is incredible

In the span of a week, I developed features for a native app that runs on iOS and Android, debugged a web dashboard, and created a custom [Raycast](https://raycast.com) extension.

I used React every single time.

"Write once, run everywhere" is a cliche at this point, and I have plenty of gripes with React, but the power of React is proven every day with stories like this. `useState` is the same everywhere and that's more valuable to me now than ever, as any commonality with my web background empowers me in my new role today.

## The native toolchain <s>sucks</s> is hard</h2>

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
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

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
    <Pressable onPress={() => navigation.navigate('Search')}>
      <Text>Go to Search</Text>
    </Pressable>
  )
}
```

It's pretty straightforward; even familiar if you've used versions React Router. But it can get hard to follow because navigators can be deeply nested anywhere in the React tree if it's a child of `<NavigationContainer>`.

Even different navigation paradigms like tabs and drawers can be found defined almost anywhere in your app, which can be convenient for code co-location but it can be a total mess for discoverability.

<h3 id='deep-links'>Deep links</h3>

The URL does kind of exist in mobile apps in the form of **deep links**. Using a custom URL scheme like `myapp://home`, you can assign URLs to screen names in React Navigation. You can then navigate directly to screens using URLs, even including path and query parameters. Deep links are also used to open your app from an external source like a website or a push notification. They can send you **deep** into your app with specific state already set; like how tapping on an Uber notification could open your current trip details directly.

<!-- ## What about CSS? -->

<!-- ## Apps are SPAs -->

<!-- ## So, how does this actually work? -->
