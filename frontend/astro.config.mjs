// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite'; // Das neue v4 Plugin

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()], // Tailwind v4 wird hier direkt als Vite-Plugin geladen
  },
  output: 'server',
});