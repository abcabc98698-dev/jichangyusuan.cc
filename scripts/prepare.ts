import fs from 'node:fs';
import path from 'node:path';

console.log('--- 准备构建正文 (content:prepare) ---');

const registryPath = path.resolve('data/registry.json');
if (!fs.existsSync(registryPath)) {
  console.error('❌ 未找到 data/registry.json，请先运行 pnpm content:plan');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const CONTENT_DIR = path.resolve('content');
const GENERATED_DIR = path.resolve('site/generated');

// 1. 安全重置 site/generated 目录
if (fs.existsSync(GENERATED_DIR)) {
  fs.rmSync(GENERATED_DIR, { recursive: true, force: true });
}
fs.mkdirSync(GENERATED_DIR, { recursive: true });

let publishedCount = 0;

for (const node of Object.values(registry) as any[]) {
  if (node.status !== 'published') {
    continue;
  }

  let srcRel = node.url.replace(/^\/|\/$/g, '');
  let srcFile = path.join(CONTENT_DIR, srcRel, 'index.md');
  let destFile = path.join(GENERATED_DIR, srcRel, 'index.md');

  if (node.kind === 'home') {
    srcFile = path.join(CONTENT_DIR, 'index.md');
    destFile = path.join(GENERATED_DIR, 'index.md');
  }

  if (fs.existsSync(srcFile)) {
    const destDir = path.dirname(destFile);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    let content = fs.readFileSync(srcFile, 'utf-8');

    // 自动在 Markdown 正文包装 data-pagefind-body 标记，确保 Pagefind 全文抓取
    // 检查 frontmatter
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        const frontmatter = parts[1];
        const body = parts.slice(2).join('---');
        content = `---${frontmatter}---\n\n<div data-pagefind-body>\n\n${body.trim()}\n\n</div>\n`;
      }
    } else {
      content = `<div data-pagefind-body>\n\n${content}\n\n</div>\n`;
    }

    fs.writeFileSync(destFile, content, 'utf-8');
    publishedCount++;
  }
}

// 同步静态公共资源 (头像、favicon 等)
const PUBLIC_SRC = path.resolve('site/public');
const PUBLIC_DEST = path.resolve('site/generated/public');
if (fs.existsSync(PUBLIC_SRC)) {
  fs.mkdirSync(PUBLIC_DEST, { recursive: true });
  fs.cpSync(PUBLIC_SRC, PUBLIC_DEST, { recursive: true });
}

console.log(`✔ 已将 ${publishedCount} 个 published 状态的页面与静态资源安全同步至 site/generated/`);
