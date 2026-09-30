import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z.enum(['case', 'article']).default('case'),
    lang: z.string().default('en'),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

export const collections = { cases };
