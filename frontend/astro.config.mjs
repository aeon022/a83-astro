// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite'; // Das neue v4 Plugin
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://abteilung83.at',
  integrations: [react(), keystatic(), sitemap()],
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()], // Tailwind v4 wird hier direkt als Vite-Plugin geladen
  },
  output: 'server',
});