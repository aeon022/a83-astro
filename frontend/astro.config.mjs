// Dateipfad: frontend/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
  // Tailwind v4 wird als Vite-Plugin geladen
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    partytown({
      // Web Worker Setup für Third-Party-Scripts
      config: { forward: ['dataLayer.push'] },
    }),
  ],
  // Vorbereitung für View Transitions und sauberes Routing
  prefetch: true,
});