import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function get() {
  const posts = await getCollection('posts')
  return rss({
    title: 'austincrim.com',
    description: 'Blogging for the web',
    site: import.meta.env.SITE,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.lede,
      pubDate: p.data.datePublished,
      link: `/posts/${p.slug}`
    })),
    customData: `<language>en-us</language>`
  })
}
