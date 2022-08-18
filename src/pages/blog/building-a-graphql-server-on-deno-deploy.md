---
title: Building a GraphQL Server on Deno Deploy
lede: Combining two hot technologies to create a hypestack application
datePublished: 2021-10-05
draft: false
layout: ../../layouts/PostLayout.astro
---

**Prerequisites**

1. [Install Deno](https://deno.land/#installation)
2. [Sign Up for Deno Deploy](https://deno.com/deploy/)
3. [Install ](https://deno.com/deploy/docs/deployctl/)[`deployctl`](https://deno.com/deploy/docs/deployctl/)[ (optional, allows you to run your app locally)](https://deno.com/deploy/docs/deployctl/)
4. Create and clone a GitHub repo to house our project (this is allows us to easily deploy to Deno Deploy)

### Up and running on Deno Deploy

Let's start by creating the simplest Deno Deploy project by creating an `index.js` (or `.ts`) file in our repo and adding a fetch event listener.

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(new Response('hello world!'))
})
```

If you want to run this locally with hot reloading:

```bash
deployctl run --watch index.js
```

To get this deployed:

1. head to [https://deno.com/deploy](https://deno.com/deploy)
2. sign in with github
3. select "Create new project" and choose a name
4. select "Connect to GitHub" near the bottom of the page
5. enter the exact URL **to your** **`index.js`** **file.** e.g `https://github.com/austincrim/simple-deno-gql/blob/main/index.js`

Congrats! If you visit the URL provided on your project page, you should see "hello world".

### Adding GraphQL

Next, let's write a basic GraphQL schema file:

```graphql
"""
schema.gql
"""
type Note {
  id: String
  title: String
  content: String
}

type Query {
  note(id: String): Note
}
```

Now we can bring in `graphql-deno` to parse our schema file. This library is a Deno-compatible port of [GraphQL.js](https://github.com/graphql/graphql-js).

```javascript
import { buildSchema } from "https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts"

const schemaString = await Deno.readTextFile("./schema.gql")
const schema = buildSchema(schemaString)

addEventListener("fetch", (event) => {
  event.respondWith(new Response("hello world"!))
})
```

We do this outside of our event listener to prevent this code from running on every request.

Let's write a resolver that will handle our `Note` type. We can just hardcode something to make it easier on ourselves:

```javascript
import { buildSchema } from 'https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts'

const schemaString = await Deno.readTextFile('./schema.gql')
const schema = buildSchema(schemaString)

const notes = [
  {
    id: '1',
    title: 'Hello deno deploy!',
    content: 'This is an example note'
  },
  {
    id: '2',
    title: 'Hello graphql!',
    content: 'This is a different note'
  }
]
const resolvers = {
  note: ({ id }) => {
    return notes.find((note) => note.id === id)
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(new Response(schemaString))
})
```

Notice that `resolvers.note` matches the name of our `Type`. This tells `graphql-deno` how to resolve a `Note` when we query for it.

We have everything setup now. Let's put it all together!

We will handle the common case of a `POST` request with a JSON body, specifically with a `query` property that contains our GraphQL query. You can read more about spec-compliant GraphQL over HTTP [here](https://graphql.org/learn/serving-over-http/).

```javascript
import {
  buildSchema,
  graphql
} from 'https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts'

// setup code...

addEventListener('fetch', async (event) => {
  const { query } = await event.request.json()
  const result = await graphql(schema, query, resolvers)

  event.respondWith(new Response(JSON.stringify(result)))
})
```

Finally, we can send a query and hopefully get a response! You can use whatever HTTP client you like (I use Insomnia) to issue a `POST` request to our server with this request body.

```json
{
  "query": "{ note(id: \"1\") { title content } }"
}
```

Once you commit and push these changes to your GitHub repo, Deno Deploy should automatically deploy it to your project URL and you can test it live.

Here's the full code:

```javascript
import {
  buildSchema,
  graphql
} from 'https://raw.githubusercontent.com/adelsz/graphql-deno/v15.0.0/mod.ts'

const schemaString = await Deno.readTextFile('./schema.gql')
const schema = buildSchema(schemaString)

const notes = [
  {
    id: '1',
    title: 'Hello deno!',
    content: 'This is an example note'
  },
  {
    id: '2',
    title: 'Hello graphql!',
    content: 'This is a different note'
  }
]
const resolvers = {
  note: ({ id }) => {
    return notes.find((note) => note.id === id)
  }
}

addEventListener('fetch', async (event) => {
  const { query } = await event.request.json()
  const result = await graphql(schema, query, resolvers)

  event.respondWith(new Response(JSON.stringify(result)))
})
```

Congrats! You can now write a GraphQL server in Deno. Bask in your new hypestack.
