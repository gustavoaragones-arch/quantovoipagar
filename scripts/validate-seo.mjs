import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function extractJsonLd(html) {
  const match = html.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
  );
  if (!match) throw new Error('No JSON-LD block found in index.html');
  return JSON.parse(match[1]);
}

function validateFaqSchema() {
  const faqPath = join(root, 'src/components/ImportFAQ.tsx');
  const source = readFileSync(faqPath, 'utf8');
  const itemsBlock = source.match(/const FAQ_ITEMS = (\[[\s\S]*?\]) as const;/);
  if (!itemsBlock) throw new Error('FAQ_ITEMS not found');

  const items = eval(itemsBlock[1]);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  JSON.stringify(schema);
  return schema.mainEntity.length;
}

const appSchema = extractJsonLd(readFileSync(join(root, 'index.html'), 'utf8'));
if (appSchema['@type'] !== 'SoftwareApplication') {
  throw new Error('Expected SoftwareApplication schema');
}

const faqCount = validateFaqSchema();
console.log(`OK: SoftwareApplication JSON-LD valid`);
console.log(`OK: FAQPage schema (${faqCount} questions) serializes to valid JSON`);
