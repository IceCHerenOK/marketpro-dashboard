import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src/frontend',
  base: './',
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend'),
      '@/components': path.resolve(__dirname, './src/frontend/components'),
      '@/pages': path.resolve(__dirname, './src/frontend/pages'),
      '@/utils': path.resolve(__dirname, './src/frontend/utils'),
      '@/types': path.resolve(__dirname, './src/frontend/types')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})