import { getAllPostProperties, getPostProperties } from './src/lib/notion'
import fs from 'fs/promises'

let posts = await getAllPostProperties()
await fs.mkdir('src/pages/blog/posts', { recursive: true })
for (let p of posts) {
  let post = await getPostProperties(p.slug)
  let frontmatter = `---
title: ${post.title}
lede: ${post.lede}
datePublished: ${post.datePublished}
draft: ${!post.published}
layout: ../../layouts/PostLayout.astro
---
`
  await fs.writeFile(
    `src/pages/blog/posts/${post.slug.toLowerCase()}.md`,
    frontmatter.concat(post.markdown)
  )
}
