// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Build optimization
  vite: {
    build: {
      // Increase chunk size warning limit for Three.js
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            'three': ['three'],
            'tween': ['@tweenjs/tween.js']
          }
        }
      }
    },
    // Optimize deps
    optimizeDeps: {
      include: ['three', '@tweenjs/tween.js']
    }
  }
});
