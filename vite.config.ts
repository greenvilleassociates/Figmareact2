import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Allow access from LAN + disable strict host checking
  server: {
    host: true,              // allows access from network (0.0.0.0)
    port: 443,              // or any port you want
    strictPort: false,
    cors: {
      origin: '*',           // allow all origins
      methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Proxy to avoid CORS entirely during development
    proxy: {
      '/api': {
        target: 'http://localhost:4173', // your backend
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
    },
  },

  optimizeDeps: {
    exclude: ['figma:asset'],
  },

  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'resolve-figma-assets',
          resolveId(source) {
            if (source.startsWith('figma:asset/')) {
              const file = source.replace('figma:asset/', '')
              return path.resolve(__dirname, `./src/assets/${file}`)
            }
            return null
          }
        }
      ]
    }
  }
})

