// Dateipfad: frontend/studiocms.config.mjs
import { defineStudioCMSConfig } from 'studiocms/config';
import studioCMSMarkdown from '@studiocms/md';

export default defineStudioCMSConfig({
  dbStartPage: false, // <--- Tür zu für das Setup, Tür auf für das Terminal!
  imageService: 'astro',
  plugins: [
    studioCMSMarkdown(),
  ],
});