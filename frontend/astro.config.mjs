// Dateipfad: frontend/astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://abteilung83.at',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  
  // WICHTIG: React muss zwingend VOR Keystatic geladen werden
  integrations: [
    react(), 
    keystatic(), 
    sitemap()
  ],
  
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Zwingt Vite, Keystatic-Module im SSR-Kontext korrekt aufzulösen
      noExternal: ['@keystatic/core', '@keystatic/astro', 'superstruct', 'biscuits']
    },
    optimizeDeps: {
      // Fix für "does not provide an export named 'createRoot'"
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime'
      ],
      // Wir verhindern, dass Keystatic-Internals den Optimizer verwirren
      exclude: ['@keystatic/astro']
    },
    resolve: {
      // Verhindert Double-Bundling von React (Tödlich für Hooks)
      dedupe: ['react', 'react-dom']
    }
  },

  security: {
    checkOrigin: false 
  },
  
  redirects: {
    '/cms': '/',
    '/cms/[...slug]': '/',
    '/wp-admin': '/',
    '/wp-admin/[...slug]': '/',
    '/wp-content/[...slug]': '/',
    '/wp-includes/[...slug]': '/'
  }
});