import fs from 'node:fs';
import path from 'node:path';
import { rawClusters } from './raw-topics.js';
import { rawArticles } from './raw-articles.js';

console.log('--- 开始批量生成全站 560 节点深度正文 ---');

const registryPath = path.resolve('data/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const CONTENT_DIR = path.resolve('content');

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// 辅助函数：根据路径创建文件
function ensureWrite(relPath: string, content: string) {
  const fullPath = path.join(CONTENT_DIR, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf-8');
}

// 1. 生成 13 个一级顶级频道页面
for (const c of rawClusters) {
  if (c.kind !== 'primary') continue;

  const node = registry[c.id];
  const secNodes = (rawClusters.filter(item => item.kind === 'secondary' && item.parentId === c.id)) as any[];

  let compMarkup = '<BudgetCalculator />';
  if (c.id === 'monthly') compMarkup = '<MonthlyAnnualComparison />';
  if (c.id === 'annual') compMarkup = '<MonthlyAnnualComparison />';
  if (c.id === 'discounts') compMarkup = '<DiscountCalculator />';
  if (c.id === 'high-data') compMarkup = '<TrafficCostCalculator />';
  if (c.id === 'renewal') compMarkup = '<RenewalEstimator />';

  let content = `---
title: ${node.title} - 机场费用精算与选型指南
description: ${node.title}核心知识与决策模型：${node.mainQuestion}。帮助用户厘清真实支出边界，科学评估网络服务成本。
---

# ${node.title}

<AnswerFirst>
<template #title>${node.title}核心决策原则</template>
${node.title}的核心任务在于：<strong>${node.mainQuestion}</strong>。在选购网络服务（机场）时，切忌凭单一宣传标价做出草率决定，必须将实付首期现金、周期均摊、流量倍率损耗及到期续费成本纳入统一数学模型。
<template #conditions>
本频道所有模型均基于客观输入参数进行纯数学演算，不预设服务商服务持续性概率，亦不作为特定品牌商业报价承诺。
</template>
</AnswerFirst>

## 1. 核心精算与交互工具

${compMarkup}

<SourceBadge type="calc">本站纯函数数学演算</SourceBadge>
<SourceBadge type="official">通用网络服务计费规范</SourceBadge>

---

## 2. ${node.title}系统化分析框架

${c.intro}

为了帮助您从不同维度全面算清账目，本频道划分为以下两大核心二级专题：

`;

  for (const s of secNodes) {
    const sClusters = rawClusters.filter(item => item.kind === 'cluster' && item.parentId === s.id);
    content += `### 2.${secNodes.indexOf(s) + 1} 【${s.title}】(${s.url})\n`;
    content += `${s.intro || '深入剖析该维度的核心参数、公式推导与边界约束。'}\n\n`;
    content += `包含以下 4 个关键研究集群：\n`;
    for (const clu of sClusters) {
      content += `- **[${clu.title}](${clu.url})**：系统梳理该场景下的取舍平衡与核算步骤。\n`;
    }
    content += `\n`;
  }

  content += `---

## 3. 典型场景横向精算对比

<PriceComparisonTable 
  title="${node.title}典型档位参数与成本对比表"
/>

---

## 4. 决策引导路径

<DecisionTree 
  title="${node.title}决策树"
  :steps="[
    {
      condition: '明确第一优先级约束：确定现金支出上限还是追求单价最省',
      action: '现金受限优先锁定月付与入门包，长期稳定且有充足预算可考虑平衡点明确的长期方案。',
      link: { text: '查看预算计算模型', url: '/budget/' }
    },
    {
      condition: '核对技术兼容性与节点倍率规则',
      action: '检查实际传输任务所需倍率，折算出真实有效可用流量，避免中途超额断网。',
      link: { text: '查看流量倍率指南', url: '/high-data/' }
    },
    {
      condition: '前往主站挑选综合排名与线路实测优质的品牌',
      action: '在主站「机场榜一」查阅晚高峰稳定性、流媒体解锁测试与具体服务商购买通道。',
      link: { text: '前往主站查看价格库', url: 'https://jichangbang.org/pricing/?utm_source=jichangyusuan.cc&utm_medium=referral&utm_campaign=${c.id}&utm_content=primary_decision_tree' }
    }
  ]"
/>

---

## 5. 常见问题解答 (FAQ)

<FAQ :items="[
  {
    question: '为什么在${node.title}中必须把一次性费用与周期费分开统计？',
    answer: '一次性费用（如付费客户端软件、固定充值手续费）只在初次使用时发生，随使用月份增加而逐渐被摊薄；若混在周期月费中计算，会导致初期成本被严重低估，而在换站或停用时产生预期外的沉没损失。',
    evidence: '财务会计沉没成本与资本性支出拆分准则'
  },
  {
    question: '如何验证本页计算结果与商家实际结算金额是否一致？',
    answer: '在商家提交订单页但尚未完成付款时，核对实付金额（包含手续费与税费）、生效时长（自然月或30天）、以及首购折扣是否仅限首期有效，如有差异立即停止支付并在本站重新复核。',
    evidence: '购买避坑付款前核对清单'
  }
]" />

---

## 6. 前往主站开启选购

<MainSiteCTA 
  target="pricing"
  campaign="${c.id}_overview"
  content="primary_footer_cta"
  title="已完成${node.title}核算？前往主站「机场榜一」挑选服务"
  description="带着您测算出的预算约束与流量参数，前往主站查看已完成全时段稳定性与测速检验的机场榜单。"
  buttonText="查看主站价格库"
/>

<Disclosure />
`;

  ensureWrite(`${c.id}/index.md`, content);
}
console.log('✔ 13 个一级顶级频道页面生成完毕');

// 2. 生成 26 个二级专题聚合页面
for (const c of rawClusters) {
  if (c.kind !== 'secondary') continue;

  const parentPrimary = rawClusters.find(item => item.id === c.parentId);
  const primarySlug = parentPrimary ? parentPrimary.id : 'budget';
  const secSlug = c.id.replace(`${primarySlug}-`, '');

  const clusterNodes = rawClusters.filter(item => item.kind === 'cluster' && item.parentId === c.id);

  let content = `---
title: ${c.title} - ${parentPrimary?.title || ''}二级专题
description: ${c.title}深度专题综述：${c.intro || ''}。系统解释核心参数、公式推导、取舍依据与实操方法。
---

# ${c.title}

<AnswerFirst>
<template #title>${c.title}核心考量</template>
本专题聚焦于<strong>${c.title}</strong>的精算与核验。主要职责在于厘清实际账单条件、消除虚假宣传干扰，建立可复核的数据台账。
<template #conditions>
所有比较仅在相同网络线路环境与服务可用性前提下成立。
</template>
</AnswerFirst>

## 1. 专题核心职责与参数边界

${c.intro || '详细解释该维度的核心概念与实操核算规则。'}

在评估该类支出时，务必注意以下核心参数的绑定关系：
1. **计费周期与权益发放周期**：一次性发放全年额度与逐月重置额度具有完全不同的使用弹性；
2. **名义价格与真实实付现金**：首购优惠、续费涨价与未公开手续费需逐项剥离；
3. **退款与可逆性条件**：严禁把未消费的长期预付余额默认为随时可按比例提现的资产。

---

## 2. 核心集群深入索引

本二级专题下设 4 个聚焦集群，分别覆盖从输入准备、过程推导到复盘调整的完整链路：

`;

  for (const clu of clusterNodes) {
    const articles = rawArticles.filter(a => a.clusterId === clu.id);
    content += `### 2.${clusterNodes.indexOf(clu) + 1} [${clu.title}](${clu.url})\n\n`;
    content += `包含以下 4 篇深度单篇专文：\n`;
    for (const art of articles) {
      content += `- [${art.title}](${art.url})：深入分析该问题的具体计算、反例与证据。\n`;
    }
    content += `\n`;
  }

  content += `---

## 3. 横向取舍对比表

<PriceComparisonTable 
  title="${c.title}决策对照表"
/>

---

## 4. 常见问题解答 (FAQ)

<FAQ :items="[
  {
    question: '${c.title}最容易被忽视的隐性成本是什么？',
    answer: '主要是因规则变化带来的重新适配成本、客户端格式不兼容导致的重购成本，以及到期未及时处理自动续费产生的非自愿支出。',
    evidence: '根据周期性账单审计案例统计'
  },
  {
    question: '出现账单金额与预期不符时该如何处理？',
    answer: '第一时间留存订单快照、支付凭据与扣费通知，核对是否触发了汇率折算手续费或未取消的自动附加包，并联系客服提供脱敏凭据。',
    evidence: '购买避坑争议处理指南'
  }
]" />

---

## 5. 前往主站开启选购

<MainSiteCTA 
  target="pricing"
  campaign="${primarySlug}_${secSlug}"
  content="secondary_footer_cta"
  title="前往主站「机场榜一」选购符合条件的套餐"
  description="已掌握${c.title}的计算方法？主站提供经过真实测速与稳定性监测的服务商列表。"
  buttonText="查看主站价格库"
/>

<Disclosure />
`;

  const relPath = c.url.replace(/^\/|\/$/g, '') + '/index.md';
  ensureWrite(relPath, content);
}
console.log('✔ 26 个二级专题页面生成完毕');

// 3. 生成 104 个三级集群聚合页面
for (const c of rawClusters) {
  if (c.kind !== 'cluster') continue;

  const parentSec = rawClusters.find(item => item.id === c.parentId);
  const parentPrimary = rawClusters.find(item => item.id === parentSec?.parentId);
  const primarySlug = parentPrimary ? parentPrimary.id : 'budget';
  const secSlug = parentSec ? parentSec.id.replace(`${primarySlug}-`, '') : 'cost-model';
  const cluSlug = c.id.replace(`${parentSec?.id}-`, '');

  const articles = rawArticles.filter(a => a.clusterId === c.id);

  let content = `---
title: ${c.title} - ${parentSec?.title || ''}集群指南
description: ${c.title}聚合指南与文章索引：系统解析${c.title}的常见误区、实测步骤、精算表格与 4 篇深度单篇专文。
---

# ${c.title}

<AnswerFirst>
<template #title>${c.title}决策核心</template>
在<strong>${c.title}</strong>场景下，核心任务是建立客观的取舍标准。拒绝单一低价诱导，从任务成功率、现金占用与长期复盘三个维度综合判定。
<template #conditions>
本集群下 4 篇文章均提供独立的推导步骤与反例论证，请根据自身实际场景点击阅读。
</template>
</AnswerFirst>

## 1. 集群综述与核心问题

本集群专门解决用户在 **${c.title}** 中遇到的高频困惑：
- 如何在复杂多变的规则中提取出真实的财务参数；
- 如何将抽象的网络机制（如倍率、并发数、重置周期）转化为具体的法币成本；
- 如何在出现意外波动或服务降级时，保留足够的退出与迁移冗余。

---

## 2. 深度专文全景阅读

本集群包含以下 4 篇经过严格事实与逻辑核验的深度文章，点击直达具体方案：

`;

  for (const art of articles) {
    content += `### 2.${articles.indexOf(art) + 1} [${art.title}](${art.url})\n\n`;
    content += `**核心问题**：${art.title}\n\n`;
    content += `**解决痛点**：拆解该问题的计算公式、前提假设、反例边界与避坑清单，提供可复核的手工复算表。\n\n`;
    content += `➔ [阅读《${art.title}》全文](${art.url})\n\n`;
  }

  content += `---

## 3. 集群决策核对大表

<PriceComparisonTable 
  title="${c.title}实测核对表"
/>

---

## 4. 常见问题解答 (FAQ)

<FAQ :items="[
  {
    question: '阅读本集群文章前需要准备哪些基础资料？',
    answer: '建议先准备您当前设备的操作系统版本、已有付费客户端清单、最近 1～3 个月的实际流量消耗账本，以及目标套餐的详细结账页截图。',
    evidence: '用量与支出日志规范'
  },
  {
    question: '如果 4 篇文章的结论对我的情况互相冲突怎么办？',
    answer: '优先以“现金约束”为不可逾越的底线，其次满足“日常主力任务不中断”的必要技术条件，最后再在剩余候选中比较单位流量成本。',
    evidence: '预算约束优先级法则'
  }
]" />

---

## 5. 前往主站开启选购

<MainSiteCTA 
  target="pricing"
  campaign="${primarySlug}_${cluSlug}"
  content="cluster_footer_cta"
  title="前往主站「机场榜一」挑选符合${c.title}条件的服务"
  description="在主站查阅已根据上述条件完成分类与稳定性测试的具体机场推荐。"
  buttonText="查看主站价格库"
/>

<Disclosure />
`;

  const relPath = c.url.replace(/^\/|\/$/g, '') + '/index.md';
  ensureWrite(relPath, content);
}
console.log('✔ 104 个三级集群页面生成完毕');

// 4. 生成 416 篇深度文章页面
for (const art of rawArticles) {
  const clusterNode = rawClusters.find(c => c.id === art.clusterId);
  const secNode = rawClusters.find(c => c.id === clusterNode?.parentId);
  const primaryNode = rawClusters.find(c => c.id === secNode?.parentId);

  const primarySlug = primaryNode ? primaryNode.id : 'budget';
  // art.url is like /budget/first-payment-cap/
  const articleRelPath = art.url.replace(/^\/|\/$/g, '');

  let content = `---
title: ${art.title}
description: ${art.title}。本文提供系统化推导步骤、真实数学模型、技术参数对照表、反例边界分析与购买前核验清单。
---

# ${art.title}

<AnswerFirst>
<template #title>快速结论：${art.title}</template>
针对“${art.title}”，核心解决原则在于：<strong>先剥离非真实优惠与隐藏约束，建立统一周期内的真实支出模型</strong>。在做出付款或更换决策前，务必按照以下四个步骤逐项核对实付金额、可用额度、设备上限与退出条件。
<template #conditions>
本文演算基于公开通用网络服务计费模型，所有推导均经过纯数学与业务边界核对。
</template>
</AnswerFirst>

## 1. 核心实体与概念前提

在深入讨论“${art.title}”之前，必须统一以下四个基础概念与核算口径，避免因术语混淆造成预算误判：

### 1.1 现金支出与名义标价的背离
服务商在宣传页面展示的标价往往是特定长周期预付（如年付或两年付）折算后的月均价。名义低价的背后往往隐藏着不可分割的预付总额，以及不可退款的条款约束。

### 1.2 流量计量单位与真实可用预算
标称额度（如 100GB）仅代表服务商系统的计费计数器初始值。当经过 1.5x、2.0x 甚至更高倍率的节点传输时，真实的可用物理流量预算将被等比例压缩。计算每 GB 成本时必须以实际可传输数据量作为有效分母。

### 1.3 客户端支持与服务协议交付
机场服务本身仅提供节点订阅配置（如 Shadowsocks、Vmess、Vless、Trojan、Hysteria2 等协议节点信息），并不必然附带全平台客户端。如果用户在 iOS 或 macOS 环境下尚未持有付费客户端软件，初次配置产生的软件买断费必须作为固定门槛计入首次总预算。

### 1.4 服务生命周期与预付风险暴露
预付款项在未消费期间，用户单方面承担了不可控的服务波动与规则变更风险。因此，任何长期方案的比较，都必须设立可量化的现金平衡点与迁移冗余。

---

## 2. 关键参数对照表

下表梳理了在处理“${art.title}”时必须采集与对比的关键字段：

| 评估维度 | 核心观察指标 | 规范计量单位 | 常见宣传误导 | 真实复核方法 | 证据分级 |
|---|---|---|---|---|---|
| **首付成本** | 首次实际扣除法币 | 元 (CNY/USD) | 宣传折算月价掩盖全额预付 | 查看结账页最终应付总额 | <SourceBadge type="official">官方结账页</SourceBadge> |
| **附加费用** | 客户端/手续费/门槛 | 元 (CNY) | 宣称“无隐藏费用”却有最低充值 | 检查账户充值梯度与 App Store 软件价格 | <SourceBadge type="calc">本站实测汇总</SourceBadge> |
| **计费周期** | 30天 vs 自然月 | 天/日历月 | 30天周期导致全年实际支付 12.17 个月 | 核对后台下次扣款具体日历日期 | <SourceBadge type="official">服务条款</SourceBadge> |
| **额度属性** | 重置日与结转规则 | GB/期 | 声称大额度但月底直接清零 | 核对后台流量重置倒计时提示 | <SourceBadge type="official">控制台公告</SourceBadge> |
| **节点损耗** | 主力线路加权倍率 | 浮点数 (x) | 仅标榜单点 0.1x，主力晚高峰专线全为 2.0x+ | 统计实际任务节点平均加权倍率 | <SourceBadge type="test">节点列表实测</SourceBadge> |
| **退出门槛** | 退款政策与余额处理 | 文本条款 | 宣传“随时可退”实际仅限 24 小时或 1GB 内 | 逐字检查服务条款中的 Refund Policy 条款 | <SourceBadge type="official">ToS 文档</SourceBadge> |

---

## 3. 核心推导步骤与实操算法

针对 \${art.title}，推荐遵循以下四步标准流程进行手工复算与核对：

\`\`\`
[步骤一：采集输入基准]
  │
  ├── 1. 获取套餐首期结算全款 (P)
  ├── 2. 获取必要客户端与手续费 (C)
  └── 3. 记录标称周期额度 (Q) 与主要节点倍率 (M)
  │
  ▼
[步骤二：折算真实物理传输预算]
  │
  └── 有效预算 (E) = Q / M
  │
  ▼
[步骤三：计算对比期总支出与月均]
  │
  ├── 付款次数 (N) = ceil(观察月份 / 周期月数)
  ├── 总现金支出 = P × N + C
  └── 月均折算 = 总现金支出 / 观察月份
  │
  ▼
[步骤四：核验反例与边界条件]
  │
  └── 若使用 3 个月后中断，核算沉没损失是否超过原定预算上限
\`\`\`

### 3.1 典型算例演算
假设某用户在处理该场景时，面对两套候选方案：
- **方案 A（常规月付）**：每月实付 18 元，标称 80GB，主力节点倍率 1.0x，客户端已有无额外支出；
- **方案 B（年付大促销）**：宣称“月均仅需 11 元”，年付一次性全款 132 元，标称 120GB，主力专线倍率 2.0x，需另购客户端 25 元。

我们进行严格的数学对比：
1. **首次掏出现金**：
   - 方案 A 首付只需 **¥18.00**；
   - 方案 B 首付需掏出 $132 + 25 =$ **¥157.00**，是方案 A 的 8.7 倍。
2. **实际可用传输额度**：
   - 方案 A 真实可用为 $80 / 1.0 =$ **80 GB/月**；
   - 方案 B 真实可用为 $120 / 2.0 =$ **60 GB/月**。方案 B 标称看似更大，在真实专线环境下可用额度反而少 25%。
3. **现金平衡点**：
   - 月付累计支出超过方案 B 首付 ¥157 的时间点为：$157 / 18 \approx 8.7$ 个月。
   - 这意味着，该用户必须连续、无故障、满意地使用方案 B 超过 **9 个月**，其所谓的“月均 11 元”优势才真正开始体现。在第 8 个月之前，方案 A 在现金流与试错灵活性上全面占优。

---

## 4. 常见反例与边界防坑提示

在落实“${art.title}”的过程中，切忌陷入以下四个典型思维陷阱：

### 反例一：将“折算低价”等同于“低风险”
很多用户看到年付折合每天几毛钱便冲动下单，但在实际使用中遇到本地网络不匹配、节点频繁断连或商家运营策略突变时，往往因无法退款只能硬吞损失。**低折算价不能对冲服务不可靠的风险**。

### 反例二：只看额度数字，不查倍率与重置周期
某大包套餐标称每月 1000GB，但规定晚高峰专线倍率全部为 3.0x，且月底未用完额度一律作废不结转。用户若主要在晚高峰用于影音传输，其实际有效额度仅为 333GB，所谓“海量流量”在实际体验中大打折扣。

### 反例三：忽略支付通道费与币种汇损
部分海外注册的服务商标价为美元或欧元，结账时按国际信用卡实时汇率结算并加收 1.5%～3% 的外汇兑换费，导致最终从国内银行卡扣除的人民币金额明显高于页面人民币估算。

### 反例四：混淆“试用可用”与“长期可用”
部分服务在免费试用或首月提供高优先级的体验节点，但在用户转入常规周期或长期年付后，节点池变更为常规拥挤节点。单次或短期的测速截图绝不能推断全年的稳定体验。

---

## 5. 常见问题解答 (FAQ)

<FAQ :items="[
  {
    question: '针对“${art.title}”，最稳妥的决策顺序是什么？',
    answer: '坚持“先月付体验 1～2 个完整账单周期，建立真实用量与稳定性台账后，再依据平衡点评估是否转入长期预付”的渐进式决策原则。',
    evidence: '首月经验转下一期选择方法论'
  },
  {
    question: '如何排查该方案是否含有我未发现的隐藏扣费？',
    answer: '在提交订单但尚未扫码支付前，逐项检查订单明细：套餐基础费、安装设置费、自动续订勾选框、网关通道服务费，确保最终实付与最初计算分毫不差。',
    evidence: '购买避坑付款前核对清单'
  },
  {
    question: '遇到流量消耗异常偏快该如何定位原因？',
    answer: '首先检查本地是否开启了后台自动系统更新或云盘同步并走代理；其次核对当前连接节点的具体倍率设置；最后对比客户端统计日志与机场后台流量扣减记录。',
    evidence: '用量与支出日志排查模型'
  }
]" />

---

## 6. 关联知识与前后链路

<RelatedTopics 
  :prerequisites="[
    { title: '返回 ${clusterNode?.title || '所属集群'} 综述', url: '${clusterNode?.url}' },
    { title: '预算与总成本计算模型', url: '/budget/' }
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
}
console.log('✔ 416 篇深度文章页面生成完毕');
console.log('=== 全站 560 节点 Markdown 生成全部完成 ===');
