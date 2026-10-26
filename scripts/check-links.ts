import fs from 'node:fs';
import path from 'node:path';

console.log('--- 检查内部链接与主站转介规范 ---');

const registryPath = path.resolve('data/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const validUrls = new Set<string>(Object.values(registry).map((n: any) => n.url));

const CONTENT_DIR = path.resolve('content');
let brokenLinks = 0;

function checkMarkdownLinks(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      checkMarkdownLinks(full);
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      const text = fs.readFileSync(full, 'utf-8');
      
      // 提取所有站内相对绝对链接 [text](/...)
      const internalLinkRegex = /\[([^\]]+)\]\((\/[^#?)\s]+)([#?][^)]*)?\)/g;
      let match;
      while ((match = internalLinkRegex.exec(text)) !== null) {
        let linkUrl = match[2];
        if (!linkUrl.endsWith('/')) {
          linkUrl = `${linkUrl}/`;
        }

        // 排除静态静态资源
        if (linkUrl.startsWith('/pagefind/') || linkUrl.endsWith('.png/') || linkUrl.endsWith('.svg/')) {
          continue;
        }

        if (!validUrls.has(linkUrl)) {
          console.warn(`⚠ 链接告警: ${full} 引用了未在注册表中的 URL -> ${linkUrl}`);
          brokenLinks++;
        }
      }

      // 提取主站链接检查
      const mainSiteRegex = /https:\/\/jichangbang\.org\/([a-zA-Z0-9_\-\/]+)(\?[^)\s]*)?/g;
      let mainMatch;
      while ((mainMatch = mainSiteRegex.exec(text)) !== null) {
        const fullMatchedUrl = mainMatch[0];
        const searchParams = mainMatch[2] || '';
        // 必须含有 utm_source=jichangyusuan.cc
        if (!searchParams.includes('utm_source=jichangyusuan.cc')) {
          console.warn(`⚠ 主站转介链接未规范使用 UTM 参数: ${fullMatchedUrl} (位于 ${full})`);
        }
      }
    }
  }
}

checkMarkdownLinks(CONTENT_DIR);

if (brokenLinks > 0) {
  console.warn(`⚠ 共发现 ${brokenLinks} 处未匹配站内链接，建议核对。`);
} else {
  console.log('✔ 链接规范检查通过！');
}
