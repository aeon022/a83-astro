// Dateipfad: frontend/db/seed.ts
import { db } from 'astro:db';
import { portfolio, services } from './schema';

export default async function seed() {
  console.log('//sys/init: Running Database Seed...');

  // Portfolio Dummy-Daten injizieren
  await db.insert(portfolio).values([
    {
      title: 'High-Performance E-Commerce',
      slug: 'high-performance-ecommerce',
      description: 'Headless Shop-Architektur mit Sub-Second Ladezeiten. Conversion-Rate um 40% gesteigert.',
      client: 'TechGear Pro',
      techStack: 'Astro, Tailwind CSS, Stripe',
      liveUrl: 'https://example.com',
      lighthouseScore: 100,
    },
    {
      title: 'Corporate Identity Relaunch',
      slug: 'corporate-identity-relaunch',
      description: 'Komplettes Redesign und Migration von monolithischem WordPress zu statischer Architektur.',
      client: 'DataSecure GmbH',
      techStack: 'Astro, StudioCMS, Drizzle',
      liveUrl: 'https://example.com/datasecure',
      lighthouseScore: 98,
    }
  ]);

  // Services / E-Commerce Retainer Dummy-Daten injizieren
  await db.insert(services).values([
    {
      title: 'Astro + StudioCMS Migration',
      slug: 'astro-migration',
      description: 'Das ultimative Upgrade für maximale Performance und Zero Bloat.',
      basePrice: 8000,
      isRetainer: false,
    },
    {
      title: 'DevOps & Maintenance Retainer',
      slug: 'devops-retainer',
      description: 'Laufende Überwachung, Security-Updates und Server-Management auf Ubuntu 24.04.',
      basePrice: 500,
      isRetainer: true,
    }
  ]);

  console.log('//sys/success: Database Seed completed. Nice Data injected.');
}