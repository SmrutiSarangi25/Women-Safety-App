import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    globals: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          maps: ['leaflet', 'react-leaflet', 'leaflet-geosearch'],
          ui: ['lucide-react', 'react-icons', 'react-toastify'],
          auth: ['@react-oauth/google'],
          network: ['axios']
        }
      }
    }
  }
})
