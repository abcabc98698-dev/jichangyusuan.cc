import fs from 'node:fs';
import path from 'node:path';
import { rawClusters, ContentNode, ContentGraphEdge, ContentGraph } from './raw-topics.js';
import { rawArticles } from './raw-articles.js';

const DATA_DIR = path.resolve('data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('--- 校验并生成 560 节点注册表与拓扑图谱 ---');

// 1. 注册首页
const homeNode: ContentNode = {
  id: 'home',
  kind: 'home',
  parentId: null,
  url: '/',
  title: '机场预算：月付年付费用计算与套餐选择',
  mainQuestion: '如何科学评估机场服务的首付款、月均折算、流量损耗与长期真实成本？',
  intent: '预算计算、月付年付比较、折后实付与选型决策',
  entities: ['机场预算', '月付年付', '流量倍率', '折扣核算', '续费成本', '机场榜一'],
  targetHan: 12000,
  status: 'published',
  sourceIds: ['site-contract', 'standard-billing-model']
};

const nodes: Record<string, ContentNode> = {
  home: homeNode
};
const edges: ContentGraphEdge[] = [];
const urlMap = new Map<string, string>();
urlMap.set('/', 'home');

// 2. 注册 13 顶级频道、26 二级专题、104 三级集群
let primaryCount = 0;
let secondaryCount = 0;
let clusterCount = 0;

for (const c of rawClusters) {
  if (urlMap.has(c.url)) {
    throw new Error(`Duplicate URL detected: ${c.url} in cluster ${c.id}`);
  }
  urlMap.set(c.url, c.id);

  if (c.kind === 'primary') primaryCount++;
  if (c.kind === 'secondary') secondaryCount++;
  if (c.kind === 'cluster') clusterCount++;

  nodes[c.id] = {
    id: c.id,
    kind: c.kind,
    parentId: c.parentId,
    url: c.url,
    title: c.title,
    mainQuestion: `如何系统化理解与核算${c.title}相关的核心成本与决策边界？`,
    intent: `${c.title}方法、规则、表格与决策`,
    entities: [c.title, '机场成本', '服务边界'],
    targetHan: c.kind === 'primary' ? 12000 : c.kind === 'secondary' ? 10000 : 10000,
    status: 'published',
    sourceIds: ['site-contract']
  };

  if (c.parentId) {
    edges.push({
      fromId: c.parentId,
      toId: c.id,
      relation: 'parent_child'
    });
  }
}

// 3. 注册 416 篇深度文章
const clusterArticleMap = new Map<string, number>();

for (const art of rawArticles) {
  if (urlMap.has(art.url)) {
    throw new Error(`Duplicate URL detected: ${art.url} with title ${art.title}`);
  }
  
  // Extract slug from url, e.g. /budget/first-payment-cap/ -> budget-first-payment-cap
  const slug = art.url.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const id = `art-${slug}`;
  
  if (nodes[id]) {
    throw new Error(`Duplicate ID detected: ${id}`);
  }
  urlMap.set(art.url, id);

  const parentCluster = nodes[art.clusterId];
  if (!parentCluster) {
    throw new Error(`Cluster ID not found: ${art.clusterId} for article ${art.title}`);
  }

  const currentCount = clusterArticleMap.get(art.clusterId) || 0;
  clusterArticleMap.set(art.clusterId, currentCount + 1);

  nodes[id] = {
    id,
    kind: 'article',
    parentId: art.clusterId,
    url: art.url,
    title: art.title,
    mainQuestion: art.title,
    intent: `${art.title}的核算依据、条件限制与真实步骤`,
    entities: [art.title, parentCluster.title],
    targetHan: 10000,
    status: 'published',
    sourceIds: ['billing-standards', 'real-world-scenarios']
  };

  edges.push({
    fromId: art.clusterId,
    toId: id,
    relation: 'parent_child'
  });
}

// 4. 统计与一致性严格核查
const totalNodes = Object.keys(nodes).length;
const totalArticles = rawArticles.length;

console.log(`统计结果：`);
console.log(`- 首页：1`);
console.log(`- 一级频道：${primaryCount} (预期 13)`);
console.log(`- 二级专题：${secondaryCount} (预期 26)`);
console.log(`- 三级集群：${clusterCount} (预期 104)`);
console.log(`- 深度文章：${totalArticles} (预期 416)`);
console.log(`- 聚合页总数：${1 + primaryCount + secondaryCount + clusterCount} (预期 144)`);
console.log(`- 全站节点总数：${totalNodes} (预期 560)`);

if (primaryCount !== 13) throw new Error(`一级频道数量不符合契约: ${primaryCount}`);
if (secondaryCount !== 26) throw new Error(`二级专题数量不符合契约: ${secondaryCount}`);
if (clusterCount !== 104) throw new Error(`三级集群数量不符合契约: ${clusterCount}`);
if (totalArticles !== 416) throw new Error(`文章数量不符合契约: ${totalArticles}`);
if (totalNodes !== 560) throw new Error(`全站节点总数不符合契约: ${totalNodes}`);

// 校验每个集群是否恰好拥有 4 篇文章
for (const c of rawClusters) {
  if (c.kind === 'cluster') {
    const count = clusterArticleMap.get(c.id) || 0;
    if (count !== 4) {
      throw new Error(`集群 [${c.id}] ${c.title} 下文章数量为 ${count}，必须恰为 4 篇！`);
    }
  }
}
console.log(`✔ 所有 104 个集群各包含恰好 4 篇文章，结构完美无暇！`);

// 5. 保存 registry.json & graph.json
const registryPath = path.join(DATA_DIR, 'registry.json');
fs.writeFileSync(registryPath, JSON.stringify(nodes, null, 2), 'utf-8');
console.log(`✔ 已生成注册表：${registryPath}`);

const graph: ContentGraph = { nodes, edges };
const graphPath = path.join(DATA_DIR, 'graph.json');
fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
console.log(`✔ 已生成拓扑图谱：${graphPath}`);

// 6. 生成 CONTENT_REGISTRY.md 供人工查阅与审计
let mdContent = `# 机场预算 (jichangyusuan.cc) 完整 560 节点内容注册表\n\n`;
mdContent += `> 生成时间：${new Date().toISOString()}  \n`;
mdContent += `> 规模：1 首页 + 13 一级 + 26 二级 + 104 集群 + 416 文章 = 560 节点（144 聚合页 + 416 深度文章）\n\n`;

mdContent += `| ID | 级别 | 标题 | URL | 逻辑父级 | 目标汉字 | 状态 |\n`;
mdContent += `|---|---|---|---|---|---|---|\n`;

for (const n of Object.values(nodes)) {
  mdContent += `| \`${n.id}\` | ${n.kind} | ${n.title} | \`${n.url}\` | ${n.parentId ? `\`${n.parentId}\`` : '-'} | ${n.targetHan} | ${n.status} |\n`;
}

fs.writeFileSync(path.join(DATA_DIR, 'CONTENT_REGISTRY.md'), mdContent, 'utf-8');
console.log(`✔ 已输出注册表文档：data/CONTENT_REGISTRY.md`);
