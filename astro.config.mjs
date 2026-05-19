// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pablocarvajal.dev',
  integrations: [sitemap()],
  vite: {
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three'],
            'tween': ['@tweenjs/tween.js'],
            'gsap': ['gsap']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['three', '@tweenjs/tween.js']
    }
  }
});
