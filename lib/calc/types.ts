/**
 * 机场预算纯函数计算库类型定义
 * 纯数学模型，不依赖任何 DOM 或后端 API
 */

export type Currency = 'CNY' | 'USD' | 'EUR' | 'HKD' | 'JPY' | 'GBP';

export type BillingCycle = 
  | 'monthly'       // 月付 (1个月)
  | 'quarterly'     // 季付 (3个月)
  | 'semiannual'    // 半年付 (6个月)
  | 'annual'        // 年付 (12个月)
  | 'biennial'      // 两年付 (24个月)
  | 'one_time';     // 一次性 / 不限时流量包

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  assumptions: string[];
}

// 1. 预算计算器输入
export interface BudgetInput {
  currency: Currency;
  planPrice: number;            // 套餐标价 (正数)
  billingCycle: BillingCycle;   // 付款周期
  comparisonMonths: number;     // 评估对比期限（月数，正整数）
  clientOneTimeCost?: number;   // 一次性客户端/软件购买费用
  paymentFeeFixed?: number;     // 支付通道固定手续费
  paymentFeeRate?: number;      // 支付通道比例手续费 (例如 0.015 表示 1.5%)
  quotaGB?: number;             // 周期流量额度 (GB)
  multiplier?: number;          // 节点倍率 (默认 1)
  actualUsageGB?: number;       // 预计月度实际消耗量 (GB)
}

export interface BudgetOutput {
  currency: Currency;
  firstPaymentCash: number;     // 首次实付现金 (含客户端与首期手续费)
  totalCashSpend: number;       // 评估期内累计实际发生的现金支出总和
  averageMonthlyCost: number;   // 评估期内月均折算成本 (不等于可按月退款)
  effectiveQuotaGB: number | null; // 经倍率换算后的周期真实可用传输额度
  costPerQuotaGB: number | null;   // 按标称额度的单位成本 (元/GB)
  costPerActualGB: number | '不可计算'; // 按实际消耗的单位成本 (用量为0时不可计算)
  paymentEventsCount: number;   // 评估期内实际发生的付款次数
  assumptions: string[];        // 演算所依据的明确假设
}

// 2. 月付与年付对比输入
export interface ComparisonInput {
  monthlyPlanPrice: number;     // 月付套餐单期实付金额
  annualPlanPrice: number;      // 年付套餐单期实付金额
  comparisonMonths: number;     // 观察月数 (例如 1~24 个月)
  monthlyExtraFee?: number;     // 月付每期附加费用（如单独手续费）
  annualExtraFee?: number;      // 年付每期附加费用
}

export interface ComparisonTimelinePoint {
  month: number;
  monthlyCumulativeCash: number;
  annualCumulativeCash: number;
  difference: number;           // monthly - annual (正数表示年付累计支出更低)
}

export interface ComparisonOutput {
  breakEvenMonth: number;       // 累计现金支出平衡点所在月份 (在该月及之后年付累计现金小于等于月付)
  timeline: ComparisonTimelinePoint[];
  annualEquivalentMonthly: number; // 年付折算月均价 (仅供参考，不代表可月付)
  firstPaymentDifference: number;  // 年付首付较月付多出的现金压力
  assumptions: string[];
}

// 3. 折扣与满减核算
export type StackingRule = 
  | 'percentage_then_fixed'  // 先打折再满减 (明确允许)
  | 'fixed_then_percentage'  // 先满减再打折 (明确允许)
  | 'single_best'            // 互斥，仅取优惠力度最大者
  | 'unknown';               // 规则未公开 / 待核验

export interface DiscountInput {
  baseAmount: number;           // 参与优惠的原始金额
  discountRate?: number;        // 百分比折扣 (例如 0.8 表示八折，即减免 20%)
  fixedOff?: number;            // 固定满减金额 (元)
  minSpendThreshold?: number;   // 满减门槛金额
  stackingRule?: StackingRule;  // 叠加次序
  isEligible?: boolean;         // 是否满足优惠资格 (如新用户/限定套餐)
}

export interface DiscountOutput {
  finalAmount: number | '待确认'; // 结算金额
  savedAmount: number | '待确认'; // 节省金额
  effectiveDiscountRate: number | null; // 综合实际折扣率
  appliedOrder: string;
  status: 'valid' | 'ineligible' | 'unknown_order' | 'error';
  explanation: string;
}

// 4. 流量与倍率成本
export interface TrafficCostInput {
  planPrice: number;            // 当期实付金额
  nominalQuotaGB: number;       // 标称计费流量 (GB)
  multiplier: number;           // 综合/主要节点倍率 (正数)
  actualUsageGB?: number;       // 实际消耗传输量 (GB)
}

export interface TrafficCostOutput {
  effectiveBudgetGB: number;    // 统一倍率下真实可传输流量预算 (标称 / 倍率)
  unitCostByQuota: number;      // 按标称额度的单位成本 (元/GB)
  unitCostByEffectiveBudget: number; // 按真实可用传输预算的单位成本
  unitCostByActualUsage: number | '不可计算'; // 按实际消耗的单位成本 (用量为0显示不可计算)
  assumptions: string[];
}

// 5. 续费与生命周期成本
export interface RenewalInput {
  currentPlanRenewalPrice: number; // 现有套餐下一期续费实付价
  accountBalance?: number;         // 账户可用非赠送现金余额
  promotionalCredit?: number;      // 赠送/不可提现体验金
  upgradePriceDiff?: number;       // 升级补差金额 (如有)
  migrationParallelMonths?: number;// 更换服务时的双订阅过渡月数
  alternativeMonthlyPrice?: number;// 替代服务的月费
}

export interface RenewalOutput {
  nextCycleNetCash: number;        // 下一期需要实际掏出的真实现金
  balanceDeducted: number;         // 抵扣的现金余额
  promoCreditDeducted: number;     // 抵扣的体验金
  migrationCostTotal: number;      // 迁移双订阅过渡期额外成本
  assumptions: string[];
}
