import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z.enum(['case', 'blog']).default('case'),
    date: z.coerce.date().optional(),
    lang: z.string().default('en'),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    // Learn (blog) only: topic slug from src/lib/learn.ts, and order in the "Start here" list
    topic: z.string().optional(),
    hook: z.string().optional(), // short question shown on guide cards
    startHere: z.number().optional(),
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});

export const collections = { cases };
