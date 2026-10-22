import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(root, 'src/index.js'),
      name: 'CubanCardsReact',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'es' ? 'cuban-cards-react.js' : 'cuban-cards-react.umd.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
  },
})
