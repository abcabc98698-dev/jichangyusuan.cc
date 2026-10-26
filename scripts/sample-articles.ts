import fs from 'node:fs';
import path from 'node:path';

const samples = [
  'content/budget/first-payment-cap/index.md',
  'content/monthly/true-monthly-rules/index.md',
  'content/annual/annual-break-even-analysis/index.md',
  'content/discounts/first-order-discount-rules/index.md',
  'content/renewal/renewal-price-drift-trap/index.md',
  'content/plans/unmetered-bandwidth-audit/index.md',
  'content/usage/home-broadband-offload-cost/index.md',
  'content/low-budget/minimum-viable-package/index.md',
  'content/high-data/terabyte-level-cost-model/index.md',
  'content/buying-checks/annual-payment-runaway-risk/index.md'
];

// If any file doesn't exist, search within that folder
const sampleResults: any[] = [];

for (const target of samples) {
  let fileToRead = path.resolve(target);
  if (!fs.existsSync(fileToRead)) {
    const parts = target.split('/');
    const cat = parts[1];
    const catDir = path.resolve('content', cat);
    if (fs.existsSync(catDir)) {
      const subs = fs.readdirSync(catDir);
      const articleDir = subs.find(s => fs.existsSync(path.join(catDir, s, 'index.md')));
      if (articleDir) {
        fileToRead = path.join(catDir, articleDir, 'index.md');
      }
    }
  }

  if (fs.existsSync(fileToRead)) {
    const content = fs.readFileSync(fileToRead, 'utf8');
    const lines = content.split('\n');
    const title = (lines.find(l => l.startsWith('# ')) || '').replace('# ', '').trim();
    const cleanParas = lines
      .map(l => l.trim())
      .filter(l => l.length > 50 && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('|') && !l.startsWith(':::') && !l.startsWith('<'));

    sampleResults.push({
      filePath: path.relative(path.resolve('.'), fileToRead).replace(/\\/g, '/'),
      title,
      paragraphsCount: cleanParas.length,
      sampleParagraphs: cleanParas.slice(0, 3)
    });
  }
}

fs.writeFileSync('reports/sample-articles.json', JSON.stringify(sampleResults, null, 2), 'utf8');
console.log(`Extracted ${sampleResults.length} article samples.`);
