import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== 开始全站生产构建流水线 ===\n');

try {
  // 1. 结构与契约校验
  console.log('[1/5] 执行 560 节点结构规范检查...');
  execSync('npx tsx scripts/check-structure.ts', { stdio: 'inherit' });

  // 2. 敏感信息审计
  console.log('\n[2/5] 执行敏感信息安全审计...');
  execSync('npx tsx scripts/check-secrets.ts', { stdio: 'inherit' });

  // 3. 同步发布正文
  console.log('\n[3/5] 同步 published 正文至 site/generated/ ...');
  execSync('npx tsx scripts/prepare.ts', { stdio: 'inherit' });

  // 4. VitePress 静态 HTML 编译
  console.log('\n[4/5] 执行 VitePress 静态站点生成 (SSG)...');
  execSync('npx vitepress build site', { stdio: 'inherit' });

  // 5. Pagefind 全文检索离线索引构建
  console.log('\n[5/6] 执行 Pagefind 离线中文全文索引构建...');
  execSync('npx pagefind --site site/dist', { stdio: 'inherit' });

  // 6. 自动化技术 SEO 与外链合规审计
  console.log('\n[6/6] 执行 SEO 预防性健康与出站外链合规审计...');
  execSync('npx tsx scripts/audit-seo.ts', { stdio: 'inherit' });

  // 7. 产物完整性检查
  const distDir = path.resolve('site/dist');
  const indexHtml = path.join(distDir, 'index.html');
  const pagefindDir = path.join(distDir, 'pagefind');
  const sitemapXml = path.join(distDir, 'sitemap.xml');

  if (!fs.existsSync(indexHtml)) {
    throw new Error('构建产物缺失 index.html');
  }
  if (!fs.existsSync(pagefindDir)) {
    throw new Error('构建产物缺失 pagefind 索引目录');
  }
  if (!fs.existsSync(sitemapXml)) {
    throw new Error('构建产物缺失 sitemap.xml');
  }

  console.log('\n=======================================');
  console.log('✔ 全量静态构建与 Pagefind 索引全部成功完成！');
  console.log(`- 产物目录: ${distDir}`);
  console.log(`- 首页 HTML: ${indexHtml}`);
  console.log(`- Sitemap: ${sitemapXml}`);
  console.log(`- Pagefind: ${pagefindDir}`);
  console.log('=======================================\n');

} catch (err: any) {
  console.error('\n❌ 构建流水线失败:', err.message);
  process.exit(1);
}
