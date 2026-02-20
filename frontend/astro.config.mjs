// Dateipfad: frontend/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';
import node from '@astrojs/node';

export default defineConfig({
  site: 'http://localhost:4321',
  // StudioCMS benötigt 'server' für die dynamische Middleware & Auth
  output: 'server', 
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    studioCMS(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});