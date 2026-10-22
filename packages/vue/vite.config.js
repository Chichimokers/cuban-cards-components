import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(root, 'src/index.js'),
      name: 'CubanCardsVue',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'es' ? 'cuban-cards-vue.js' : 'cuban-cards-vue.umd.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
  },
})
