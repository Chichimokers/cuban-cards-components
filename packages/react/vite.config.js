import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    assetsDir: '',
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(root, 'src/index.js'),
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'cuban-cards-react.js' : 'cuban-cards-react.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    sourcemap: true,
  },
})
