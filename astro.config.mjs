import { defineConfig } from "astro/config"
import svelte from "@astrojs/svelte"
import tailwind from "@astrojs/tailwind"
import markdoc from "@astrojs/markdoc"

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind(), markdoc()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "night-owl"
      }
    }
  },
  devToolbar: {
    enabled: false
  },
  site: "https://austincrim.com"
})
