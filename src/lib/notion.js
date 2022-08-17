import 'dotenv/config'
import { Client } from '@notionhq/client'
// import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionToMarkdown } from 'notion-to-md'
import { marked } from 'marked'
import hl from 'highlight.js'

marked.setOptions({
  highlight: (code, lang) => {
    try {
      return hl.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch (e) {
      return code
    }
  }
})

// export type PostProperties = {
//   title: string
//   lede: string
//   slug: string
//   published: boolean
//   datePublished: string
// }

let notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-02-22'
})
let n2m = new NotionToMarkdown({ notionClient: notion })

export async function getAllPostProperties() {
  let result = await notion.databases.query({
    database_id: process.env.NOTION_POSTS_DB_ID,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true
      }
    },
    sorts: [{ direction: 'descending', property: 'Date Published' }]
  })
  return parseDatabaseProperties(result)
}

/** @returns {Promise<{published: boolean, datePublished: string, lede: string, title: string, slug: string, html: string}>} */
export async function getPostProperties(slug) {
  let result = await notion.databases.query({
    database_id: process.env.NOTION_POSTS_DB_ID,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    }
  })
  let [parsed] = parseDatabaseProperties(result)
  let markdown = await getPostMarkdown(result.results[0].id)

  let html = marked.parse(markdown)

  parsed = { ...parsed, html }
  return parsed
}

export async function getPostMarkdown(pageId) {
  let blocks = await n2m.pageToMarkdown(pageId)
  return n2m.toMarkdownString(blocks)
}
/** @returns {{published: boolean, datePublished: string, lede: string, title: string, slug: string}[]} */
function parseDatabaseProperties(database) {
  let postProperties = []
  for (const [, value] of Object.entries(database.results)) {
    let properties = {}
    for (const [k, v] of Object.entries(value.properties)) {
      if (k === 'Published') {
        properties.published = v.checkbox
      } else if (k === 'Date Published') {
        properties.datePublished = v.date.start
      } else if (k === 'Lede') {
        properties.lede = v.rich_text[0].plain_text
      } else if (k === 'Title') {
        properties.title = v.title[0].plain_text
      } else if (k === 'Slug') {
        properties.slug = v.formula.string
      }
    }

    postProperties.push(properties)
  }
  return postProperties
}
