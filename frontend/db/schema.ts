// Dateipfad: frontend/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Definition der Custom Collection: Portfolio [cite: 109, 115]
export const portfolio = sqliteTable('portfolio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  client: text('client'),
  // Tech Stack als kommaseparierter String oder JSON für die Pills
  techStack: text('tech_stack'), 
  liveUrl: text('live_url'),
  // Lighthouse Score für Proof of Concept
  lighthouseScore: integer('lighthouse_score').default(100),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Definition der Custom Collection: Services [cite: 109, 115]
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  // E-Commerce-Erweiterung: Base Price für Headless-Checkout [cite: 27, 28]
  basePrice: integer('base_price'), 
  description: text('description').notNull(),
  // Checkbox-Feld, ob es sich um einen Retainer handelt [cite: 27]
  isRetainer: integer('is_retainer', { mode: 'boolean' }).default(false), 
});