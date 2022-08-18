---
title: 'JavaScript Dev Does Rust: Statements, expressions, and return values'
lede: I have started to dip my toes into Rust-land and I will be jotting down some of my aha’s and gotchas, like this example!
datePublished: 2021-07-06
draft: false
layout: ../../layouts/PostLayout.astro
---

In Rust, a **statement** is a piece of code that does not return a value and always ends with a semicolon

```rust
let x = 12;

println!("x is {}", x);
```

An **expression** is code that evaluates to something. Most Rust code contains expressions.

```rust
let y = 2 + 2;  // 2 + 2 is an expression within a statement

do_something()  // do_something() is an expression the returns a value
```

This distinction is important, especially when reading functions. It might not be obvious what this function is returning at first glance. A function's return value can be the last expression evaluated by body of the function.

```rust
fn sum_and_double(x: i32, y: i32) -> i32 {
	let summed = x + y;
	summed * 2  // since this is the last expression, it is implicitly returned
}
```

`summed * 2` is the last expression so it evaluates and returns from the function. This would break if we added a semicolon because that would turn the line into a statement.

This code would result in a compiler error for mismatched types because we are not returning an `i32`, we are returning nothing!

```rust
fn sum_and_double(x: i32, y: i32) -> i32 {
	let summed = x + y;
	summed * 2;  // this is now a statement and nothing gets returned from the function!
}
```

You can explicitly use the `return` keyword in functions, which is required for returning early, but the implicit return is a de facto standard and you will see it everywhere.

Pay attention to the semicolons!
