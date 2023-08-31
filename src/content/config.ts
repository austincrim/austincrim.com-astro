import { z, defineCollection } from 'astro:content'
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    datePublished: z.date(),
    lede: z.string(),
    draft: z.boolean(),
  }),
})
const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sourceUrl: z.string().url().optional(),
    projectUrl: z.string().url().optional(),
    type: z.enum(['oss', 'content']),
    order: z.number(),
  }),
})
// Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
}
