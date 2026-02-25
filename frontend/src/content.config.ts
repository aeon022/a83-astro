// Dateipfad: frontend/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const showcase = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/showcase" }),
    schema: z.object({
        title: z.string(),
        coverImage: z.string().optional(),
        excerpt: z.string().optional(),
        entity: z.string(), // Korrigiert: Nutzt jetzt 'entity' statt 'client'
        vector: z.string().optional(),
        arch: z.string(),
        cycle: z.string().optional(),
        protocolReadout: z.string().optional(),
        taskProtocol: z.string().optional(),
        stackDeployed: z.array(z.string()).optional(),
        fixExecuted: z.string().optional(),
        finalStatus: z.string().optional(),
        gatewayUri: z.string().optional(),
        isHighlighted: z.boolean().default(false),
    })
});

const services = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
    schema: z.object({
        title: z.string(),
        id: z.string(),
        status: z.string().default('AVAILABLE'),
        showOnStartpage: z.boolean().default(false),
        accent: z.string().default('var(--a83-accent)'),
        icon: z.string().optional(),
        size: z.enum(['lg:col-span-8', 'lg:col-span-4']).default('lg:col-span-4'),
        tagline: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        priceLabel: z.string().default('// BASE_PRICE:'),
        outputParameters: z.array(z.string()).optional(),
        buildSuccess: z.array(z.string()).optional(),
        buttonLabel: z.string().default('sh start_project.sh'),
        actionLink: z.string().default('mailto:post@abteilung83.at'),
        footnote: z.string().optional(),
        specs: z.array(z.string()).optional(),
    })
});

// Wir exportieren die Collections passend zu deiner Keystatic-Struktur
export const collections = { showcase, services };