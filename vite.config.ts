import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'KTaNE Tool',
      short_name: 'KTaNE Tool',
      description: 'A simple tool to help with playing Keep Talking and Nobody Explodes (KTaNE)',
      theme_color: '#000000',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  server: {
    port: 3000,
    strictPort: true,
  },
})