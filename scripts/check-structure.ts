import fs from 'node:fs';
import path from 'node:path';

console.log('--- 检查全站 560 节点结构规范与层级完整性 ---');

const registryPath = path.resolve('data/registry.json');
if (!fs.existsSync(registryPath)) {
  console.error('❌ 未找到 data/registry.json，请先运行 pnpm content:plan');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const nodes = Object.values(registry) as any[];

// 1. 节点总数
if (nodes.length !== 560) {
  console.error(`❌ 全站节点总数为 ${nodes.length}，不符合 560 节点契约！`);
  process.exit(1);
}

// 2. URL 唯一性与 ID 唯一性
const urlSet = new Set<string>();
const idSet = new Set<string>();

for (const n of nodes) {
  if (urlSet.has(n.url)) {
    console.error(`❌ 发现重复 URL: ${n.url} (ID: ${n.id})`);
    process.exit(1);
  }
  urlSet.add(n.url);

  if (idSet.has(n.id)) {
    console.error(`❌ 发现重复 ID: ${n.id}`);
    process.exit(1);
  }
  idSet.add(n.id);
}

// 3. 层级计数检查
const homeCount = nodes.filter(n => n.kind === 'home').length;
const primaryCount = nodes.filter(n => n.kind === 'primary').length;
const secondaryCount = nodes.filter(n => n.kind === 'secondary').length;
const clusterCount = nodes.filter(n => n.kind === 'cluster').length;
const articleCount = nodes.filter(n => n.kind === 'article').length;

if (homeCount !== 1) {
  console.error(`❌ 首页数量错误: ${homeCount}`);
  process.exit(1);
}
if (primaryCount !== 13) {
  console.error(`❌ 一级频道数量错误: ${primaryCount} (必须为 13)`);
  process.exit(1);
}
if (secondaryCount !== 26) {
  console.error(`❌ 二级专题数量错误: ${secondaryCount} (必须为 26)`);
  process.exit(1);
}
if (clusterCount !== 104) {
  console.error(`❌ 三级集群数量错误: ${clusterCount} (必须为 104)`);
  process.exit(1);
}
if (articleCount !== 416) {
  console.error(`❌ 深度文章数量错误: ${articleCount} (必须为 416)`);
  process.exit(1);
}

// 4. 父子关系完整性闭环检查
for (const n of nodes) {
  if (n.kind === 'home') {
    if (n.parentId !== null) {
      console.error(`❌ 首页 parentId 必须为 null: ${n.parentId}`);
      process.exit(1);
    }
  } else {
    if (!n.parentId || !registry[n.parentId]) {
      console.error(`❌ 节点 ${n.id} (${n.title}) 的父节点 ${n.parentId} 不存在！`);
      process.exit(1);
    }
  }
}

// 5. 校验每个集群是否恰好拥有 4 篇文章
const clusterMap = new Map<string, number>();
for (const n of nodes) {
  if (n.kind === 'article') {
    const c = clusterMap.get(n.parentId) || 0;
    clusterMap.set(n.parentId, c + 1);
  }
}

for (const n of nodes) {
  if (n.kind === 'cluster') {
    const artCount = clusterMap.get(n.id) || 0;
    if (artCount !== 4) {
      console.error(`❌ 集群 [${n.id}] ${n.title} 文章数量为 ${artCount}，必须恰好为 4 篇！`);
      process.exit(1);
    }
  }
}

console.log(`✔ 结构检查全部通过！`);
console.log(`- 560 节点无任何 URL/ID 冲突`);
console.log(`- 13 一级 ➔ 26 二级 ➔ 104 集群 ➔ 416 文章 结构严格闭环`);
