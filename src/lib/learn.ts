import type { CollectionEntry } from 'astro:content';

// Topics for the Learn section (/blog). Order here = order of the filter chips.
export const TOPICS: Record<string, { label: string; color: string }> = {
  'creative-testing': { label: 'Creative testing', color: 'var(--mint)' },
  'ugc-ads': { label: 'UGC ads', color: 'var(--lav)' },
  'brand-web': { label: 'Brand & web', color: 'var(--peach)' },
  'for-creators': { label: 'For creators', color: 'var(--lilac)' },
};

export const topicOf = (e: CollectionEntry<'cases'>) => TOPICS[e.data.topic ?? ''] ?? { label: 'Guide', color: 'var(--card)' };

// Short cover title: the part of the title before ":" or "—".
export const shortTitle = (title: string) => title.split(/:|—| - /)[0].trim();

export const readMinutes = (e: CollectionEntry<'cases'>) =>
  Math.max(3, Math.round((e.body ?? '').split(/\s+/).length / 220));
