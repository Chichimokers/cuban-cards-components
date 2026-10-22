import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    assetsDir: '',
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(root, 'src/index.js'),
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'cuban-cards-vue.js' : 'cuban-cards-vue.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue'],
    },
    sourcemap: true,
  },
})
