/// <reference types="vitest/config" />
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Nonante',
        short_name: 'Nonante',
        description: 'French verb drill — ten verbs, five tenses, ninety primitives.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0F1216',
        theme_color: '#0F1216',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the whole app shell: HTML, JS (verb data is imported, so it
        // ships inside the bundle), CSS, fonts, icons.
        globPatterns: ['**/*.{js,css,html,png,woff2,svg}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    // Testing Library's automatic per-test cleanup hooks into the global
    // afterEach, which only exists with globals on.
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Feature acceptance suites live beside their specs; src tests stay near code.
    include: [
      'features/*/tests/vitest/**/*.test.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
    ],
  },
})
