import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@cuban-cards/vue/style.css': resolve(
        root,
        '../../packages/core/src/styles.css',
      ),
      '@cuban-cards/vue': resolve(root, '../../packages/vue/src/index.js'),
    },
  },
})
