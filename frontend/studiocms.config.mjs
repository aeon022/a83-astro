// Dateipfad: frontend/studiocms.config.mjs
import { defineStudioCMSConfig } from 'studiocms/config';
import studioCMSMarkdown from '@studiocms/md';

export default defineStudioCMSConfig({
  dbStartPage: false, // Verhindert die Kollision mit deiner index.astro
  imageService: 'astro',
  plugins: [
    studioCMSMarkdown(), // Aktiviert die im Konzept geforderte Markdown-Engine
  ],
});