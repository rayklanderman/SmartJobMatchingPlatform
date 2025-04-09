import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4500,
    strictPort: true,
    host: true,
    open: true,
    hmr: {
      timeout: 5000,
    },
    proxy: {
      '/api/adzuna': {
        target: 'https://api.adzuna.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adzuna/, ''),
      },
    },
  },
  build: {
    sourcemap: true,
  },
  logLevel: 'info',
})
