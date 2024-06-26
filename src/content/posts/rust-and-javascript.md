---
title: "Rust + JavaScript: a Love Story"
lede: Learn how to run Rust functions from your JavaScript code using the new hotness, WASM
datePublished: 2021-12-11
draft: false
---

## What's Wasm?

WebAssembly (WASM for short) is a "binary instruction format" that can run natively in your browser, making it just the fourth language to claim that title, joining HTML, CSS, and JavaScript.

However, WASM is not something that most of us will want to write by hand; that's why it was intended as a compilation target for other programming languages. The goal is to write in your favorite compiled language and then output a `.wasm` module that can be directly executed in the browser (or Deno and Node!).

This is a pretty big deal!

WebAssembly modules are often used for cross-platform mobility or to off-load intensive computations away from JavaScript to a better-suited language.

Let's write and run our first WebAssembly module using Rust and [`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/introduction.html).

## Prerequisites

1. Install Rust and Cargo

   - **For macOS, Linux**

     ```bash
     curl --proto '=https' --tlsv1.2 -sSf <https://sh.rustup.rs> | sh
     ```

   - **For Windows**

     [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe)

2. Install `wasm-pack`

   ```bash
   cargo install wasm-pack
   ```

## Scaffolding a Project Using Cargo

After ensuring you have Rust, Cargo, and `wasm-pack` installed, let's create a new Rust project with Cargo.

```bash
cargo new --lib hello-wasm
```

This command scaffolds a new Rust library in the `hello-wasm` directory. Cargo provides us with a `src/lib.rs` file and a `Cargo.toml` (think `package.json` equivalent). `lib.rs` will contain a boilerplate Rust unit test, we can go ahead and delete everything in this file.

## Using `wasm-bindgen` and `wasm-pack` to Compile Rust Functions to WASM

Next, let's get our `Cargo.toml` set up.

```toml
[package]
name = "hello-wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

We need to add two things here: the `[lib]` section and the `wasm-bindgen` dependency.

The `[lib].crate-type` directive helps tip off Cargo that we might be building for a WASM target and helps it pass the correct flags when we do so.

You will see where we use `wasm-bindgen` in a second, but it's a key library that enables the translation between Rust types and JavaScript types, among other things. You can read more about the specifics in [their docs](https://rustwasm.github.io/wasm-bindgen/).

With our `Cargo.toml` in order, let's open up `src/lib.rs` and write some Rust code.

Using the `wasm-bindgen` attribute, we will write an `add` function that simply returns the sum of two integers.

```rust
// lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

Now that our Rust code is in place, we will use `wasm-pack` to compile our Rust into consumable WASM.

```bash
wasm-pack build --target web
```

You should see a new `pkg` directory with our `.wasm` module, a `.js` wrapper, and some other sundry files. Feel free to poke around to satisfy any curiosities.

With our built artifacts, we are ready to run WASM from the browser!

## Importing and Calling WASM Functions from JavaScript

In the same `hello-wasm` directory, create a humble `index.html` and add an inline `<script type="module">` in the `<head>`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello Wasm!</title>
    <script type="module"></script>
  </head>
  <body></body>
</html>
```

Next, we can import both the default export (I call it `init`) and our `add` function from the light JavaScript wrapper that was generated by `wasm-pack`. `wasm-pack` automatically adds a default export that is essentially glue code to load and instantiate our WASM module.

**It's critical that you call this default export before using the** **`add`** **function.**

Then, we can call our `add` function and log the result.

> wasm-pack generates .d.ts files by default. Depending on your tooling setup, this gives you autocomplete and type checking for our WASM functions 🤯.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello Wasm!</title>
    <script type="module">
      import init, { add } from "./pkg/hello_wasm.js"

      await init() // this loads and instantiates our WASM module
      console.log(add(1, 2)) // this calls our compiled Rust function!
    </script>
  </head>
  <body></body>
</html>
```

Now, run `python3 -m http.server` in this directory, load up `localhost:8000`, and pop open the developer tools.

If you see `3` in the console. we have had great success!

> Serving index.html with a relatively modern HTTP server is crucial for loading our WASM module because the application/wasm MIME type must be supported. Opening our page from the file system will not work. If you have trouble with the Python server, check here or use an alternative server that you are comfortable with.

## What Now?

WebAssembly opens up a new horizon of opportunities for web applications and you now have the super power of knowing how to use it!

To learn more about WASM, `wasm-pack`, and Rust, check out these resources:

- [**Rust docs**](https://www.rust-lang.org/)
- [**WebAssembly**](https://webassembly.org/)
- [**`wasm-pack`**](https://rustwasm.github.io/docs/wasm-pack/)

See the final source code [here](https://github.com/austincrim/hello-wasm).

If you have any questions or issues, feel free to reach out on my [Twitter](https://twitter.com/crim_codes).
