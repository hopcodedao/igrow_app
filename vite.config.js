import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3}']
      },
      manifest: {
        name: 'iGrow Platform',
        short_name: 'iGrow',
        description: 'Nền tảng trao quyền kỹ năng số và tư duy khởi nghiệp cho thanh niên dân tộc thiểu số.',
        theme_color: '#22C55E',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1500
  }
});