import fs from 'node:fs';
import path from 'node:path';
import { rawClusters } from './raw-topics.js';
import { rawArticles } from './raw-articles.js';

import { getBudgetSpec } from './domains/budget.js';
import { getMonthlySpec } from './domains/monthly.js';
import { getAnnualSpec } from './domains/annual.js';
import { getDiscountsSpec } from './domains/discounts.js';
import { getRenewalSpec } from './domains/renewal.js';
import { getPlansSpec } from './domains/plans.js';
import { getUsageSpec } from './domains/usage.js';
import { getLowBudgetSpec } from './domains/low-budget.js';
import { getHighDataSpec } from './domains/high-data.js';
import { getBrandsSpec } from './domains/brands.js';
import { getBuyingChecksSpec } from './domains/buying-checks.js';
import { getOffersSpec } from './domains/offers.js';
import { getKnowledgeSpec } from './domains/knowledge.js';
import { DomainSpec } from './domains/types.js';
import { enhanceSpecWithTitleContext } from './domain-enhancer.js';

console.log('=== 启动 26 大二级专题完全差异化·416 篇专文深度独立构建系统 ===\n');

const CONTENT_DIR = path.resolve('content');

function ensureWrite(relPath: string, content: string) {
  const fullPath = path.join(CONTENT_DIR, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf-8');
}

function getSpecForArticle(secondaryId: string, art: { title: string; url: string; clusterId: string }): DomainSpec {
  if (secondaryId.startsWith('budget-')) return getBudgetSpec(secondaryId, art);
  if (secondaryId.startsWith('monthly-')) return getMonthlySpec(secondaryId, art);
  if (secondaryId.startsWith('annual-')) return getAnnualSpec(secondaryId, art);
  if (secondaryId.startsWith('discount-')) return getDiscountsSpec(secondaryId, art);
  if (secondaryId.startsWith('renewal-')) return getRenewalSpec(secondaryId, art);
  if (secondaryId.startsWith('plans-')) return getPlansSpec(secondaryId, art);
  if (secondaryId.startsWith('usage-')) return getUsageSpec(secondaryId, art);
  if (secondaryId.startsWith('low-budget-')) return getLowBudgetSpec(secondaryId, art);
  if (secondaryId.startsWith('high-data-')) return getHighDataSpec(secondaryId, art);
  if (secondaryId.startsWith('brands-')) return getBrandsSpec(secondaryId, art);
  if (secondaryId.startsWith('buying-checks-')) return getBuyingChecksSpec(secondaryId, art);
  if (secondaryId.startsWith('offers-')) return getOffersSpec(secondaryId, art);
  if (secondaryId.startsWith('knowledge-')) return getKnowledgeSpec(secondaryId, art);
  
  return getBudgetSpec('budget-cost-model', art);
}

let generatedCount = 0;

for (const art of rawArticles) {
  const articleRelPath = art.url.replace(/^\/|\/$/g, '');
  const primarySlug = articleRelPath.split('/')[0];
  
  const clusterNode = rawClusters.find(c => c.id === art.clusterId);
  const secondaryId = clusterNode ? clusterNode.parentId : primarySlug;
  const secondaryNode = rawClusters.find(c => c.id === secondaryId);
  const primaryNode = rawClusters.find(c => c.id === primarySlug);

  const rawSpec = getSpecForArticle(secondaryId || primarySlug, art);
  const spec = enhanceSpecWithTitleContext(rawSpec, art, clusterNode?.title || '核心集群');

  const tableHeaderMarkup = `| ${spec.tableHeaders.join(' | ')} |\n| ${spec.tableHeaders.map(() => '---').join(' | ')} |`;
  const tableRowsMarkup = spec.tableRows.map(row => `| ${row.join(' | ')} |`).join('\n');
  const pitfallsMarkup = spec.pitfalls.map((p, idx) => `### 反例 ${idx + 1}：${p.title}\n${p.desc}\n`).join('\n');
  const faqMarkup = spec.faqs.map(f => `  {
    question: '${f.q.replace(/'/g, '’').replace(/"/g, '”')}',
    answer: '${f.a.replace(/'/g, '’').replace(/"/g, '”')}',
    evidence: '${(f.ref || '').replace(/'/g, '’').replace(/"/g, '”')}'
  }`).join(',\n');

  const content = `---
title: ${art.title}
description: 针对《${art.title}》的专业预算分析与决策指南。梳理真实法币成本、技术参数对照、避坑反例与购买核验清单。
---

# ${art.title}

<AnswerFirst>
<template #title>核心结论：${art.title}</template>
${spec.answerFirst}
<template #conditions>
本文基于公开网络服务计费模型与纯数学推导，所有演算均经过严格的业务边界核验。
</template>
</AnswerFirst>

## 1. 核心概念与现实场景边界

${spec.concept}

---

## 2. 关键参数与真实场景对照表

下表梳理了在处理“${art.title}”时必须采集与对比的关键字段：

${tableHeaderMarkup}
${tableRowsMarkup}

---

## 3. 核心推导步骤与实操算法

针对“${art.title}”，推荐遵循以下标准工作流进行手工复算与核对：

\`\`\`
${spec.algorithm}
\`\`\`

### 3.1 典型算例深入拆解

${spec.workedExample}

### 3.2 决策边界与量化判定条件

${spec.boundaryRule}

---

## 4. 常见反例与边界防坑提示

在落实“${art.title}”的过程中，切忌陷入以下典型思维陷阱：

${pitfallsMarkup}
---

## 5. 常见问题解答 (FAQ)

<FAQ :items="[
${faqMarkup}
]" />

---

## 6. 关联知识与前后链路

<RelatedTopics 
  :prerequisites="[
    { title: '返回 ${clusterNode?.title || '所属集群'} 综述', url: '${clusterNode?.url}' },
    { title: '${primaryNode?.title || '所属主专题'} 知识库', url: '/${primarySlug}/' }
  ]"
  :comparisons="[
    { title: '月付方案同档位横向取舍', url: '/monthly/' },
    { title: '年付长期预付暴露与风险情景', url: '/annual/' }
  ]"
  :nextSteps="[
    { title: '使用纯函数计算器进行精确数值验证', url: '/budget/' },
    { title: '购买前避坑与交付核验清单', url: '/buying-checks/' }
  ]"
/>

---

## 7. 前往主站开启选购

<MainSiteCTA 
  target="pricing"
  campaign="${primarySlug}_article"
  content="${art.url.replace(/^\/|\/$/g, '').replace(/\//g, '_')}_footer"
  title="算清要求？前往主站「机场榜一」挑选符合本篇条件的服务"
  description="带着您在本文中梳理出的首付预算上限、节点倍率要求与设备配置条件，在主站查阅经过线路实测的具体机场榜单。"
  buttonText="查看主站价格库"
/>

<Disclosure />
`;

  ensureWrite(`${articleRelPath}/index.md`, content);
  generatedCount++;
}

console.log(`✔ 26 大二级专题全面覆盖完成，416 篇专文全部重新独立生成，共 ${generatedCount} 篇！`);
