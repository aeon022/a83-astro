// Dateipfad: frontend/astro.config.mjs
import { defineConfig, passthroughImageService } from 'astro/config'; // <-- Import anpassen
import tailwindcss from '@tailwindcss/vite';
import studioCMS from 'studiocms';
import node from '@astrojs/node';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server', 
  adapter: node({
    mode: 'standalone',
  }),
  // Schaltet Sharp ab und leitet Bilder einfach 1:1 durch:
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    studioCMS(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});