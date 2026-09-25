import { resolve } from 'node:path'
import { cloudflare } from '@cloudflare/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// `vite` runs the pages and the Worker (with a local D1) together; `vite build` outputs both to dist/.
export default defineConfig({
  plugins: [vue(), cloudflare()],
  environments: {
    // Two pages; the Worker environment keeps its own entry from wrangler.jsonc.
    client: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(import.meta.dirname, 'index.html'),
            stats: resolve(import.meta.dirname, 'stats.html'),
          },
        },
      },
    },
  },
})
