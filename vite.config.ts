import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['> 0.2%', 'not dead', 'IE 11'],
    })
  ],
  build: {
    target: 'es2015',
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['americanmock.local', 'american-mock.local', 'americanmock.test', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
