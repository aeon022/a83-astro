import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server', // Wichtig für die Keystatic API-Routen
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),     // Rendert das Admin-Dashboard
    keystatic(), // Das CMS selbst
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});