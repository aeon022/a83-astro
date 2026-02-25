// Dateipfad: frontend/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const showcase = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/showcase" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        coverImage: z.string(),
        client: z.string(),
        publishDate: z.coerce.date(),
        tags: z.array(z.string()),
    })
});

const pricing = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/pricing" }),
    schema: z.object({
        plan: z.string(),
        price: z.string(),
        features: z.array(z.string()),
    })
});

// Wir exportieren die Collections passend zu deinem Verzeichnisbaum [cite: 47-107]
export const collections = { showcase, pricing };^