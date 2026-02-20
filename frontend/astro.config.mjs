// Dateipfad: frontend/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import studioCMS from '@studiocms/astro';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    partytown({
      config: { forward: ['dataLayer.push'] },
    }),
    studioCMS({
      // Basis-Konfiguration für StudioCMS
      dbStartPage: true,
      imageService: 'astro',
    })
  ],
  prefetch: true,
});