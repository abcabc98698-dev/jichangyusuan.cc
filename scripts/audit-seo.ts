import fs from 'node:fs';
import path from 'node:path';

interface PageAuditResult {
  filePath: string;
  urlPath: string;
  title: string;
  h1: string[];
  description: string;
  canonical: string;
  noindex: boolean;
  wordCount: number;
  internalLinks: string[];
  externalLinks: { href: string; rel: string; text: string }[];
  emptyOrHashLinks: string[];
  schemaTypes: string[];
  hasAuthor: boolean;
  hasDisclosure: boolean;
  viewport: string;
  imagesWithoutAlt: string[];
  imagesTotal: number;
}

const DIST_DIR = path.resolve('site/dist');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');
const ROBOTS_DIST = path.join(DIST_DIR, 'robots.txt');
const ROBOTS_PUBLIC = path.resolve('site/public/robots.txt');
const HTACCESS_PATH = path.resolve('deploy/.htaccess');

function walkHtmlFiles(dir: string): string[] {
  let files: string[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(walkHtmlFiles(full));
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function countHanziAndWords(text: string): number {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const hanziMatches = clean.match(/[\u4e00-\u9fa5]/g) || [];
  const latinMatches = clean.match(/[a-zA-Z0-9_-]+/g) || [];
  return hanziMatches.length + latinMatches.length;
}

function extractMeta(html: string, name: string): string {
  const m = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'](.*?)["']`, 'i'))
    || html.match(new RegExp(`<meta\\s+content=["'](.*?)["']\\s+name=["']${name}["']`, 'i'));
  return m ? m[1] : '';
}

export async function runAudit() {
  console.log('--- Starting Comprehensive SEO Audit (Pure Node.js) ---');

  // 1. Robots.txt check
  const robotsExistsDist = fs.existsSync(ROBOTS_DIST);
  const robotsExistsPublic = fs.existsSync(ROBOTS_PUBLIC);
  let robotsContent = '';
  if (robotsExistsPublic) robotsContent = fs.readFileSync(ROBOTS_PUBLIC, 'utf8');
  else if (robotsExistsDist) robotsContent = fs.readFileSync(ROBOTS_DIST, 'utf8');

  // 2. Sitemap check
  const sitemapExists = fs.existsSync(SITEMAP_PATH);
  let sitemapUrls: string[] = [];
  let sitemapHasLastmod = false;
  if (sitemapExists) {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)];
    sitemapUrls = locMatches.map(m => m[1]);
    sitemapHasLastmod = sitemapContent.includes('<lastmod>');
  }

  // 3. Scan all HTML files in dist
  const htmlFiles = walkHtmlFiles(DIST_DIR);
  const pages: PageAuditResult[] = [];

  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    if (rel === '404.html') continue; // exclude 404 page

    let urlPath = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (urlPath === '') urlPath = '/';
    if (!urlPath.endsWith('/') && !urlPath.includes('.')) urlPath += '/';

    const rawHtml = fs.readFileSync(file, 'utf8');

    // Title
    const titleMatch = rawHtml.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Description
    const description = extractMeta(rawHtml, 'description');

    // Canonical
    const canMatch = rawHtml.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    const canonical = canMatch ? canMatch[1] : '';

    // Robots meta
    const robotsMeta = extractMeta(rawHtml, 'robots');
    const noindex = robotsMeta.toLowerCase().includes('noindex');

    // Viewport
    const viewport = extractMeta(rawHtml, 'viewport');

    // H1
    const h1: string[] = [];
    const h1Matches = [...rawHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    for (const hm of h1Matches) {
      const cleanH1 = hm[1].replace(/<[^>]*>/g, '').trim();
      if (cleanH1) h1.push(cleanH1);
    }

    // Body word count
    const bodyMatch = rawHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const wordCount = bodyMatch ? countHanziAndWords(bodyMatch[1]) : 0;

    // Links
    const internalLinks: string[] = [];
    const externalLinks: { href: string; rel: string; text: string }[] = [];
    const emptyOrHashLinks: string[] = [];

    const linkMatches = [...rawHtml.matchAll(/<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi)];
    for (const lm of linkMatches) {
      const attrs = lm[1];
      const linkText = lm[2].replace(/<[^>]*>/g, '').trim();

      const hrefMatch = attrs.match(/href=["'](.*?)["']/i);
      const relMatch = attrs.match(/rel=["'](.*?)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '';
      const relAttr = relMatch ? relMatch[1] : '';

      if (!href || href === '#' || href === '') {
        emptyOrHashLinks.push(href || '(empty)');
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        if (href.startsWith('https://jichangyusuan.cc')) {
          internalLinks.push(href);
        } else {
          externalLinks.push({ href, rel: relAttr, text: linkText });
        }
      } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
        internalLinks.push(href);
      }
    }

    // Schema
    const schemaTypes: string[] = [];
    const jsonLdMatches = [...rawHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const sm of jsonLdMatches) {
      try {
        const json = JSON.parse(sm[1]);
        if (json['@type']) schemaTypes.push(json['@type']);
      } catch (e) {
        schemaTypes.push('INVALID_JSON');
      }
    }

    // Author check
    const authorMeta = extractMeta(rawHtml, 'author');
    const hasAuthor = !!authorMeta ||
      rawHtml.includes('作者：') ||
      rawHtml.includes('byline') ||
      rawHtml.includes('编辑团队');

    // Disclosure check
    const hasDisclosure = rawHtml.includes('商业转介说明') ||
      rawHtml.includes('独立预算工具与知识库') ||
      rawHtml.includes('推广声明') ||
      rawHtml.includes('佣金声明') ||
      rawHtml.includes('转介说明');

    // Images
    const imagesWithoutAlt: string[] = [];
    let imagesTotal = 0;
    const imgMatches = [...rawHtml.matchAll(/<img\s+([^>]*?)>/gi)];
    for (const im of imgMatches) {
      imagesTotal++;
      const attrs = im[1];
      const altMatch = attrs.match(/alt=["'](.*?)["']/i);
      const srcMatch = attrs.match(/src=["'](.*?)["']/i);
      if (!altMatch || !altMatch[1].trim()) {
        imagesWithoutAlt.push(srcMatch ? srcMatch[1] : 'unknown');
      }
    }

    const pageResult: PageAuditResult = {
      filePath: rel,
      urlPath,
      title,
      h1,
      description,
      canonical,
      noindex,
      wordCount,
      internalLinks,
      externalLinks,
      emptyOrHashLinks,
      schemaTypes,
      hasAuthor,
      hasDisclosure,
      viewport,
      imagesWithoutAlt,
      imagesTotal,
    };

    pages.push(pageResult);

    if (title) {
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title)!.push(urlPath);
    }
    if (description) {
      if (!descMap.has(description)) descMap.set(description, []);
      descMap.get(description)!.push(urlPath);
    }
    for (const heading of h1) {
      if (!h1Map.has(heading)) h1Map.set(heading, []);
      h1Map.get(heading)!.push(urlPath);
    }
  }

  // Duplicate checks
  const duplicateTitles = Array.from(titleMap.entries()).filter(([_, urls]) => urls.length > 1);
  const duplicateDescriptions = Array.from(descMap.entries()).filter(([_, urls]) => urls.length > 1);
  const duplicateH1s = Array.from(h1Map.entries()).filter(([_, urls]) => urls.length > 1);

  // Thin content checks
  const thinUnder500 = pages.filter(p => p.wordCount < 500);
  const thinUnder300 = pages.filter(p => p.wordCount < 300);

  // Canonical check
  const invalidCanonicals: { urlPath: string; canonical: string; issue: string }[] = [];
  for (const p of pages) {
    if (!p.canonical) {
      invalidCanonicals.push({ urlPath: p.urlPath, canonical: '', issue: 'MISSING' });
    } else {
      const expected = `https://jichangyusuan.cc${p.urlPath}`;
      if (p.canonical !== expected && p.canonical !== expected.replace(/\/$/, '')) {
        invalidCanonicals.push({ urlPath: p.urlPath, canonical: p.canonical, issue: `MISMATCH (expected: ${expected})` });
      }
    }
  }

  // External & Affiliate links audit
  let totalExternalLinks = 0;
  let affiliateLinksTotal = 0;
  let affiliateLinksWithSponsored = 0;
  let affiliateLinksWithoutSponsored: { urlPath: string; href: string; rel: string }[] = [];

  for (const p of pages) {
    for (const ext of p.externalLinks) {
      totalExternalLinks++;
      if (ext.href.includes('jichangbang.org')) {
        affiliateLinksTotal++;
        const rel = ext.rel.toLowerCase();
        if (rel.includes('sponsored') || (rel.includes('nofollow') && rel.includes('sponsored'))) {
          affiliateLinksWithSponsored++;
        } else {
          affiliateLinksWithoutSponsored.push({
            urlPath: p.urlPath,
            href: ext.href,
            rel: ext.rel
          });
        }
      }
    }
  }

  // Internal link graph & Click depth BFS from '/'
  const urlSet = new Set(pages.map(p => p.urlPath));
  const adj = new Map<string, Set<string>>();
  for (const u of urlSet) adj.set(u, new Set());

  let totalBrokenInternalLinks: { from: string; to: string }[] = [];
  let totalEmptyOrHashLinks = 0;

  for (const p of pages) {
    totalEmptyOrHashLinks += p.emptyOrHashLinks.length;
    for (const rawTarget of p.internalLinks) {
      let targetPath = rawTarget;
      if (targetPath.startsWith('https://jichangyusuan.cc')) {
        targetPath = targetPath.replace('https://jichangyusuan.cc', '');
      }
      targetPath = targetPath.split('#')[0].split('?')[0];
      if (!targetPath) targetPath = '/';
      if (!targetPath.endsWith('/') && !targetPath.includes('.')) targetPath += '/';

      if (urlSet.has(targetPath)) {
        adj.get(p.urlPath)!.add(targetPath);
      } else {
        if (!/\.(png|jpg|jpeg|ico|svg|webmanifest|css|js|json|xml|txt)$/i.test(targetPath)) {
          totalBrokenInternalLinks.push({ from: p.urlPath, to: rawTarget });
        }
      }
    }
  }

  // BFS depth calculation
  const depthMap = new Map<string, number>();
  const queue: [string, number][] = [['/', 0]];
  depthMap.set('/', 0);

  while (queue.length > 0) {
    const [curr, d] = queue.shift()!;
    const neighbors = adj.get(curr) || new Set();
    for (const n of neighbors) {
      if (!depthMap.has(n)) {
        depthMap.set(n, d + 1);
        queue.push([n, d + 1]);
      }
    }
  }

  const orphanPages = pages.filter(p => p.urlPath !== '/' && !depthMap.has(p.urlPath));
  const depthDistribution: Record<number, number> = {};
  for (const [_, d] of depthMap.entries()) {
    depthDistribution[d] = (depthDistribution[d] || 0) + 1;
  }

  // Schema totals
  const schemaUsage: Record<string, number> = {};
  for (const p of pages) {
    for (const s of p.schemaTypes) {
      schemaUsage[s] = (schemaUsage[s] || 0) + 1;
    }
  }

  // Check Apache .htaccess
  let htaccessContent = '';
  if (fs.existsSync(HTACCESS_PATH)) {
    htaccessContent = fs.readFileSync(HTACCESS_PATH, 'utf8');
  }
  const hasHsts = htaccessContent.includes('Strict-Transport-Security');
  const hasXContentTypeOptions = htaccessContent.includes('X-Content-Type-Options');
  const hasXFrameOptions = htaccessContent.includes('X-Frame-Options');
  const hasReferrerPolicy = htaccessContent.includes('Referrer-Policy');
  const hasHttpsRewrite = htaccessContent.includes('RewriteCond %{HTTPS} off') || htaccessContent.includes('SERVER_PORT');

  // Summary object
  const reportSummary = {
    totalPages: pages.length,
    robotsTxt: {
      existsDist: robotsExistsDist,
      existsPublic: robotsExistsPublic,
      contentPreview: robotsContent.slice(0, 200)
    },
    sitemap: {
      exists: sitemapExists,
      totalUrls: sitemapUrls.length,
      hasLastmod: sitemapHasLastmod,
      mismatchCount: sitemapUrls.filter(u => !u.startsWith('https://jichangyusuan.cc')).length
    },
    canonicals: {
      invalidCount: invalidCanonicals.length,
      samples: invalidCanonicals.slice(0, 5)
    },
    noindexCount: pages.filter(p => p.noindex).length,
    contentDepth: {
      under300: thinUnder300.length,
      under500: thinUnder500.length,
      minWords: Math.min(...pages.map(p => p.wordCount)),
      maxWords: Math.max(...pages.map(p => p.wordCount)),
      avgWords: Math.round(pages.reduce((acc, p) => acc + p.wordCount, 0) / pages.length)
    },
    duplicates: {
      duplicateTitlesCount: duplicateTitles.length,
      duplicateTitlesSamples: duplicateTitles.slice(0, 5),
      duplicateDescriptionsCount: duplicateDescriptions.length,
      duplicateDescriptionsSamples: duplicateDescriptions.slice(0, 5),
      duplicateH1sCount: duplicateH1s.length,
      duplicateH1sSamples: duplicateH1s.slice(0, 5)
    },
    affiliateCompliance: {
      totalExternal: totalExternalLinks,
      affiliateTotal: affiliateLinksTotal,
      affiliateWithSponsored: affiliateLinksWithSponsored,
      affiliateWithoutSponsoredCount: affiliateLinksWithoutSponsored.length,
      samplesWithoutSponsored: affiliateLinksWithoutSponsored.slice(0, 5)
    },
    internalLinks: {
      brokenCount: totalBrokenInternalLinks.length,
      emptyOrHashCount: totalEmptyOrHashLinks,
      orphanPagesCount: orphanPages.length,
      orphanPagesSamples: orphanPages.slice(0, 5).map(p => p.urlPath),
      depthDistribution
    },
    schema: {
      schemaUsage,
      pagesWithSchemaCount: pages.filter(p => p.schemaTypes.length > 0).length
    },
    authorAndEEAT: {
      pagesWithAuthorTag: pages.filter(p => p.hasAuthor).length,
      pagesWithDisclosure: pages.filter(p => p.hasDisclosure).length,
      aboutUsPage: fs.existsSync(path.resolve('content/about/index.md')),
      methodologyPage: fs.existsSync(path.resolve('content/methodology/index.md')),
      privacyPage: fs.existsSync(path.resolve('content/privacy/index.md')),
      termsPage: fs.existsSync(path.resolve('content/terms/index.md'))
    },
    security: {
      hasHttpsRewrite,
      hasHsts,
      hasXContentTypeOptions,
      hasXFrameOptions,
      hasReferrerPolicy
    },
    mobile: {
      missingViewport: pages.filter(p => !p.viewport).length,
      imagesTotal: pages.reduce((a, b) => a + b.imagesTotal, 0),
      imagesWithoutAlt: pages.reduce((a, b) => a + b.imagesWithoutAlt.length, 0)
    }
  };

  const outPath = path.resolve('reports/seo-audit-raw.json');
  fs.writeFileSync(outPath, JSON.stringify(reportSummary, null, 2), 'utf8');
  console.log('--- Comprehensive SEO Audit Completed. Saved to reports/seo-audit-raw.json ---');
  console.log(JSON.stringify(reportSummary, null, 2));
}

runAudit().catch(console.error);
