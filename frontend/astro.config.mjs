// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite'; // Das neue v4 Plugin

export default defineConfig({
  integrations: [
    react(), 
    keystatic()
  ],
  vite: {
    plugins: [tailwindcss()], // Tailwind v4 wird hier direkt als Vite-Plugin geladen
  },
  output: 'server',
});