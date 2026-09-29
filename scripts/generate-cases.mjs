import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CRAWL_DIR = resolve(ROOT, 'crawl', 'cases');
const OUT_DIR = resolve(ROOT, 'src', 'content', 'cases');

/** Prefixes that indicate a "case" rather than an "article". */
const CASE_PREFIXES = ['case-', 'ux-research-', 'high-roas-', 'high-converting-'];

function isCaseType(slug) {
  return CASE_PREFIXES.some((p) => slug.startsWith(p));
}

/**
 * Turn a slug like "case-trusto" or "5-principles-of-timeless-ux-ui-design"
 * into a readable title.
 */
function slugToTitle(slug) {
  // Remove known case- prefix for cleaner titles
  let s = slug;
  if (s.startsWith('case-')) s = s.slice(5);

  return s
    .split('-')
    .map((word) => {
      // Keep common acronyms uppercase
      const upper = word.toUpperCase();
      if (['UX', 'UI', 'AI', 'DTC', 'B2C', 'B2B', 'CKX', 'MSU', 'SLP', 'ROAS', 'UGC'].includes(upper)) {
        return upper;
      }
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Parse the rendered page.html to extract text content.
 * Framer renders as a client-side SPA, so SSR HTML has no semantic content.
 * We try to extract whatever text exists between tags.
 */
function extractTextFromHtml(html) {
  if (!html) return [];

  // Remove script and style blocks
  let clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  clean = clean.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');

  // Extract text content between tags
  const texts = [];
  const regex = />([^<]+)</g;
  let match;
  while ((match = regex.exec(clean)) !== null) {
    const t = match[1].trim();
    if (t.length > 3 && !t.startsWith('{') && !t.startsWith('var ') && !t.startsWith('function')) {
      texts.push(t);
    }
  }
  return texts;
}

/**
 * Parse content.json items into markdown body.
 * Deduplicates consecutive identical items (Framer desktop/tablet/mobile copies).
 */
function contentToMarkdown(items) {
  if (!items || items.length === 0) return '';

  const lines = [];
  let prevText = '';
  const seenTexts = new Set();

  for (const item of items) {
    if (item.type === 'heading') {
      const text = (item.text || '').trim();
      if (!text || text === prevText) continue;
      // Skip if we've already seen this exact heading
      if (seenTexts.has(text)) continue;
      seenTexts.add(text);
      prevText = text;

      const level = item.tag === 'h1' ? '##' : item.tag === 'h2' ? '##' : '###';
      lines.push('');
      lines.push(`${level} ${text}`);
      lines.push('');
    } else if (item.type === 'paragraph') {
      const text = (item.text || '').trim();
      if (!text || text === prevText) continue;
      if (seenTexts.has(text)) continue;
      seenTexts.add(text);
      prevText = text;

      lines.push(text);
      lines.push('');
    } else if (item.type === 'list-item') {
      const text = (item.text || '').trim();
      if (!text || text === prevText) continue;
      if (seenTexts.has(text)) continue;
      seenTexts.add(text);
      prevText = text;

      lines.push(`- ${text}`);
    } else if (item.type === 'image') {
      const src = (item.src || '').trim();
      const alt = (item.alt || '').trim();
      if (!src || seenTexts.has(src)) continue;
      seenTexts.add(src);
      prevText = '';

      lines.push('');
      lines.push(`![${alt}](${src})`);
      lines.push('');
    } else if (item.type === 'video') {
      const src = (item.src || '').trim();
      if (!src || seenTexts.has(src)) continue;
      seenTexts.add(src);
      prevText = '';

      lines.push('');
      lines.push(`<video src="${src}" controls></video>`);
      lines.push('');
    }
  }

  return lines.join('\n').trim();
}

/**
 * Escape YAML special characters in a string value.
 */
function yamlStr(s) {
  if (!s) return '""';
  // If contains quotes, colons, or newlines, wrap in double quotes and escape
  if (/[:"'\n\r#\[\]{}&*!|>%@`]/.test(s) || s.trim() !== s) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return '"' + s + '"';
}

async function main() {
  console.log('=== Generate Cases Markdown ===\n');

  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(CRAWL_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  console.log(`Found ${dirs.length} case subdirectories\n`);

  let generated = 0;

  for (const slug of dirs) {
    const dir = resolve(CRAWL_DIR, slug);

    // Read meta.json
    let meta = {};
    try {
      const raw = await readFile(resolve(dir, 'meta.json'), 'utf8');
      meta = JSON.parse(raw);
    } catch {
      // skip if no meta
    }

    // Read content.json
    let contentItems = [];
    try {
      const raw = await readFile(resolve(dir, 'content.json'), 'utf8');
      contentItems = JSON.parse(raw);
    } catch {
      // skip if no content
    }

    // Determine type
    const type = isCaseType(slug) ? 'case' : 'article';

    // Build title: prefer h1 from meta, then ogTitle (if not generic), then derive from slug
    let title = '';
    if (meta.h1 && meta.h1.trim()) {
      title = meta.h1.trim();
    } else if (meta.ogTitle && meta.ogTitle !== 'OKAD Agency') {
      title = meta.ogTitle;
    } else {
      title = slugToTitle(slug);
    }

    // Description: prefer ogDescription if not generic
    let description =
      meta.ogDescription && meta.ogDescription !== 'OKAD Agency delivers standout web design, pitch decks, captivating video production, content creation & graphic design to help global brands stand out.'
        ? meta.ogDescription
        : `${type === 'case' ? 'Case study' : 'Article'}: ${title}`;

    // Language
    const lang = meta.lang || 'en';

    // Cover image
    let cover = '';
    let coverAlt = '';
    if (meta.ogImage && !meta.ogImage.includes('assets_ZaNyqy3qatRFYkDiXwuicu0tkw')) {
      cover = meta.ogImage;
      coverAlt = title;
    }

    // Generate markdown body from content.json
    let body = contentToMarkdown(contentItems);

    // If content.json was empty, try extracting from page.html
    if (!body) {
      try {
        const html = await readFile(resolve(dir, 'page.html'), 'utf8');
        const texts = extractTextFromHtml(html);
        // Filter out generic header/footer text
        const genericTexts = new Set([
          'OKAD Agency',
          'OKAD',
          'No content? Wrong content? > We solve both.',
          'Book a call',
          'Email us',
          'Design',
          'Video',
          'Pricing',
          'Home',
        ]);
        const uniqueTexts = texts.filter((t) => !genericTexts.has(t));
        if (uniqueTexts.length > 0) {
          body = uniqueTexts.join('\n\n');
        }
      } catch {
        // no page.html
      }
    }

    // If still no body, add a placeholder
    if (!body) {
      body = `<!-- Content pending migration from Framer -->`;
    }

    // Build frontmatter
    const fm = [
      '---',
      `title: ${yamlStr(title)}`,
      `description: ${yamlStr(description)}`,
      `type: ${type}`,
      `lang: ${lang}`,
    ];
    if (cover) {
      fm.push(`cover: ${yamlStr(cover)}`);
      fm.push(`coverAlt: ${yamlStr(coverAlt)}`);
    }
    fm.push('---');

    const markdown = fm.join('\n') + '\n\n' + body + '\n';
    const outPath = resolve(OUT_DIR, `${slug}.md`);
    await writeFile(outPath, markdown);
    generated++;
    console.log(`  [${type}] ${slug}`);
  }

  console.log(`\nGenerated ${generated} markdown files in src/content/cases/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
