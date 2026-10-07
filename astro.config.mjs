import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://okad.agency',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/en/') &&
        !page.includes('/ru/') &&
        !page.includes('/ads-video/') &&
        !page.includes('/ugc-video/') &&
        !page.includes('standing-out-digitally') &&
        !page.includes('creating-a-scalable-logo') &&
        !page.includes('effective-content-templates') &&
        !page.includes('how-to-design-a-high-converting') &&
        !page.includes('how-to-increase-the-customer-retention') &&
        !page.includes('interactive-maps-and-dynamic') &&
        !page.includes('trusto-case-study-how') &&
        !page.includes('utilizing-visual-storytelling') &&
        !page.includes('color-psychology-in-web'),
    }),
  ],
  output: 'static',
});
