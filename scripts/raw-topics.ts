import fs from 'node:fs';
import path from 'node:path';

export interface ContentNode {
  id: string;
  kind: 'home' | 'primary' | 'secondary' | 'cluster' | 'article';
  parentId: string | null;
  url: string;
  title: string;
  mainQuestion: string;
  intent: string;
  entities: string[];
  targetHan: number;
  status: 'not_started' | 'research' | 'drafting' | 'reviewed' | 'published' | 'blocked';
  sourceIds: string[];
}

export interface ContentGraphEdge {
  fromId: string;
  toId: string;
  relation: 'parent_child' | 'prerequisite' | 'evidence' | 'compare' | 'next_step' | 'commercial_handoff';
}

export interface ContentGraph {
  nodes: Record<string, ContentNode>;
  edges: ContentGraphEdge[];
}

// 416 Articles raw specification as given in the prompt appendix
export interface ArticleRawSpec {
  title: string;
  url: string;
  clusterId: string;
}

export const rawClusters = [
  // 1. Budget
  { id: 'budget', title: '预算计算', url: '/budget/', parentId: 'home', kind: 'primary' as const, intro: '把用户输入变成可复算的支出模型，不发布另一份综合机场榜。' },
  { id: 'budget-cost-model', title: '预算与总成本', url: '/budget/cost-model/', parentId: 'budget', kind: 'secondary' as const, intro: '核对用户真正可支配的预算及纳入成本的项目。' },
  { id: 'budget-cost-model-upfront', title: '首次支出与现金约束', url: '/budget/cost-model/upfront/', parentId: 'budget-cost-model', kind: 'cluster' as const },
  { id: 'budget-cost-model-horizon', title: '比较期限与现金流', url: '/budget/cost-model/horizon/', parentId: 'budget-cost-model', kind: 'cluster' as const },
  { id: 'budget-cost-model-hidden-costs', title: '附加费用与不确定项', url: '/budget/cost-model/hidden-costs/', parentId: 'budget-cost-model', kind: 'cluster' as const },
  { id: 'budget-cost-model-sensitivity', title: '情景分析与约束', url: '/budget/cost-model/sensitivity/', parentId: 'budget-cost-model', kind: 'cluster' as const },
  
  { id: 'budget-calculator-method', title: '计算器与结果校验', url: '/budget/calculator-method/', parentId: 'budget', kind: 'secondary' as const, intro: '解释输入、公式、误差和复验，不替代真实套餐资料。' },
  { id: 'budget-calculator-method-inputs', title: '输入字段与单位', url: '/budget/calculator-method/inputs/', parentId: 'budget-calculator-method', kind: 'cluster' as const },
  { id: 'budget-calculator-method-formulas', title: '公式与适用前提', url: '/budget/calculator-method/formulas/', parentId: 'budget-calculator-method', kind: 'cluster' as const },
  { id: 'budget-calculator-method-verification', title: '误差与人工复算', url: '/budget/calculator-method/verification/', parentId: 'budget-calculator-method', kind: 'cluster' as const },
  { id: 'budget-calculator-method-export', title: '结果解释与方案交接', url: '/budget/calculator-method/export/', parentId: 'budget-calculator-method', kind: 'cluster' as const },

  // 2. Monthly
  { id: 'monthly', title: '月付比较', url: '/monthly/', parentId: 'home', kind: 'primary' as const, intro: '比较真正按月购买的条件和同周期取舍，费用通用公式归预算计算。' },
  { id: 'monthly-rules', title: '月付资格与账单条件', url: '/monthly/monthly-rules/', parentId: 'monthly', kind: 'secondary' as const, intro: '判断能否月付及每次付款实际得到什么。' },
  { id: 'monthly-rules-true-monthly', title: '真月付识别', url: '/monthly/monthly-rules/true-monthly/', parentId: 'monthly-rules', kind: 'cluster' as const },
  { id: 'monthly-rules-monthly-quota', title: '当期额度与结转', url: '/monthly/monthly-rules/monthly-quota/', parentId: 'monthly-rules', kind: 'cluster' as const },
  { id: 'monthly-rules-monthly-access', title: '月付功能和连接约束', url: '/monthly/monthly-rules/monthly-access/', parentId: 'monthly-rules', kind: 'cluster' as const },
  { id: 'monthly-rules-monthly-orders', title: '月付订单与停止购买', url: '/monthly/monthly-rules/monthly-orders/', parentId: 'monthly-rules', kind: 'cluster' as const },

  { id: 'monthly-choice', title: '同预算月付选择', url: '/monthly/monthly-choice/', parentId: 'monthly', kind: 'secondary' as const, intro: '用具体使用约束筛选月付，不重复全站综合推荐。' },
  { id: 'monthly-choice-starter-monthly', title: '首次与轻度使用', url: '/monthly/monthly-choice/starter-monthly/', parentId: 'monthly-choice', kind: 'cluster' as const },
  { id: 'monthly-choice-matched-comparison', title: '同档位横向取舍', url: '/monthly/monthly-choice/matched-comparison/', parentId: 'monthly-choice', kind: 'cluster' as const },
  { id: 'monthly-choice-month-to-flex', title: '月付与其他付费方式', url: '/monthly/monthly-choice/month-to-flex/', parentId: 'monthly-choice', kind: 'cluster' as const },
  { id: 'monthly-choice-monthly-review', title: '月度复盘与调整', url: '/monthly/monthly-choice/monthly-review/', parentId: 'monthly-choice', kind: 'cluster' as const },

  // 3. Annual
  { id: 'annual', title: '年付分析', url: '/annual/', parentId: 'home', kind: 'primary' as const, intro: '分析预付承诺、可用证据和长周期情景，不把低折算价当稳定性保证。' },
  { id: 'annual-commitment', title: '年付总价与承诺', url: '/annual/annual-commitment/', parentId: 'annual', kind: 'secondary' as const, intro: '看清预付期限、权益和不能推断的事项。' },
  { id: 'annual-commitment-annual-total', title: '实际预付和折算', url: '/annual/annual-commitment/annual-total/', parentId: 'annual-commitment', kind: 'cluster' as const },
  { id: 'annual-commitment-annual-entitlements', title: '权益与额度周期', url: '/annual/annual-commitment/annual-entitlements/', parentId: 'annual-commitment', kind: 'cluster' as const },
  { id: 'annual-commitment-annual-uncertainty', title: '未知与承诺边界', url: '/annual/annual-commitment/annual-uncertainty/', parentId: 'annual-commitment', kind: 'cluster' as const },
  { id: 'annual-commitment-annual-fit', title: '年付适用性', url: '/annual/annual-commitment/annual-fit/', parentId: 'annual-commitment', kind: 'cluster' as const },

  { id: 'annual-scenarios', title: '长周期比较与复盘', url: '/annual/annual-scenarios/', parentId: 'annual', kind: 'secondary' as const, intro: '按假设比较结果并监测证据变化，不虚构服务持续概率。' },
  { id: 'annual-scenarios-break-even', title: '使用时长与平衡点', url: '/annual/annual-scenarios/break-even/', parentId: 'annual-scenarios', kind: 'cluster' as const },
  { id: 'annual-scenarios-prepay-exposure', title: '预付暴露与情景', url: '/annual/annual-scenarios/prepay-exposure/', parentId: 'annual-scenarios', kind: 'cluster' as const },
  { id: 'annual-scenarios-annual-audit', title: '周期内核对', url: '/annual/annual-scenarios/annual-audit/', parentId: 'annual-scenarios', kind: 'cluster' as const },
  { id: 'annual-scenarios-annual-renew-choice', title: '首年经验转成下一期选择', url: '/annual/annual-scenarios/annual-renew-choice/', parentId: 'annual-scenarios', kind: 'cluster' as const },

  // 4. Discounts
  { id: 'discounts', title: '折扣核算', url: '/discounts/', parentId: 'home', kind: 'primary' as const, intro: '负责优惠算术和资格判定；当前活动与代码来源归优惠情报。' },
  { id: 'discount-math', title: '折扣公式与适用金额', url: '/discounts/discount-math/', parentId: 'discounts', kind: 'secondary' as const, intro: '先明确优惠类型和计算对象，再展示算术。' },
  { id: 'discount-math-percentage', title: '折扣与折后金额', url: '/discounts/discount-math/percentage/', parentId: 'discount-math', kind: 'cluster' as const },
  { id: 'discount-math-fixed-discount', title: '满减与固定减免', url: '/discounts/discount-math/fixed-discount/', parentId: 'discount-math', kind: 'cluster' as const },
  { id: 'discount-math-stacking', title: '叠加次序和限制', url: '/discounts/discount-math/stacking/', parentId: 'discount-math', kind: 'cluster' as const },
  { id: 'discount-math-bonus-value', title: '赠送权益的价值', url: '/discounts/discount-math/bonus-value/', parentId: 'discount-math', kind: 'cluster' as const },

  { id: 'discount-validation', title: '资格与结算复核', url: '/discounts/discount-validation/', parentId: 'discounts', kind: 'secondary' as const, intro: '检查计算前提、订单差额和误用规则。' },
  { id: 'discount-validation-eligibility', title: '使用者与套餐资格', url: '/discounts/discount-validation/eligibility/', parentId: 'discount-validation', kind: 'cluster' as const },
  { id: 'discount-validation-checkout', title: '结算结果与支付', url: '/discounts/discount-validation/checkout/', parentId: 'discount-validation', kind: 'cluster' as const },
  { id: 'discount-validation-savings', title: '节省金额的正确解释', url: '/discounts/discount-validation/savings/', parentId: 'discount-validation', kind: 'cluster' as const },
  { id: 'discount-validation-audit-examples', title: '算例与反例', url: '/discounts/discount-validation/audit-examples/', parentId: 'discount-validation', kind: 'cluster' as const },

  // 5. Renewal
  { id: 'renewal', title: '续费成本', url: '/renewal/', parentId: 'home', kind: 'primary' as const, intro: '以已有订阅和账单为前提处理下一期费用，不重复首次选购。' },
  { id: 'renewal-next-cycle', title: '下一周期与账户权益', url: '/renewal/next-cycle/', parentId: 'renewal', kind: 'secondary' as const, intro: '核对续期金额、时间和已存权益。' },
  { id: 'renewal-next-cycle-renewal-price', title: '续费价格与资格', url: '/renewal/next-cycle/renewal-price/', parentId: 'renewal-next-cycle', kind: 'cluster' as const },
  { id: 'renewal-next-cycle-renewal-time', title: '期限与续费时点', url: '/renewal/next-cycle/renewal-time/', parentId: 'renewal-next-cycle', kind: 'cluster' as const },
  { id: 'renewal-next-cycle-balance', title: '余额、抵扣和优惠', url: '/renewal/next-cycle/balance/', parentId: 'renewal-next-cycle', kind: 'cluster' as const },
  { id: 'renewal-next-cycle-billing-control', title: '扣费设置与记录', url: '/renewal/next-cycle/billing-control/', parentId: 'renewal-next-cycle', kind: 'cluster' as const },

  { id: 'renewal-lifecycle', title: '升级、迁移与退出预算', url: '/renewal/lifecycle/', parentId: 'renewal', kind: 'secondary' as const, intro: '把后续成本和可恢复性纳入决策。' },
  { id: 'renewal-lifecycle-upgrade', title: '升级补差', url: '/renewal/lifecycle/upgrade/', parentId: 'renewal-lifecycle', kind: 'cluster' as const },
  { id: 'renewal-lifecycle-migration-cost', title: '迁移费用', url: '/renewal/lifecycle/migration-cost/', parentId: 'renewal-lifecycle', kind: 'cluster' as const },
  { id: 'renewal-lifecycle-exit', title: '退出和退款条件', url: '/renewal/lifecycle/exit/', parentId: 'renewal-lifecycle', kind: 'cluster' as const },
  { id: 'renewal-lifecycle-retention-decision', title: '续费复盘与决策', url: '/renewal/lifecycle/retention-decision/', parentId: 'renewal-lifecycle', kind: 'cluster' as const },

  // 6. Plans
  { id: 'plans', title: '价格套餐', url: '/plans/', parentId: 'home', kind: 'primary' as const, intro: '维护套餐结构化资料与筛选条件；主站负责综合推荐和购买，本站不复制同一榜单。' },
  { id: 'plans-plan-records', title: '价格资料与规则登记', url: '/plans/plan-records/', parentId: 'plans', kind: 'secondary' as const, intro: '把公开套餐转换为可追溯、可比较的记录。' },
  { id: 'plans-plan-records-record-fields', title: '价格字段规范', url: '/plans/plan-records/record-fields/', parentId: 'plans-plan-records', kind: 'cluster' as const },
  { id: 'plans-plan-records-traffic-fields', title: '流量字段规范', url: '/plans/plan-records/traffic-fields/', parentId: 'plans-plan-records', kind: 'cluster' as const },
  { id: 'plans-plan-records-feature-fields', title: '非价格限制字段', url: '/plans/plan-records/feature-fields/', parentId: 'plans-plan-records', kind: 'cluster' as const },
  { id: 'plans-plan-records-price-history', title: '价格快照与变更', url: '/plans/plan-records/price-history/', parentId: 'plans-plan-records', kind: 'cluster' as const },

  { id: 'plans-plan-discovery', title: '条件筛选与主站承接', url: '/plans/plan-discovery/', parentId: 'plans', kind: 'secondary' as const, intro: '把用户条件转成透明候选，不制造无依据的综合评分。' },
  { id: 'plans-plan-discovery-filters', title: '筛选器与结果', url: '/plans/plan-discovery/filters/', parentId: 'plans-plan-discovery', kind: 'cluster' as const },
  { id: 'plans-plan-discovery-comparison-view', title: '对比表阅读', url: '/plans/plan-discovery/comparison-view/', parentId: 'plans-plan-discovery', kind: 'cluster' as const },
  { id: 'plans-plan-discovery-eligibility-results', title: '候选解释', url: '/plans/plan-discovery/eligibility-results/', parentId: 'plans-plan-discovery', kind: 'cluster' as const },
  { id: 'plans-plan-discovery-purchase-handoff', title: '购买前复核与转介', url: '/plans/plan-discovery/purchase-handoff/', parentId: 'plans-plan-discovery', kind: 'cluster' as const },

  // 7. Usage
  { id: 'usage', title: '用量案例', url: '/usage/', parentId: 'home', kind: 'primary' as const, intro: '基于记录和明确假设复盘使用，不把演算示例包装成真实用户经历。' },
  { id: 'usage-case-method', title: '记录与案例方法', url: '/usage/case-method/', parentId: 'usage', kind: 'secondary' as const, intro: '记录使用场景、测量口径、隐私和误差。' },
  { id: 'usage-case-method-diary', title: '用量与支出日志', url: '/usage/case-method/diary/', parentId: 'usage-case-method', kind: 'cluster' as const },
  { id: 'usage-case-method-workload', title: '任务用量拆分', url: '/usage/case-method/workload/', parentId: 'usage-case-method', kind: 'cluster' as const },
  { id: 'usage-case-method-quality', title: '样本误差与异常', url: '/usage/case-method/quality/', parentId: 'usage-case-method', kind: 'cluster' as const },
  { id: 'usage-case-method-privacy', title: '案例授权与脱敏', url: '/usage/case-method/privacy/', parentId: 'usage-case-method', kind: 'cluster' as const },

  { id: 'usage-case-decisions', title: '任务场景与调整复盘', url: '/usage/case-decisions/', parentId: 'usage', kind: 'secondary' as const, intro: '把实际用量变化转成具体选择，不重复套餐数据库。' },
  { id: 'usage-case-decisions-light-users', title: '轻度与间歇使用', url: '/usage/case-decisions/light-users/', parentId: 'usage-case-decisions', kind: 'cluster' as const },
  { id: 'usage-case-decisions-mixed-users', title: '多任务与多设备', url: '/usage/case-decisions/mixed-users/', parentId: 'usage-case-decisions', kind: 'cluster' as const },
  { id: 'usage-case-decisions-changing-users', title: '波动与阶段变化', url: '/usage/case-decisions/changing-users/', parentId: 'usage-case-decisions', kind: 'cluster' as const },
  { id: 'usage-case-decisions-review-results', title: '案例结论与局限', url: '/usage/case-decisions/review-results/', parentId: 'usage-case-decisions', kind: 'cluster' as const },

  // 8. Low Budget
  { id: 'low-budget', title: '低预算方案', url: '/low-budget/', parentId: 'home', kind: 'primary' as const, intro: '在现金和功能约束下减少不适配支出，不以最低标价代替选型。' },
  { id: 'low-budget-budget-constraints', title: '预算下限与需求排序', url: '/low-budget/budget-constraints/', parentId: 'low-budget', kind: 'secondary' as const, intro: '先确认不可妥协条件，再选择可接受的取舍。' },
  { id: 'low-budget-budget-constraints-minimal-spend', title: '首次支出控制', url: '/low-budget/budget-constraints/minimal-spend/', parentId: 'low-budget-budget-constraints', kind: 'cluster' as const },
  { id: 'low-budget-budget-constraints-must-haves', title: '必要条件与删减', url: '/low-budget/budget-constraints/must-haves/', parentId: 'low-budget-budget-constraints', kind: 'cluster' as const },
  { id: 'low-budget-budget-constraints-light-scenarios', title: '低预算使用场景', url: '/low-budget/budget-constraints/light-scenarios/', parentId: 'low-budget-budget-constraints', kind: 'cluster' as const },
  { id: 'low-budget-budget-constraints-quality-boundaries', title: '便宜与可接受质量', url: '/low-budget/budget-constraints/quality-boundaries/', parentId: 'low-budget-budget-constraints', kind: 'cluster' as const },

  { id: 'low-budget-budget-adjustment', title: '低成本使用与升级时机', url: '/low-budget/budget-adjustment/', parentId: 'low-budget', kind: 'secondary' as const, intro: '根据实际结果调整支出，不制造廉价保证。' },
  { id: 'low-budget-budget-adjustment-reduce-waste', title: '减少额度与费用浪费', url: '/low-budget/budget-adjustment/reduce-waste/', parentId: 'low-budget-budget-adjustment', kind: 'cluster' as const },
  { id: 'low-budget-budget-adjustment-compare-budget', title: '预算内候选比较', url: '/low-budget/budget-adjustment/compare-budget/', parentId: 'low-budget-budget-adjustment', kind: 'cluster' as const },
  { id: 'low-budget-budget-adjustment-upgrade-timing', title: '追加预算与升级', url: '/low-budget/budget-adjustment/upgrade-timing/', parentId: 'low-budget-budget-adjustment', kind: 'cluster' as const },
  { id: 'low-budget-budget-adjustment-budget-risks', title: '预算约束下的购买边界', url: '/low-budget/budget-adjustment/budget-risks/', parentId: 'low-budget-budget-adjustment', kind: 'cluster' as const },

  // 9. High Data
  { id: 'high-data', title: '大流量方案', url: '/high-data/', parentId: 'home', kind: 'primary' as const, intro: '验证高用量与持续任务约束，不用大额度自动推断速度或稳定性。' },
  { id: 'high-data-demand-and-capacity', title: '大流量需求与承载条件', url: '/high-data/demand-and-capacity/', parentId: 'high-data', kind: 'secondary' as const, intro: '分清任务消耗、额度与实际完成能力。' },
  { id: 'high-data-demand-and-capacity-demand-model', title: '高用量来源', url: '/high-data/demand-and-capacity/demand-model/', parentId: 'high-data-demand-and-capacity', kind: 'cluster' as const },
  { id: 'high-data-demand-and-capacity-quota-meaning', title: '额度、倍率与重置', url: '/high-data/demand-and-capacity/quota-meaning/', parentId: 'high-data-demand-and-capacity', kind: 'cluster' as const },
  { id: 'high-data-demand-and-capacity-performance-fit', title: '持续任务条件', url: '/high-data/demand-and-capacity/performance-fit/', parentId: 'high-data-demand-and-capacity', kind: 'cluster' as const },
  { id: 'high-data-demand-and-capacity-quota-lifecycle', title: '周期内额度安排', url: '/high-data/demand-and-capacity/quota-lifecycle/', parentId: 'high-data-demand-and-capacity', kind: 'cluster' as const },

  { id: 'high-data-high-data-cost', title: '高用量成本与验证', url: '/high-data/high-data-cost/', parentId: 'high-data', kind: 'secondary' as const, intro: '用实际需求筛选方案，保留证据和失效条件。' },
  { id: 'high-data-high-data-cost-cost-ceiling', title: '预算与费用上限', url: '/high-data/high-data-cost/cost-ceiling/', parentId: 'high-data-high-data-cost', kind: 'cluster' as const },
  { id: 'high-data-high-data-cost-high-data-options', title: '购买方式比较', url: '/high-data/high-data-cost/high-data-options/', parentId: 'high-data-high-data-cost', kind: 'cluster' as const },
  { id: 'high-data-high-data-cost-task-acceptance', title: '大任务验收', url: '/high-data/high-data-cost/task-acceptance/', parentId: 'high-data-high-data-cost', kind: 'cluster' as const },
  { id: 'high-data-high-data-cost-optimization-review', title: '使用后复盘', url: '/high-data/high-data-cost/optimization-review/', parentId: 'high-data-high-data-cost', kind: 'cluster' as const },

  // 10. Brands
  { id: 'brands', title: '品牌数据库', url: '/brands/', parentId: 'home', kind: 'primary' as const, intro: '保存身份、来源和套餐事实的索引，不复制主站品牌评测全文。' },
  { id: 'brands-identity-records', title: '品牌身份与入口依据', url: '/brands/identity-records/', parentId: 'brands', kind: 'secondary' as const, intro: '区分名称、入口、主体声明和历史记录。' },
  { id: 'brands-identity-records-naming', title: '名称和身份', url: '/brands/identity-records/naming/', parentId: 'brands-identity-records', kind: 'cluster' as const },
  { id: 'brands-identity-records-official-entry', title: '官方入口核验', url: '/brands/identity-records/official-entry/', parentId: 'brands-identity-records', kind: 'cluster' as const },
  { id: 'brands-identity-records-service-identity', title: '服务提供者与声明', url: '/brands/identity-records/service-identity/', parentId: 'brands-identity-records', kind: 'cluster' as const },
  { id: 'brands-identity-records-history', title: '变更与状态', url: '/brands/identity-records/history/', parentId: 'brands-identity-records', kind: 'cluster' as const },

  { id: 'brands-evidence-maintenance', title: '套餐来源与资料维护', url: '/brands/evidence-maintenance/', parentId: 'brands', kind: 'secondary' as const, intro: '维护可追溯数据、核验状态和跨页面引用。' },
  { id: 'brands-evidence-maintenance-evidence-grades', title: '来源层级', url: '/brands/evidence-maintenance/evidence-grades/', parentId: 'brands-evidence-maintenance', kind: 'cluster' as const },
  { id: 'brands-evidence-maintenance-plan-linking', title: '品牌与套餐关系', url: '/brands/evidence-maintenance/plan-linking/', parentId: 'brands-evidence-maintenance', kind: 'cluster' as const },
  { id: 'brands-evidence-maintenance-verification-state', title: '时效与核验状态', url: '/brands/evidence-maintenance/verification-state/', parentId: 'brands-evidence-maintenance', kind: 'cluster' as const },
  { id: 'brands-evidence-maintenance-reuse-and-handoff', title: '引用与购买交接', url: '/brands/evidence-maintenance/reuse-and-handoff/', parentId: 'brands-evidence-maintenance', kind: 'cluster' as const },

  // 11. Buying Checks
  { id: 'buying-checks', title: '购买避坑', url: '/buying-checks/', parentId: 'home', kind: 'primary' as const, intro: '围绕可观察风险和购买检查，不制造恐吓、指控或法律结论。' },
  { id: 'buying-checks-before-payment', title: '付款前核对', url: '/buying-checks/before-payment/', parentId: 'buying-checks', kind: 'secondary' as const, intro: '发现宣传、费用与资格信息缺口。' },
  { id: 'buying-checks-before-payment-price-presentation', title: '价格宣传', url: '/buying-checks/before-payment/price-presentation/', parentId: 'buying-checks-before-payment', kind: 'cluster' as const },
  { id: 'buying-checks-before-payment-technical-claims', title: '功能与线路宣传', url: '/buying-checks/before-payment/technical-claims/', parentId: 'buying-checks-before-payment', kind: 'cluster' as const },
  { id: 'buying-checks-before-payment-payment-terms', title: '订单与服务条件', url: '/buying-checks/before-payment/payment-terms/', parentId: 'buying-checks-before-payment', kind: 'cluster' as const },
  { id: 'buying-checks-before-payment-source-safety', title: '来源与凭据保护', url: '/buying-checks/before-payment/source-safety/', parentId: 'buying-checks-before-payment', kind: 'cluster' as const },

  { id: 'buying-checks-after-purchase', title: '验收、纠错与退出', url: '/buying-checks/after-purchase/', parentId: 'buying-checks', kind: 'secondary' as const, intro: '保留证据、核对实际交付和可逆操作。' },
  { id: 'buying-checks-after-purchase-delivery-check', title: '交付核验', url: '/buying-checks/after-purchase/delivery-check/', parentId: 'buying-checks-after-purchase', kind: 'cluster' as const },
  { id: 'buying-checks-after-purchase-troubleshooting-boundary', title: '问题归因', url: '/buying-checks/after-purchase/troubleshooting-boundary/', parentId: 'buying-checks-after-purchase', kind: 'cluster' as const },
  { id: 'buying-checks-after-purchase-change-response', title: '规则变动处理', url: '/buying-checks/after-purchase/change-response/', parentId: 'buying-checks-after-purchase', kind: 'cluster' as const },
  { id: 'buying-checks-after-purchase-editorial-risks', title: '风险内容的可信度', url: '/buying-checks/after-purchase/editorial-risks/', parentId: 'buying-checks-after-purchase', kind: 'cluster' as const },

  // 12. Offers
  { id: 'offers', title: '优惠情报', url: '/offers/', parentId: 'home', kind: 'primary' as const, intro: '追踪公开优惠、来源、状态与变动；算术归折扣核算，不自动生成每日优惠薄页。' },
  { id: 'offers-offer-records', title: '优惠来源与现行条件', url: '/offers/offer-records/', parentId: 'offers', kind: 'secondary' as const, intro: '建立真正可以复核的优惠台账。' },
  { id: 'offers-offer-records-sources', title: '代码与公告来源', url: '/offers/offer-records/sources/', parentId: 'offers-offer-records', kind: 'cluster' as const },
  { id: 'offers-offer-records-scope', title: '优惠适用范围', url: '/offers/offer-records/scope/', parentId: 'offers-offer-records', kind: 'cluster' as const },
  { id: 'offers-offer-records-dates', title: '有效期与核验时间', url: '/offers/offer-records/dates/', parentId: 'offers-offer-records', kind: 'cluster' as const },
  { id: 'offers-offer-records-status', title: '可用状态与失效', url: '/offers/offer-records/status/', parentId: 'offers-offer-records', kind: 'cluster' as const },

  { id: 'offers-offer-monitoring', title: '变更比较与主站查询', url: '/offers/offer-monitoring/', parentId: 'offers', kind: 'secondary' as const, intro: '让用户看清条件变化，不复制活动公告全文。' },
  { id: 'offers-offer-monitoring-change-log', title: '优惠变动档案', url: '/offers/offer-monitoring/change-log/', parentId: 'offers-offer-monitoring', kind: 'cluster' as const },
  { id: 'offers-offer-monitoring-comparison', title: '活动选择说明', url: '/offers/offer-monitoring/comparison/', parentId: 'offers-offer-monitoring', kind: 'cluster' as const },
  { id: 'offers-offer-monitoring-handoff', title: '核验后查询路径', url: '/offers/offer-monitoring/handoff/', parentId: 'offers-offer-monitoring', kind: 'cluster' as const },
  { id: 'offers-offer-monitoring-governance', title: '商业关系和维护方法', url: '/offers/offer-monitoring/governance/', parentId: 'offers-offer-monitoring', kind: 'cluster' as const },

  // 13. Knowledge
  { id: 'knowledge', title: '知识百科', url: '/knowledge/', parentId: 'home', kind: 'primary' as const, intro: '解释费用、网络和证据的基本概念，为计算和选型提供前提。' },
  { id: 'knowledge-billing-literacy', title: '费用与指标基础', url: '/knowledge/billing-literacy/', parentId: 'knowledge', kind: 'secondary' as const, intro: '统一金额、计量、周期和账户概念。' },
  { id: 'knowledge-billing-literacy-payment-concepts', title: '价格、周期和权利', url: '/knowledge/billing-literacy/payment-concepts/', parentId: 'knowledge-billing-literacy', kind: 'cluster' as const },
  { id: 'knowledge-billing-literacy-traffic-units', title: '流量单位与计量', url: '/knowledge/billing-literacy/traffic-units/', parentId: 'knowledge-billing-literacy', kind: 'cluster' as const },
  { id: 'knowledge-billing-literacy-budget-reasoning', title: '比较模型与误区', url: '/knowledge/billing-literacy/budget-reasoning/', parentId: 'knowledge-billing-literacy', kind: 'cluster' as const },
  { id: 'knowledge-billing-literacy-metric-literacy', title: '性能指标理解', url: '/knowledge/billing-literacy/metric-literacy/', parentId: 'knowledge-billing-literacy', kind: 'cluster' as const },

  { id: 'knowledge-network-cost-links', title: '网络机制与选型边界', url: '/knowledge/network-cost-links/', parentId: 'knowledge', kind: 'secondary' as const, intro: '只解释影响兼容、流量、体验或费用的技术机制。' },
  { id: 'knowledge-network-cost-links-request-path', title: '服务与请求路径', url: '/knowledge/network-cost-links/request-path/', parentId: 'knowledge-network-cost-links', kind: 'cluster' as const },
  { id: 'knowledge-network-cost-links-transport', title: '传输与安全基础', url: '/knowledge/network-cost-links/transport/', parentId: 'knowledge-network-cost-links', kind: 'cluster' as const },
  { id: 'knowledge-network-cost-links-dns-routing', title: '解析、路由和本地环境', url: '/knowledge/network-cost-links/dns-routing/', parentId: 'knowledge-network-cost-links', kind: 'cluster' as const },
  { id: 'knowledge-network-cost-links-evidence-literacy', title: '资料与结论的可信度', url: '/knowledge/network-cost-links/evidence-literacy/', parentId: 'knowledge-network-cost-links', kind: 'cluster' as const }
];
