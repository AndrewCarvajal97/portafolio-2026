// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Canonical site URL. Used for sitemap, robots, og:url and rel=canonical.
  // With a custom domain configured via public/CNAME, the site is served at
  // the root of pablocarvajal.dev, so no `base` path is needed.
  site: 'https://pablocarvajal.dev',
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
