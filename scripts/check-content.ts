import fs from 'node:fs';
import path from 'node:path';
import { countChineseCharacters } from '../lib/ast-counter.js';

console.log('--- 检查正式内容 AST 汉字字数与质量 ---');

const registryPath = path.resolve('data/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const nodes = Object.values(registry) as any[];

const CONTENT_DIR = path.resolve('content');

let checkedCount = 0;
let totalHan = 0;
const reports: Array<{ id: string; url: string; title: string; han: number; status: string }> = [];

for (const n of nodes) {
  // 计算内容相对路径
  let relDir = n.url.replace(/^\/|\/$/g, '');
  let filePath = path.join(CONTENT_DIR, relDir, 'index.md');
  if (n.kind === 'home') {
    filePath = path.join(CONTENT_DIR, 'index.md');
  }

  if (fs.existsSync(filePath)) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const han = countChineseCharacters(rawContent);
    totalHan += han;
    checkedCount++;
    reports.push({
      id: n.id,
      url: n.url,
      title: n.title,
      han,
      status: n.status
    });
  }
}

console.log(`统计进度：已检查 ${checkedCount} / ${nodes.length} 个节点文档`);
console.log(`正文总汉字数（AST精确统计）：${totalHan.toLocaleString()} 汉字`);

// 生成报告保存至 reports/
const REPORT_DIR = path.resolve('reports');
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

fs.writeFileSync(
  path.join(REPORT_DIR, 'content-report.json'),
  JSON.stringify({ checkedCount, totalNodes: nodes.length, totalHan, reports }, null, 2),
  'utf-8'
);

console.log(`✔ 汉字统计报告已写入: reports/content-report.json`);
