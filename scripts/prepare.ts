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

// 同步核心支撑信任页面（关于、方法论、隐私、条款、披露，不计入 560 核心规划节点）
const supportPages = ['about', 'methodology', 'privacy', 'terms', 'disclosure'];
let supportCount = 0;
for (const sp of supportPages) {
  const src = path.join(CONTENT_DIR, sp, 'index.md');
  if (fs.existsSync(src)) {
    const dest = path.join(GENERATED_DIR, sp, 'index.md');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    let content = fs.readFileSync(src, 'utf-8');
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
    fs.writeFileSync(dest, content, 'utf-8');
    supportCount++;
  }
}
if (supportCount > 0) {
  console.log(`✔ 已同步 ${supportCount} 个 E-E-A-T 核心支撑与合规页面至 site/generated/`);
}

// 同步静态公共资源 (头像、favicon 等)
const PUBLIC_SRC = path.resolve('site/public');
const PUBLIC_DEST = path.resolve('site/generated/public');
if (fs.existsSync(PUBLIC_SRC)) {
  fs.mkdirSync(PUBLIC_DEST, { recursive: true });
  fs.cpSync(PUBLIC_SRC, PUBLIC_DEST, { recursive: true });
}

console.log(`✔ 已将 ${publishedCount} 个 published 状态的页面与静态资源安全同步至 site/generated/`);
