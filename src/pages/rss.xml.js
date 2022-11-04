import rss from '@astrojs/rss'

const glob = import.meta.glob('./blog/*.md', { eager: true })
const posts = Object.values(glob).filter((p) => !p.frontmatter.draft)
export const get = () =>
  rss({
    title: 'austincrim.com',
    description: 'Blogging for the web',
    site: import.meta.env.SITE,
    items: posts.map((p) => ({
      title: p.frontmatter.title,
      description: p.frontmatter.lede,
      pubDate: p.frontmatter.datePublished,
      link: p.url
    })),
    customData: `<language>en-us</language>`
  })
