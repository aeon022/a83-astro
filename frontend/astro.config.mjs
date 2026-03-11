// Dateipfad: frontend/astro.config.mjs
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
  security: {
    checkOrigin: false // <-- Verhindert den automatischen 403 bei POST-Requests hinter Proxys
  },
  
  // SEO & Legacy Routing (301 Umleitungen auf die Startseite)
  redirects: {
    '/cms': '/',
    '/cms/[...slug]': '/',
    
    // WordPress Ghost-Town Bereinigung
    '/wp-admin': '/',
    '/wp-admin/[...slug]': '/',
    '/wp-content/[...slug]': '/',
    '/wp-includes/[...slug]': '/'
  }
});
