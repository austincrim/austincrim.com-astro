import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },
  site: 'https://austincrim.com'
})
