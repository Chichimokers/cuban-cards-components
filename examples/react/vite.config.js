import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@cuban-cards/react/style.css': resolve(
        root,
        '../../packages/core/src/styles.css',
      ),
      '@cuban-cards/react': resolve(
        root,
        '../../packages/react/src/index.js',
      ),
    },
  },
})
