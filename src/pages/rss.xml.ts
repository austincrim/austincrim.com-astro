import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import MarkdownIt from 'markdown-it'
const parser = new MarkdownIt()

export async function GET() {
  const posts = await getCollection('posts', (e) => !e.data.draft)
  return rss({
    title: 'austincrim.com',
    description: 'Blogging for the web',
    site: import.meta.env.SITE,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.lede,
      content: parser.render(p.body),
      pubDate: p.data.datePublished,
      link: `/posts/${p.slug}`,
    })),
    customData: `<language>en-us</language>`,
  })
}
