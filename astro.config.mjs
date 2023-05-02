import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },
  site: 'https://austincrim.com'
})
