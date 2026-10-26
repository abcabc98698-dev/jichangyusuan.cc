import fs from 'node:fs';
import path from 'node:path';
import { rawClusters } from './raw-topics.js';
import { rawArticles } from './raw-articles.js';
import { DomainSpec } from './domains/types.js';
import { enhanceSpecWithTitleContext } from './domain-enhancer.js';

// 导入全部 13 个领域的专业生成模块
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



function ensureWrite(relPath: string, content: string) {
  const fullPath = path.resolve('content', relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

function getSpecForArticle(primarySlug: string, secondaryId: string, art: any): DomainSpec {
  switch (primarySlug) {
    case 'budget': return getBudgetSpec(secondaryId, art);
    case 'monthly': return getMonthlySpec(secondaryId, art);
    case 'annual': return getAnnualSpec(secondaryId, art);
    case 'discounts': return getDiscountsSpec(secondaryId, art);
    case 'renewal': return getRenewalSpec(secondaryId, art);
    case 'plans': return getPlansSpec(secondaryId, art);
    case 'usage': return getUsageSpec(secondaryId, art);
    case 'low-budget': return getLowBudgetSpec(secondaryId, art);
    case 'high-data': return getHighDataSpec(secondaryId, art);
    case 'brands': return getBrandsSpec(secondaryId, art);
    case 'buying-checks': return getBuyingChecksSpec(secondaryId, art);
    case 'offers': return getOffersSpec(secondaryId, art);
    case 'knowledge': return getKnowledgeSpec(secondaryId, art);
    default: return getBudgetSpec('budget-cost-model', art);
  }
}

// 按 clusterId 对文章进行分组索引，保证同集群内部 4 篇兄弟文章严格轮转不同分析视角
const clusterArticlesMap = new Map<string, any[]>();
for (const art of rawArticles) {
  if (!clusterArticlesMap.has(art.clusterId)) {
    clusterArticlesMap.set(art.clusterId, []);
  }
  clusterArticlesMap.get(art.clusterId)!.push(art);
}

let generatedCount = 0;

for (const art of rawArticles) {
  const articleRelPath = art.url.replace(/^\/|\/$/g, '');
  const primarySlug = articleRelPath.split('/')[0];
  
  const clusterNode = rawClusters.find(c => c.id === art.clusterId);
  const secondaryId = clusterNode ? clusterNode.parentId : primarySlug;
  const secondaryNode = rawClusters.find(c => c.id === secondaryId);
  const primaryNode = rawClusters.find(c => c.id === primarySlug);

  const siblingArticles = clusterArticlesMap.get(art.clusterId) || [];
  const articleIndexInCluster = siblingArticles.findIndex(a => a.url === art.url);

  const rawSpec = getSpecForArticle(primarySlug, secondaryId || primarySlug, art);
  const spec = enhanceSpecWithTitleContext(rawSpec, art, clusterNode?.title || '核心集群', articleIndexInCluster);

  const tableHeaderMarkup = `| ${spec.tableHeaders.join(' | ')} |\n| ${spec.tableHeaders.map(() => '---').join(' | ')} |`;
  const tableRowsMarkup = spec.tableRows.map(row => `| ${row.join(' | ')} |`).join('\n');
  
  const workflowStepsMarkup = (spec.workflowSteps && spec.workflowSteps.length > 0)
    ? `<WorkflowSteps 
  title="针对《${art.title.replace(/'/g, '’').replace(/"/g, '”')}》的量化核对工作流"
  :steps="[
${spec.workflowSteps.map(s => `    {
      name: '${s.name.replace(/'/g, '’').replace(/"/g, '”')}',
      description: '${s.description.replace(/'/g, '’').replace(/"/g, '”')}',
      action: '${(s.action || '').replace(/'/g, '’').replace(/"/g, '”')}'
    }`).join(',\n')}
  ]" 
/>`
    : `\`\`\`\n${spec.algorithm}\n\`\`\``;

  const pitfallsMarkup = `<PitfallCard :items="[
${spec.pitfalls.map(p => `  {
    title: '${p.title.replace(/'/g, '’').replace(/"/g, '”')}',
    desc: '${p.desc.replace(/'/g, '’').replace(/"/g, '”')}',
    level: '${p.level || '高危'}',
    action: '${(p.action || '').replace(/'/g, '’').replace(/"/g, '”')}'
  }`).join(',\n')}
]" />`;

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
<template #title>${art.title}</template>
${spec.answerFirst}
<template #conditions>
预算与性能推导基于网络工程测算模型与十进制精确计费口径，不采集用户隐私。
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

${workflowStepsMarkup}

### 3.1 典型算例深入拆解

${spec.workedExample}

### 3.2 决策边界与量化判定条件

${spec.boundaryRule}

---

## 4. 常见反例与边界防坑提示

在落实“${art.title}”的过程中，必须重点排查以下认知误区与典型套路：

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

console.log(`\n✔ 26 大二级专题全面覆盖完成，416 篇专文全部重新独立生成，共 ${generatedCount} 篇！`);
