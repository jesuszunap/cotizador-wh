import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-36.png', 'icon-256.png', 'icon-512.png'],
      manifest: {
        name: 'Cotizador WH',
        short_name: 'Cotizador WH',
        description: 'Calculadora de comisiones para envíos rápidos y offline',
        theme_color: '#6D28D9',
        background_color: '#0B0B0F',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icon-36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: 'icon-256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
