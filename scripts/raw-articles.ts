export interface ArticleEntry {
  title: string;
  url: string;
  clusterId: string;
}

export const rawArticles: ArticleEntry[] = [
  // 1. budget/cost-model/upfront
  { title: "机场预算怎么定：先分清首次能付多少与每月愿意花多少", url: "/budget/first-payment-cap/", clusterId: "budget-cost-model-upfront" },
  { title: "购买机场之外还要买客户端吗：首次使用总预算怎样计算", url: "/budget/one-time-client-cost/", clusterId: "budget-cost-model-upfront" },
  { title: "只计划使用一小段时间，怎样计算不能按月折算的实际支出", url: "/budget/temporary-budget/", clusterId: "budget-cost-model-upfront" },
  { title: "同一个人多台设备使用机场，怎样拆分固定成本与额外费用", url: "/budget/shared-device-cost/", clusterId: "budget-cost-model-upfront" },

  // budget/cost-model/horizon
  { title: "两个机场付款周期不同，怎样选择统一的成本比较期限", url: "/budget/common-comparison-period/", clusterId: "budget-cost-model-horizon" },
  { title: "按30天计费和按自然月计费，全年支出为什么可能不同", url: "/budget/thirty-days-vs-month/", clusterId: "budget-cost-model-horizon" },
  { title: "怎样画出机场付款时间线，避免平均月费掩盖集中扣款", url: "/budget/purchase-timeline/", clusterId: "budget-cost-model-horizon" },
  { title: "新旧机场同时订阅的过渡期，额外支出应该怎样记账", url: "/budget/overlapping-subscriptions/", clusterId: "budget-cost-model-horizon" },

  // budget/cost-model/hidden-costs
  { title: "支付手续费固定收费与按比例收费，怎样计入套餐成本", url: "/budget/payment-fee-entry/", clusterId: "budget-cost-model-hidden-costs" },
  { title: "流量重置和补充包费用，应该放在哪一段预算中比较", url: "/budget/reset-and-topup/", clusterId: "budget-cost-model-hidden-costs" },
  { title: "客户端买断费与机场续费怎样分开计算，避免重复计入", url: "/budget/software-service-separation/", clusterId: "budget-cost-model-hidden-costs" },
  { title: "套餐有未公开费用时，怎样给出预算区间而不是假精确报价", url: "/budget/unknown-fee-range/", clusterId: "budget-cost-model-hidden-costs" },

  // budget/cost-model/sensitivity
  { title: "实际用量上下波动时，怎样检验原来的机场预算是否仍成立", url: "/budget/usage-sensitivity/", clusterId: "budget-cost-model-sensitivity" },
  { title: "未来续费价格不确定，怎样分别计算不涨价与涨价情景", url: "/budget/renewal-price-scenarios/", clusterId: "budget-cost-model-sensitivity" },
  { title: "低单价需要高预付时，怎样同时比较现金压力和使用价值", url: "/budget/cash-vs-unit-price/", clusterId: "budget-cost-model-sensitivity" },
  { title: "预算、流量和兼容条件互相冲突时，怎样明确筛选优先级", url: "/budget/budget-constraint-order/", clusterId: "budget-cost-model-sensitivity" },

  // budget/calculator-method/inputs
  { title: "机场费用计算器应该填哪些信息，才能得到可解释的结果", url: "/budget/input-checklist/", clusterId: "budget-calculator-method-inputs" },
  { title: "元、月、天和GB混在一张表里，计算前怎样统一单位", url: "/budget/currency-units/", clusterId: "budget-calculator-method-inputs" },
  { title: "付款周期与流量重置周期不同，计算器应该怎样分别填写", url: "/budget/billing-vs-quota/", clusterId: "budget-calculator-method-inputs" },
  { title: "缺少价格、零费用和不限量有什么区别：计算器缺失值处理指南", url: "/budget/unknown-vs-zero/", clusterId: "budget-calculator-method-inputs" },

  // budget/calculator-method/formulas
  { title: "月均费用如何计算：为什么折算值不等于真实月付价格", url: "/budget/annualization-formula/", clusterId: "budget-calculator-method-formulas" },
  { title: "每GB成本应该用额度还是用量作分母：两种指标怎样同时展示", url: "/budget/effective-unit-cost/", clusterId: "budget-calculator-method-formulas" },
  { title: "月付与预付套餐的盈亏平衡点怎样算，哪些前提必须写清楚", url: "/budget/break-even-method/", clusterId: "budget-calculator-method-formulas" },
  { title: "有补充包、封顶或阶梯计费时，怎样改写简单的平均费用公式", url: "/budget/nonlinear-costs/", clusterId: "budget-calculator-method-formulas" },

  // budget/calculator-method/verification
  { title: "费用计算保留几位小数：为什么只能在明确环节四舍五入", url: "/budget/rounding-policy/", clusterId: "budget-calculator-method-verification" },
  { title: "怎样用付款记录手工复核机场计算器，找到差额出现的位置", url: "/budget/manual-reconciliation/", clusterId: "budget-calculator-method-verification" },
  { title: "预算计算器怎样测试零用量、缺失价格和超额使用等边界", url: "/budget/boundary-test-cases/", clusterId: "budget-calculator-method-verification" },
  { title: "计算结果看似便宜却不适用，怎样检查隐藏在公式里的假设", url: "/budget/assumption-audit/", clusterId: "budget-calculator-method-verification" },

  // budget/calculator-method/export
  { title: "计算器结果页应该解释哪些内容，才不只是一个最低价数字", url: "/budget/explain-cost-result/", clusterId: "budget-calculator-method-export" },
  { title: "怎样保存一次套餐比较快照，让下次续费能复现当时判断", url: "/budget/compare-snapshot/", clusterId: "budget-calculator-method-export" },
  { title: "分享预算计算结果时，哪些信息可以保留、哪些信息不应公开", url: "/budget/share-safe-result/", clusterId: "budget-calculator-method-export" },
  { title: "预算结果怎样转成选购条件：金额、周期、流量和限制清单", url: "/budget/result-to-main-site/", clusterId: "budget-calculator-method-export" },

  // 2. monthly/monthly-rules/true-monthly
  { title: "广告写每月几元，怎样确认结算时真的可以只买一个月", url: "/monthly/monthly-purchase-proof/", clusterId: "monthly-rules-true-monthly" },
  { title: "月付价、月均价和首月优惠价应该怎样辨认", url: "/monthly/monthly-price-label/", clusterId: "monthly-rules-true-monthly" },
  { title: "月付套餐有最低充值要求时，真实首次付款应该怎样比较", url: "/monthly/monthly-entry-barrier/", clusterId: "monthly-rules-true-monthly" },
  { title: "同一品牌只有部分档位能月付，怎样筛出实际可购买的选项", url: "/monthly/monthly-availability/", clusterId: "monthly-rules-true-monthly" },

  // monthly/monthly-rules/monthly-quota
  { title: "月付套餐什么时候重置流量：购买日、月初与固定日期的区别", url: "/monthly/monthly-reset-date/", clusterId: "monthly-rules-monthly-quota" },
  { title: "当月剩余流量不能结转，怎样判断是否需要降低套餐档位", url: "/monthly/unused-monthly-quota/", clusterId: "monthly-rules-monthly-quota" },
  { title: "月付流量提前用完时，续期、重置与加包应该怎样取舍", url: "/monthly/monthly-overage-options/", clusterId: "monthly-rules-monthly-quota" },
  { title: "月中购买或变更套餐时，怎样核对当期天数和可用额度", url: "/monthly/partial-month/", clusterId: "monthly-rules-monthly-quota" },

  // monthly/monthly-rules/monthly-access
  { title: "同一品牌月付入门档与高档套餐，怎样核对不是流量的差异", url: "/monthly/same-brand-feature-gap/", clusterId: "monthly-rules-monthly-access" },
  { title: "月付套餐的设备数、在线数和连接数限制怎样分别比较", url: "/monthly/monthly-device-rules/", clusterId: "monthly-rules-monthly-access" },
  { title: "选便宜月付前，怎样核对已有客户端和订阅格式是否适配", url: "/monthly/monthly-client-fit/", clusterId: "monthly-rules-monthly-access" },
  { title: "低价月付不含部分支持服务时，哪些用户需要把它列为限制", url: "/monthly/monthly-support-scope/", clusterId: "monthly-rules-monthly-access" },

  // monthly/monthly-rules/monthly-orders
  { title: "第一次买月付套餐，订单中应该保留哪些价格与周期信息", url: "/monthly/monthly-payment-record/", clusterId: "monthly-rules-monthly-orders" },
  { title: "月付是否自动续费如何确认：购买前应该查看哪些提示", url: "/monthly/monthly-auto-renew-check/", clusterId: "monthly-rules-monthly-orders" },
  { title: "下个月不再使用机场，怎样核对到期、扣款和账户余额", url: "/monthly/stop-monthly/", clusterId: "monthly-rules-monthly-orders" },
  { title: "月付付款后额度或期限不符，怎样整理证据向服务方核对", url: "/monthly/monthly-missing-delivery/", clusterId: "monthly-rules-monthly-orders" },

  // monthly/monthly-choice/starter-monthly
  { title: "第一次使用机场先买一个月，怎样安排体验和验收任务", url: "/monthly/beginner-one-month/", clusterId: "monthly-choice-starter-monthly" },
  { title: "每月主要查资料和偶尔使用，月付入门档应该重点看什么", url: "/monthly/light-monthly-use/", clusterId: "monthly-choice-starter-monthly" },
  { title: "短期项目需要网络服务，怎样比较月付方案与项目结束时间", url: "/monthly/short-project-monthly/", clusterId: "monthly-choice-starter-monthly" },
  { title: "有些月份不用机场，按需购买月付有哪些需要核对的条件", url: "/monthly/irregular-monthly-use/", clusterId: "monthly-choice-starter-monthly" },

  // monthly/monthly-choice/matched-comparison
  { title: "同样月付金额下，怎样比较流量、规则和软件兼容条件", url: "/monthly/same-price-monthly/", clusterId: "monthly-choice-matched-comparison" },
  { title: "月流量额度相同的两个套餐，哪些差异可能影响实际支出", url: "/monthly/same-quota-monthly/", clusterId: "monthly-choice-matched-comparison" },
  { title: "预算只能选一项升级时，月付用户应该先确认哪个瓶颈", url: "/monthly/monthly-priority/", clusterId: "monthly-choice-matched-comparison" },
  { title: "怎样把一长串月付套餐缩成三个候选，并保留淘汰理由", url: "/monthly/monthly-shortlist/", clusterId: "monthly-choice-matched-comparison" },

  // monthly/monthly-choice/month-to-flex
  { title: "月付与按量流量包怎么比：先判断使用频率和失效规则", url: "/monthly/monthly-vs-traffic-pack/", clusterId: "monthly-choice-month-to-flex" },
  { title: "用三个月却不确定是否继续，月付与季付怎样计算取舍", url: "/monthly/monthly-vs-quarterly/", clusterId: "monthly-choice-month-to-flex" },
  { title: "备用机场按月购买是否合适：从需要时的可用条件判断", url: "/monthly/monthly-as-backup/", clusterId: "monthly-choice-month-to-flex" },
  { title: "用了一个月就转年付合适吗：还需要哪些实际使用证据", url: "/monthly/monthly-to-annual-readiness/", clusterId: "monthly-choice-month-to-flex" },

  // monthly/monthly-choice/monthly-review
  { title: "月底怎样复盘机场费用：账单、任务成功和剩余流量一起看", url: "/monthly/monthly-spend-review/", clusterId: "monthly-choice-monthly-review" },
  { title: "连续几个月用不完流量，怎样判断降低月付档位的影响", url: "/monthly/monthly-downgrade/", clusterId: "monthly-choice-monthly-review" },
  { title: "月付套餐频繁加包时，如何判断升级是否能减少总支出", url: "/monthly/monthly-upgrade-trigger/", clusterId: "monthly-choice-monthly-review" },
  { title: "月付体验不符合预期时，怎样比较调整配置与更换服务的成本", url: "/monthly/monthly-cancel-replace/", clusterId: "monthly-choice-monthly-review" },

  // 3. annual/annual-commitment/annual-total
  { title: "年付机场怎么看价格：先看一次实付，再看月均折算", url: "/annual/annual-total-first/", clusterId: "annual-commitment-annual-total" },
  { title: "商家说年付省了多少钱，怎样检查它使用的比较基准", url: "/annual/annual-discount-baseline/", clusterId: "annual-commitment-annual-total" },
  { title: "年付服务与一次性客户端购买，怎样组成首年真实成本", url: "/annual/annual-software-cost/", clusterId: "annual-commitment-annual-total" },
  { title: "一年套餐、365天套餐和赠送月份，比较期限应怎样统一", url: "/annual/annual-period-length/", clusterId: "annual-commitment-annual-total" },

  // annual/annual-commitment/annual-entitlements
  { title: "年付但流量每月重置是什么意思，为什么不能把全年额度任意集中使用", url: "/annual/annual-monthly-reset/", clusterId: "annual-commitment-annual-entitlements" },
  { title: "一次发放全年流量与逐月发放额度，适合的使用规律有什么区别", url: "/annual/annual-total-quota/", clusterId: "annual-commitment-annual-entitlements" },
  { title: "年付赠送节点或附加功能，怎样核对是否对自己的任务有用", url: "/annual/annual-extra-benefits/", clusterId: "annual-commitment-annual-entitlements" },
  { title: "长期套餐设备规则变化时，购买前应该保存哪些公开条件", url: "/annual/annual-device-policy/", clusterId: "annual-commitment-annual-entitlements" },

  // annual/annual-commitment/annual-uncertainty
  { title: "价格打折不等于服务质量保证：年付决策应该分开哪些判断", url: "/annual/annual-no-guarantee/", clusterId: "annual-commitment-annual-uncertainty" },
  { title: "年付宣传提到退款时，怎样核对条件而不自行推定可退金额", url: "/annual/annual-refundable-claims/", clusterId: "annual-commitment-annual-uncertainty" },
  { title: "长期套餐可能发生功能调整，怎样评估可接受的替代与退出条件", url: "/annual/annual-service-change/", clusterId: "annual-commitment-annual-uncertainty" },
  { title: "只有几次试用记录时，年付决策中哪些未知仍然不能消除", url: "/annual/annual-evidence-gap/", clusterId: "annual-commitment-annual-uncertainty" },

  // annual/annual-commitment/annual-fit
  { title: "使用任务和用量比较稳定的人，年付前还需要核对什么", url: "/annual/annual-stable-use/", clusterId: "annual-commitment-annual-fit" },
  { title: "准备换设备或改变用途，怎样判断长期预付是否限制选择", url: "/annual/annual-changing-needs/", clusterId: "annual-commitment-annual-fit" },
  { title: "年付看起来更省但超出一次付款能力，怎样避免只看折算价", url: "/annual/annual-cash-limit/", clusterId: "annual-commitment-annual-fit" },
  { title: "为备用用途买年付套餐，怎样比较实际启用频率和闲置成本", url: "/annual/annual-backup-case/", clusterId: "annual-commitment-annual-fit" },

  // annual/annual-scenarios/break-even
  { title: "年付费用相当于几个月月付：怎样算出比较节点", url: "/annual/annual-break-even-months/", clusterId: "annual-scenarios-break-even" },
  { title: "只使用半年就停止时，年付与月付的实际费用怎样比较", url: "/annual/annual-partial-use/", clusterId: "annual-scenarios-break-even" },
  { title: "年付赠送月份是否降低成本：以真的会用到这些月份为前提", url: "/annual/annual-bonus-months/", clusterId: "annual-scenarios-break-even" },
  { title: "每年只有固定几个时段需要机场，怎样避免年付闲置", url: "/annual/annual-seasonal-use/", clusterId: "annual-scenarios-break-even" },

  // annual/annual-scenarios/prepay-exposure
  { title: "怎样记录年付套餐尚未消费的预付金额，而不把它称为可退款余额", url: "/annual/unconsumed-prepayment/", clusterId: "annual-scenarios-prepay-exposure" },
  { title: "服务中断或不再适用时，怎样制作年付成本的条件情景表", url: "/annual/annual-interruption-scenario/", clusterId: "annual-scenarios-prepay-exposure" },
  { title: "没有可靠风险概率时，如何比较年付情景而不编造期望损失", url: "/annual/annual-sensitivity-not-probability/", clusterId: "annual-scenarios-prepay-exposure" },
  { title: "购买年付之后仍想保留更换选择，怎样预留可解释的迁移预算", url: "/annual/annual-migration-budget/", clusterId: "annual-scenarios-prepay-exposure" },

  // annual/annual-scenarios/annual-audit
  { title: "年付后按季度应复核哪些服务、额度和任务条件", url: "/annual/annual-quarterly-check/", clusterId: "annual-scenarios-annual-audit" },
  { title: "年付期间用量逐渐增加，怎样判断加包、升级或备用方案", url: "/annual/annual-usage-drift/", clusterId: "annual-scenarios-annual-audit" },
  { title: "年付服务规则发生变化，怎样保存前后版本并核对订单权益", url: "/annual/annual-policy-record/", clusterId: "annual-scenarios-annual-audit" },
  { title: "年付到期日与赠送期容易混淆，怎样核对账户中的剩余服务时间", url: "/annual/annual-end-date/", clusterId: "annual-scenarios-annual-audit" },

  // annual/annual-scenarios/annual-renew-choice
  { title: "首年年付是否值得：怎样用真实支出和任务记录做复盘", url: "/annual/annual-first-year-review/", clusterId: "annual-scenarios-annual-renew-choice" },
  { title: "第二年是否继续年付，为什么不能只沿用第一次购买的理由", url: "/annual/annual-second-year-question/", clusterId: "annual-scenarios-annual-renew-choice" },
  { title: "年付首购优惠与老用户续费条件不同，如何比较下一年方案", url: "/annual/annual-new-vs-renew/", clusterId: "annual-scenarios-annual-renew-choice" },
  { title: "年付复盘应该给读者哪些依据，才能避免写成无证据的推荐文", url: "/annual/annual-evidence-summary/", clusterId: "annual-scenarios-annual-renew-choice" },

  // 4. discounts/discount-math/percentage
  { title: "八折、优惠20%和省20元有什么区别：折扣表达换算指南", url: "/discounts/percent-vs-fold/", clusterId: "discount-math-percentage" },
  { title: "优惠只作用于部分套餐金额时，折后总价应该怎样算", url: "/discounts/eligible-subtotal/", clusterId: "discount-math-percentage" },
  { title: "百分比折扣遇到分位小数时，怎样核对结算舍入规则", url: "/discounts/percentage-rounding/", clusterId: "discount-math-percentage" },
  { title: "优惠仅首期有效时，怎样分别展示首付价与正常续费价", url: "/discounts/discount-renewal-only/", clusterId: "discount-math-percentage" },

  // discounts/discount-math/fixed-discount
  { title: "满减门槛按原价还是优惠后金额判断：怎样根据活动条款计算", url: "/discounts/minimum-spend/", clusterId: "discount-math-fixed-discount" },
  { title: "固定减免大于套餐价格时，怎样处理封顶和不可为负的金额", url: "/discounts/fixed-off-cap/", clusterId: "discount-math-fixed-discount" },
  { title: "为了凑满减买更高档套餐，怎样比较真正多付的钱", url: "/discounts/coupon-threshold-trap/", clusterId: "discount-math-fixed-discount" },
  { title: "按订单减免和按单个套餐减免，结果为什么可能不同", url: "/discounts/order-vs-item-discount/", clusterId: "discount-math-fixed-discount" },

  // discounts/discount-math/stacking
  { title: "先打折再减钱与先减钱再打折，怎样验证允许的结算次序", url: "/discounts/discount-order/", clusterId: "discount-math-stacking" },
  { title: "优惠码不能叠加时，怎样计算并选择实际可用的优惠", url: "/discounts/non-stackable/", clusterId: "discount-math-stacking" },
  { title: "余额、积分和优惠码参与结算时，怎样分清付款与折扣", url: "/discounts/points-and-coupon/", clusterId: "discount-math-stacking" },
  { title: "活动没有说明叠加规则时，为什么不能展示最低可能价当确定价格", url: "/discounts/stacking-unknown/", clusterId: "discount-math-stacking" },

  // discounts/discount-math/bonus-value
  { title: "赠送流量怎样计入价值比较：不能直接等同现金优惠", url: "/discounts/bonus-traffic-value/", clusterId: "discount-math-bonus-value" },
  { title: "多送服务时间是否真的划算：怎样按会用到的期限比较", url: "/discounts/bonus-duration-value/", clusterId: "discount-math-bonus-value" },
  { title: "赠送重置次数与直接减价，应该怎样结合用量选择", url: "/discounts/free-reset-gift/", clusterId: "discount-math-bonus-value" },
  { title: "赠送功能用不上时，怎样避免把宣传价值算进自己的节省金额", url: "/discounts/unneeded-gift/", clusterId: "discount-math-bonus-value" },

  // discounts/discount-validation/eligibility
  { title: "新用户优惠的资格怎样核对：注册、首购和订单条件分别看", url: "/discounts/new-customer-definition/", clusterId: "discount-validation-eligibility" },
  { title: "为什么有优惠码却不能用于最低价套餐：排除条件核对方法", url: "/discounts/excluded-plans/", clusterId: "discount-validation-eligibility" },
  { title: "续费码与新购码适用对象不同，怎样避免用错比较口径", url: "/discounts/renewal-coupon-condition/", clusterId: "discount-validation-eligibility" },
  { title: "优惠到期时间采用哪个时区，怎样确认提交订单是否仍在有效期", url: "/discounts/coupon-timezone/", clusterId: "discount-validation-eligibility" },

  // discounts/discount-validation/checkout
  { title: "计算器折后价与结算页不同，怎样逐项查出差额", url: "/discounts/checkout-difference/", clusterId: "discount-validation-checkout" },
  { title: "支付方式优惠与通道费用同时存在时，应该比较哪个最终金额", url: "/discounts/payment-route-fees/", clusterId: "discount-validation-checkout" },
  { title: "怎样确认优惠已经作用于订单，而不是只看到代码输入成功", url: "/discounts/discount-applied-proof/", clusterId: "discount-validation-checkout" },
  { title: "付款失败后重建订单，优惠资格和价格需要重新核对什么", url: "/discounts/failed-payment-retry/", clusterId: "discount-validation-checkout" },

  // discounts/discount-validation/savings
  { title: "省了多少钱应当和哪个可购买方案相比：合理基准怎么选", url: "/discounts/savings-baseline/", clusterId: "discount-validation-savings" },
  { title: "折扣幅度和费用节省比例为什么不是任何时候都相同", url: "/discounts/savings-percentage/", clusterId: "discount-validation-savings" },
  { title: "优惠后的大套餐仍然用不完，怎样比较促销与适配之间的取舍", url: "/discounts/discount-vs-plan-fit/", clusterId: "discount-validation-savings" },
  { title: "月付优惠和年付促销同时存在时，怎样放到同一时段比较", url: "/discounts/cross-period-deals/", clusterId: "discount-validation-savings" },

  // discounts/discount-validation/audit-examples
  { title: "折扣与满减组合的完整演算：从条款到最终实付逐步核对", url: "/discounts/percentage-fixed-worked/", clusterId: "discount-validation-audit-examples" },
  { title: "优惠资格不符合时，计算器为什么应该返回原因而非优惠价格", url: "/discounts/coupon-invalid-case/", clusterId: "discount-validation-audit-examples" },
  { title: "优惠订单涉及退款时，怎样区分已付金额、商家规则与估算", url: "/discounts/refund-discount-case/", clusterId: "discount-validation-audit-examples" },
  { title: "折扣计算器需要哪些测试样例，才能覆盖常见宣传与结算差异", url: "/discounts/discount-test-suite/", clusterId: "discount-validation-audit-examples" },

  // 5. renewal/next-cycle/renewal-price
  { title: "机场续费多少钱应看哪里：广告、账户与订单报价怎样核对", url: "/renewal/renewal-actual-quote/", clusterId: "renewal-next-cycle-renewal-price" },
  { title: "首购折扣结束以后，怎样预算下一次实际扣款", url: "/renewal/renewal-promo-end/", clusterId: "renewal-next-cycle-renewal-price" },
  { title: "老套餐保留价格的说法怎样核实，不能默认永远有效", url: "/renewal/grandfathered-price/", clusterId: "renewal-next-cycle-renewal-price" },
  { title: "续费和重新购买不是同一操作时，费用与权益应怎样比较", url: "/renewal/renewal-vs-new-order/", clusterId: "renewal-next-cycle-renewal-price" },

  // renewal/next-cycle/renewal-time
  { title: "提前续费是顺延还是立即生效，怎样核对避免重复付费", url: "/renewal/early-renewal-start/", clusterId: "renewal-next-cycle-renewal-time" },
  { title: "到期后再续费，旧额度与新周期怎样衔接", url: "/renewal/expired-renewal/", clusterId: "renewal-next-cycle-renewal-time" },
  { title: "延长有效期不等于重置流量，续费前需要确认什么", url: "/renewal/renewal-vs-reset/", clusterId: "renewal-next-cycle-renewal-time" },
  { title: "多个服务到期时间集中时，怎样安排付款计划而不遗漏续费", url: "/renewal/renewal-time-budget/", clusterId: "renewal-next-cycle-renewal-time" },

  // renewal/next-cycle/balance
  { title: "账户现金余额和赠送余额有什么区别，续费预算怎样分别记录", url: "/renewal/cash-vs-promotional-credit/", clusterId: "renewal-next-cycle-balance" },
  { title: "续费时余额抵扣与优惠码先后顺序怎样核对", url: "/renewal/renewal-credit-order/", clusterId: "renewal-next-cycle-balance" },
  { title: "账户显示余额但不能提现，怎样避免把它当作可支配现金", url: "/renewal/nonwithdrawable-balance/", clusterId: "renewal-next-cycle-balance" },
  { title: "余额存在却不能支付当前续费订单，应检查哪些适用条件", url: "/renewal/credit-not-available/", clusterId: "renewal-next-cycle-balance" },

  // renewal/next-cycle/billing-control
  { title: "自动续费和主动续费怎样辨认，如何保存当前扣费设置", url: "/renewal/auto-renew-method/", clusterId: "renewal-next-cycle-billing-control" },
  { title: "关闭自动续费后，怎样核对设置生效而不误删现有服务", url: "/renewal/cancel-renewal-check/", clusterId: "renewal-next-cycle-billing-control" },
  { title: "续费账单应记录哪些字段，才能和后续额度变化对账", url: "/renewal/renewal-receipt/", clusterId: "renewal-next-cycle-billing-control" },
  { title: "遇到不符合预期的续费扣款，怎样收集记录并联系服务方", url: "/renewal/unexpected-renewal/", clusterId: "renewal-next-cycle-billing-control" },

  // renewal/lifecycle/upgrade
  { title: "中途升级套餐，剩余天数和余额抵扣如何影响补差", url: "/renewal/upgrade-credit-period/", clusterId: "renewal-lifecycle-upgrade" },
  { title: "升级后流量是否重算，为什么需要同时核对费用和额度", url: "/renewal/upgrade-quota-reset/", clusterId: "renewal-lifecycle-upgrade" },
  { title: "临时用量增加时，升级套餐与购买补充包怎样比较", url: "/renewal/upgrade-vs-topup/", clusterId: "renewal-lifecycle-upgrade" },
  { title: "计划降低套餐档位，怎样核对能否在续费时生效", url: "/renewal/downgrade-renewal/", clusterId: "renewal-lifecycle-upgrade" },

  // renewal/lifecycle/migration-cost
  { title: "更换机场时的双订阅费用，怎样作为迁移成本单独计算", url: "/renewal/migration-overlap-cost/", clusterId: "renewal-lifecycle-migration-cost" },
  { title: "新服务需要换客户端时，如何比较软件费用与迁移工作量", url: "/renewal/client-change-cost/", clusterId: "renewal-lifecycle-migration-cost" },
  { title: "旧机场余额和剩余流量应怎样记录，避免影响新方案比较", url: "/renewal/old-credit-migration/", clusterId: "renewal-lifecycle-migration-cost" },
  { title: "保留旧服务作回退会增加多少费用，怎样设置清楚的比较期限", url: "/renewal/reversible-migration/", clusterId: "renewal-lifecycle-migration-cost" },

  // renewal/lifecycle/exit
  { title: "决定不续费时，应该核对哪些订单、凭据和设备配置", url: "/renewal/service-exit-checklist/", clusterId: "renewal-lifecycle-exit" },
  { title: "申请退款前需要核对哪些公开条款与实际付款记录", url: "/renewal/refund-documentation/", clusterId: "renewal-lifecycle-exit" },
  { title: "尚未使用的额度为何不能直接当成可退金额：费用说明边界", url: "/renewal/unused-not-refundable/", clusterId: "renewal-lifecycle-exit" },
  { title: "结束使用后如何清理订阅和通知设置，同时保留必要账单证据", url: "/renewal/subscription-data-cleanup/", clusterId: "renewal-lifecycle-exit" },

  // renewal/lifecycle/retention-decision
  { title: "续费前怎样把实际用量、任务完成与费用放进同一份复盘", url: "/renewal/renewal-fit-review/", clusterId: "renewal-lifecycle-retention-decision" },
  { title: "未来使用需求不确定时，怎样比较短期续费与长期承诺", url: "/renewal/renewal-uncertain-job/", clusterId: "renewal-lifecycle-retention-decision" },
  { title: "现有服务与替代服务怎么比：把迁移成本算进去再决定", url: "/renewal/renewal-alternative-cost/", clusterId: "renewal-lifecycle-retention-decision" },
  { title: "怎样保存一次续费决策记录，方便下一周期核对判断是否成立", url: "/renewal/renewal-decision-record/", clusterId: "renewal-lifecycle-retention-decision" },

  // 6. plans/plan-records/record-fields
  { title: "一份可比较的机场套餐记录应该有哪些字段：从实付到来源", url: "/plans/plan-record-template/", clusterId: "plans-plan-records-record-fields" },
  { title: "价格与付款周期必须怎样绑定，才能避免套餐表出现误导", url: "/plans/price-period-binding/", clusterId: "plans-plan-records-record-fields" },
  { title: "跨币种套餐怎样保留原价与换算依据，不混成同一货币排序", url: "/plans/currency-preservation/", clusterId: "plans-plan-records-record-fields" },
  { title: "套餐数据如何同时保存原价、首购价和续费价，避免覆盖历史", url: "/plans/intro-renewal-fields/", clusterId: "plans-plan-records-record-fields" },

  // plans/plan-records/traffic-fields
  { title: "套餐流量额度与重置周期如何结构化记录", url: "/plans/quota-period-schema/", clusterId: "plans-plan-records-traffic-fields" },
  { title: "不同节点倍率不一致时，套餐表应该怎样记录而不是只填一个数", url: "/plans/multiplier-records/", clusterId: "plans-plan-records-traffic-fields" },
  { title: "流量可结转、不可结转和到期作废，数据字段怎样区分", url: "/plans/carryover-expiry-fields/", clusterId: "plans-plan-records-traffic-fields" },
  { title: "套餐声称不限量时，需要核对哪些速度、期限与使用限制", url: "/plans/unlimited-claims/", clusterId: "plans-plan-records-traffic-fields" },

  // plans/plan-records/feature-fields
  { title: "设备数、在线数和连接数如何分字段记录", url: "/plans/connection-limit-schema/", clusterId: "plans-plan-records-feature-fields" },
  { title: "套餐支持的订阅格式和客户端如何登记才不混淆服务与软件", url: "/plans/protocol-delivery-schema/", clusterId: "plans-plan-records-feature-fields" },
  { title: "宣传带宽、套餐限速与实际测速，价格表里怎样分开呈现", url: "/plans/speed-cap-schema/", clusterId: "plans-plan-records-feature-fields" },
  { title: "售后支持、使用条件与退款说明，应怎样链接原始资料", url: "/plans/support-condition-schema/", clusterId: "plans-plan-records-feature-fields" },

  // plans/plan-records/price-history
  { title: "套餐价格快照应记录哪个时间：抓取、核验与生效日分别处理", url: "/plans/price-snapshot-date/", clusterId: "plans-plan-records-price-history" },
  { title: "套餐改名但权益没有变化，怎样维护同一条历史记录", url: "/plans/plan-name-change/", clusterId: "plans-plan-records-price-history" },
  { title: "套餐名称没变而流量减少，价格历史应怎样反映变化", url: "/plans/same-name-new-rules/", clusterId: "plans-plan-records-price-history" },
  { title: "套餐下架后旧价格怎么展示，才能避免用户误以为仍可购买", url: "/plans/price-withdrawal/", clusterId: "plans-plan-records-price-history" },

  // plans/plan-discovery/filters
  { title: "筛选机场套餐时，为什么应先排除不满足条件的服务再按价格排序", url: "/plans/plan-filter-order/", clusterId: "plans-plan-discovery-filters" },
  { title: "套餐缺失设备或流量信息时，筛选器应怎样处理未知结果", url: "/plans/unknown-filter-values/", clusterId: "plans-plan-discovery-filters" },
  { title: "没有套餐同时满足预算和用量时，结果页应该怎样解释", url: "/plans/no-matching-plan/", clusterId: "plans-plan-discovery-filters" },
  { title: "套餐筛选结果怎样分享与索引，避免生成大量重复参数页面", url: "/plans/filter-url-policy/", clusterId: "plans-plan-discovery-filters" },

  // plans/plan-discovery/comparison-view
  { title: "比较套餐前怎样确认同币种、同期限和同用量口径", url: "/plans/plan-table-baseline/", clusterId: "plans-plan-discovery-comparison-view" },
  { title: "大对比表应该把哪些字段放在一起，才不会隐藏关键限制", url: "/plans/plan-table-columns/", clusterId: "plans-plan-discovery-comparison-view" },
  { title: "手机阅读套餐对比表时，哪些信息必须同时可见", url: "/plans/plan-table-mobile/", clusterId: "plans-plan-discovery-comparison-view" },
  { title: "价格表中的每个关键数字怎样连接到来源和核验记录", url: "/plans/plan-table-proof/", clusterId: "plans-plan-discovery-comparison-view" },

  // plans/plan-discovery/eligibility-results
  { title: "一个套餐为什么没被推荐：怎样展示不匹配条件而不是秘密打分", url: "/plans/plan-rejection-reasons/", clusterId: "plans-plan-discovery-eligibility-results" },
  { title: "两个套餐计算成本相同，怎样展示取舍而不伪造优胜者", url: "/plans/plan-ties/", clusterId: "plans-plan-discovery-eligibility-results" },
  { title: "候选排序依赖哪些假设，怎样让用户看到调整输入后的变化", url: "/plans/plan-sensitive-assumptions/", clusterId: "plans-plan-discovery-eligibility-results" },
  { title: "把筛选结果带到主站前，应保留哪些条件和数据版本", url: "/plans/plan-shortlist-export/", clusterId: "plans-plan-discovery-eligibility-results" },

  // plans/plan-discovery/purchase-handoff
  { title: "从对比表进入购买页面前，哪些价格和资格需要再次确认", url: "/plans/price-before-purchase/", clusterId: "plans-plan-discovery-purchase-handoff" },
  { title: "主站与服务方当前结算金额不同，应该怎样继续核对", url: "/plans/checkout-price-changed/", clusterId: "plans-plan-discovery-purchase-handoff" },
  { title: "机场预算与机场选购主站如何分工：计算依据和购买入口分别看", url: "/plans/budget-site-role/", clusterId: "plans-plan-discovery-purchase-handoff" },
  { title: "找不到可核验的套餐入口时，为什么不能用任意注册链接替代", url: "/plans/plan-unverified-link/", clusterId: "plans-plan-discovery-purchase-handoff" },

  // 7. usage/case-method/diary
  { title: "怎样建立一个月的机场使用账本：任务、额度和支出分别记", url: "/usage/usage-log-template/", clusterId: "usage-case-method-diary" },
  { title: "客户端、系统与机场后台流量不同，案例记录应采用什么口径", url: "/usage/traffic-counter-differences/", clusterId: "usage-case-method-diary" },
  { title: "只记录几天用量能否推算整月，怎样标明样本范围", url: "/usage/case-observation-window/", clusterId: "usage-case-method-diary" },
  { title: "如何把一次充值或加包关联到具体使用周期，而不是混算总金额", url: "/usage/billing-log-matching/", clusterId: "usage-case-method-diary" },

  // usage/case-method/workload
  { title: "浏览与查资料的用量案例怎样记录，避免凭印象估计每月流量", url: "/usage/browsing-workload/", clusterId: "usage-case-method-workload" },
  { title: "视频观看用量案例需要保留哪些码率、时长和播放条件", url: "/usage/video-workload/", clusterId: "usage-case-method-workload" },
  { title: "大文件上传下载案例怎样区分原始文件大小与实际计费流量", url: "/usage/file-workload/", clusterId: "usage-case-method-workload" },
  { title: "AI使用案例怎样区分网页、文件、语音等不同流量任务", url: "/usage/ai-workload/", clusterId: "usage-case-method-workload" },

  // usage/case-method/quality
  { title: "用量记录漏了几天，怎样给出范围而不是补造精确数字", url: "/usage/missing-days/", clusterId: "usage-case-method-quality" },
  { title: "Wi-Fi、移动网络和直连流量混在一起，怎样整理机场使用案例", url: "/usage/network-split-case/", clusterId: "usage-case-method-quality" },
  { title: "某天流量突然增加，案例分析怎样排查更新、同步和后台任务", url: "/usage/abnormal-usage-spike/", clusterId: "usage-case-method-quality" },
  { title: "实际日志与用户回忆不一致时，案例结论如何说明证据优先级", url: "/usage/measurement-versus-memory/", clusterId: "usage-case-method-quality" },

  // usage/case-method/privacy
  { title: "公开费用与用量案例时，怎样移除账户、订阅和个人信息", url: "/usage/anonymized-budget-case/", clusterId: "usage-case-method-privacy" },
  { title: "假设案例、真实记录和模拟演算应怎样明显区分", url: "/usage/hypothetical-case-label/", clusterId: "usage-case-method-privacy" },
  { title: "引用他人的使用账本前，应该确认哪些授权和可公开范围", url: "/usage/consent-and-scope/", clusterId: "usage-case-method-privacy" },
  { title: "一篇用量复盘应该附哪些来源，才能让读者检查计算过程", url: "/usage/case-sources/", clusterId: "usage-case-method-privacy" },

  // usage/case-decisions/light-users
  { title: "少量日常任务选择小套餐的案例，怎样同时核对流量和兼容性", url: "/usage/light-use-small-plan/", clusterId: "usage-case-decisions-light-users" },
  { title: "只在假期使用机场的案例，月付与流量包如何比较", url: "/usage/holiday-only-use/", clusterId: "usage-case-decisions-light-users" },
  { title: "备用订阅长时间闲置的费用应该怎样复盘", url: "/usage/backup-only-case/", clusterId: "usage-case-decisions-light-users" },
  { title: "每月额度剩余很多的案例，为什么不能只比较每GB标价", url: "/usage/underused-allowance/", clusterId: "usage-case-decisions-light-users" },

  // usage/case-decisions/mixed-users
  { title: "一个账户用于本人多台设备时，怎样合并账本又保留设备差异", url: "/usage/family-own-devices/", clusterId: "usage-case-decisions-mixed-users" },
  { title: "办公与视频混合使用的案例，怎样找出真正决定套餐档位的任务", url: "/usage/work-and-video-case/", clusterId: "usage-case-decisions-mixed-users" },
  { title: "手机和电脑用量互相替代时，怎样避免重复预算", url: "/usage/desktop-mobile-case/", clusterId: "usage-case-decisions-mixed-users" },
  { title: "同时使用两家服务的案例，怎样记录任务分工与重复支出", url: "/usage/multi-service-case/", clusterId: "usage-case-decisions-mixed-users" },

  // usage/case-decisions/changing-users
  { title: "短期项目造成流量上升，怎样比较临时加包与升级整个套餐", url: "/usage/project-surge-case/", clusterId: "usage-case-decisions-changing-users" },
  { title: "高用量阶段结束后，怎样复盘是否该恢复原档位", url: "/usage/return-to-normal-case/", clusterId: "usage-case-decisions-changing-users" },
  { title: "增加电视或新电脑后，如何用实际记录重新估计下月额度", url: "/usage/new-device-usage-case/", clusterId: "usage-case-decisions-changing-users" },
  { title: "节点倍率调整后原用量账本怎样更新，不能只沿用旧平均值", url: "/usage/quota-policy-change-case/", clusterId: "usage-case-decisions-changing-users" },

  // usage/case-decisions/review-results
  { title: "声称调整套餐省了钱，怎样用同任务同期限验证节省金额", url: "/usage/case-savings-validation/", clusterId: "usage-case-decisions-review-results" },
  { title: "费用下降却增加维护操作，案例结论应怎样表达这种取舍", url: "/usage/case-nonprice-outcome/", clusterId: "usage-case-decisions-review-results" },
  { title: "一位用户的省钱方案能否照搬，怎样列出不能外推的条件", url: "/usage/case-transferability/", clusterId: "usage-case-decisions-review-results" },
  { title: "套餐调整后的案例需要怎样回访，才能确认第一次判断没有失效", url: "/usage/case-followup/", clusterId: "usage-case-decisions-review-results" },

  // 8. low-budget/budget-constraints/minimal-spend
  { title: "低预算买机场为什么先看最低实付，而不是最低折算月价", url: "/low-budget/lowest-entry-not-unit/", clusterId: "low-budget-budget-constraints-minimal-spend" },
  { title: "先试用再购买如何安排费用，避免反复充值超过原预算", url: "/low-budget/trial-first-budget/", clusterId: "low-budget-budget-constraints-minimal-spend" },
  { title: "iPhone或特定客户端需要额外费用时，低预算应怎样重新分配", url: "/low-budget/client-cost-barrier/", clusterId: "low-budget-budget-constraints-minimal-spend" },
  { title: "最低充值额高于套餐价格，怎样判断是否仍符合预算限制", url: "/low-budget/payment-minimum-barrier/", clusterId: "low-budget-budget-constraints-minimal-spend" },

  // low-budget/budget-constraints/must-haves
  { title: "预算有限时怎样列出必须满足的条件，而不是追求全部功能", url: "/low-budget/must-have-list/", clusterId: "low-budget-budget-constraints-must-haves" },
  { title: "只用少数地区的用户，怎样核对节点数量是否值得额外付费", url: "/low-budget/region-need-filter/", clusterId: "low-budget-budget-constraints-must-haves" },
  { title: "不想反复调配置的低预算用户，应该怎样比较上手和支持条件", url: "/low-budget/simple-setup-priority/", clusterId: "low-budget-budget-constraints-must-haves" },
  { title: "哪些附加服务可以暂不购买：以实际任务而非宣传标签决定", url: "/low-budget/skip-unused-features/", clusterId: "low-budget-budget-constraints-must-haves" },

  // low-budget/budget-constraints/light-scenarios
  { title: "偶尔阅读资料的用户，怎样确定低预算服务的验收标准", url: "/low-budget/occasional-reading-budget/", clusterId: "low-budget-budget-constraints-light-scenarios" },
  { title: "预算有限又看视频，怎样用播放设置与真实用量安排套餐", url: "/low-budget/limited-video-budget/", clusterId: "low-budget-budget-constraints-light-scenarios" },
  { title: "学习与办公混合任务下，怎样优先保障必要连接", url: "/low-budget/study-work-budget/", clusterId: "low-budget-budget-constraints-light-scenarios" },
  { title: "临时出行需要网络服务时，怎样避免购买超过使用期的方案", url: "/low-budget/temporary-trip-budget/", clusterId: "low-budget-budget-constraints-light-scenarios" },

  // low-budget/budget-constraints/quality-boundaries
  { title: "低价机场没有测试资料时，怎样比较公开条件并保留未知", url: "/low-budget/cheap-no-test-claims/", clusterId: "low-budget-budget-constraints-quality-boundaries" },
  { title: "低预算能接受哪些限制：速度、流量、设备与支持怎样分别判断", url: "/low-budget/cheap-tradeoffs/", clusterId: "low-budget-budget-constraints-quality-boundaries" },
  { title: "便宜方案反复无法完成任务，怎样记录重试与替换的实际费用", url: "/low-budget/cheap-failure-cost/", clusterId: "low-budget-budget-constraints-quality-boundaries" },
  { title: "购买低价套餐后怎样做有限验收，不把一次连通当成长期保证", url: "/low-budget/cheap-acceptance/", clusterId: "low-budget-budget-constraints-quality-boundaries" },

  // low-budget/budget-adjustment/reduce-waste
  { title: "怎样用剩余流量判断套餐过大，而不是继续追逐更低每GB价", url: "/low-budget/unused-quota-budget/", clusterId: "low-budget-budget-adjustment-reduce-waste" },
  { title: "怎样整理到期与自动续费记录，减少忘记关闭造成的支出", url: "/low-budget/renewal-reminder-budget/", clusterId: "low-budget-budget-adjustment-reduce-waste" },
  { title: "多份订阅功能重叠时，怎样评估是否能减少一个付费方案", url: "/low-budget/duplicate-subscriptions/", clusterId: "low-budget-budget-adjustment-reduce-waste" },
  { title: "已有付费客户端能否继续使用，购买新服务前应该核对什么", url: "/low-budget/client-purchase-reuse/", clusterId: "low-budget-budget-adjustment-reduce-waste" },

  // low-budget/budget-adjustment/compare-budget
  { title: "用相同任务比较两个便宜套餐，怎样避免高流量标签干扰判断", url: "/low-budget/budget-same-task/", clusterId: "low-budget-budget-adjustment-compare-budget" },
  { title: "首次付款金额相同但期限不同，低预算用户应该怎样取舍", url: "/low-budget/budget-same-cash/", clusterId: "low-budget-budget-adjustment-compare-budget" },
  { title: "一个候选需要额外软件或加包时，怎样更新低预算比较", url: "/low-budget/budget-with-hidden-cost/", clusterId: "low-budget-budget-adjustment-compare-budget" },
  { title: "预算内没有满足条件的服务时，怎样解释而不是硬推最低价", url: "/low-budget/budget-no-winner/", clusterId: "low-budget-budget-adjustment-compare-budget" },

  // low-budget/budget-adjustment/upgrade-timing
  { title: "哪些实际使用证据说明应该提高预算，而不只是受促销影响", url: "/low-budget/upgrade-evidence/", clusterId: "low-budget-budget-adjustment-upgrade-timing" },
  { title: "偶发额度不足时，补充包与升一个档位怎样分别计算", url: "/low-budget/small-topup-vs-tier/", clusterId: "low-budget-budget-adjustment-upgrade-timing" },
  { title: "免费体验已经不满足任务时，怎样确定付费后的必要改善", url: "/low-budget/paid-after-trial/", clusterId: "low-budget-budget-adjustment-upgrade-timing" },
  { title: "提高预算后仍未解决问题，怎样重新检查是否选错了服务类型", url: "/low-budget/budget-plan-exit/", clusterId: "low-budget-budget-adjustment-upgrade-timing" },

  // low-budget/budget-adjustment/budget-risks
  { title: "为了便宜而长期预付，现金有限的用户应如何比较可逆性", url: "/low-budget/cheap-long-prepay/", clusterId: "low-budget-budget-adjustment-budget-risks" },
  { title: "依赖未经核验优惠才能负担的套餐，应该怎样处理不确定价格", url: "/low-budget/unverified-coupon-budget/", clusterId: "low-budget-budget-adjustment-budget-risks" },
  { title: "为什么不能把未确认退款当成低预算试错的保障", url: "/low-budget/refund-not-budget-plan/", clusterId: "low-budget-budget-adjustment-budget-risks" },
  { title: "低预算购买前的最终检查：付款、流量、格式与退出条件", url: "/low-budget/budget-decision-checklist/", clusterId: "low-budget-budget-adjustment-budget-risks" },

  // 9. high-data/demand-and-capacity/demand-model
  { title: "怎样按视频时长和码率估算流量，并解释估算范围", url: "/high-data/video-duration-model/", clusterId: "high-data-demand-and-capacity-demand-model" },
  { title: "频繁传输大文件时，怎样记录重试、校验和重复下载产生的流量", url: "/high-data/large-files-model/", clusterId: "high-data-demand-and-capacity-demand-model" },
  { title: "同步盘与软件更新持续消耗流量，怎样识别是否经过代理", url: "/high-data/sync-update-model/", clusterId: "high-data-demand-and-capacity-demand-model" },
  { title: "多台设备共同使用大流量套餐，怎样计算峰值与月总量", url: "/high-data/multiple-devices-model/", clusterId: "high-data-demand-and-capacity-demand-model" },

  // high-data/demand-and-capacity/quota-meaning
  { title: "大流量套餐不等于高速套餐：购买前需要分开看哪些指标", url: "/high-data/high-quota-not-speed/", clusterId: "high-data-demand-and-capacity-quota-meaning" },
  { title: "高倍率节点怎样改变大流量套餐的有效可用量", url: "/high-data/high-multiplier/", clusterId: "high-data-demand-and-capacity-quota-meaning" },
  { title: "大额度按月重置与全年统一额度，怎样比较使用弹性", url: "/high-data/large-plan-reset/", clusterId: "high-data-demand-and-capacity-quota-meaning" },
  { title: "宣传不限流量时，怎样记录合理使用、限速和连接限制", url: "/high-data/fair-use-record/", clusterId: "high-data-demand-and-capacity-quota-meaning" },

  // high-data/demand-and-capacity/performance-fit
  { title: "完成同一个大文件任务，吞吐量和耗时应该怎样对应记录", url: "/high-data/throughput-vs-duration/", clusterId: "high-data-demand-and-capacity-performance-fit" },
  { title: "晚高峰观看任务怎样验收，不能只凭一次下载峰值判断", url: "/high-data/peak-hours-video/", clusterId: "high-data-demand-and-capacity-performance-fit" },
  { title: "多任务并行时，连接数限制与带宽瓶颈应该怎样区分", url: "/high-data/connections-vs-bandwidth/", clusterId: "high-data-demand-and-capacity-performance-fit" },
  { title: "大流量服务放到路由器上使用，购买前要核对哪些硬件和格式条件", url: "/high-data/router-large-plan/", clusterId: "high-data-demand-and-capacity-performance-fit" },

  // high-data/demand-and-capacity/quota-lifecycle
  { title: "月初集中用完大量流量时，怎样安排余下周期的成本", url: "/high-data/frontloaded-usage/", clusterId: "high-data-demand-and-capacity-quota-lifecycle" },
  { title: "只有部分月份需要大流量，怎样避免全年固定购买高档套餐", url: "/high-data/high-data-seasonality/", clusterId: "high-data-demand-and-capacity-quota-lifecycle" },
  { title: "大流量套餐仍然超额时，重置、加包和续期怎样比较", url: "/high-data/large-topup-choice/", clusterId: "high-data-demand-and-capacity-quota-lifecycle" },
  { title: "大套餐大量剩余时，怎样核对是否被低每GB价格误导", url: "/high-data/unused-large-plan/", clusterId: "high-data-demand-and-capacity-quota-lifecycle" },

  // high-data/high-data-cost/cost-ceiling
  { title: "大流量预算应怎样包含客户端、重置和备用服务的额外费用", url: "/high-data/large-plan-total-cost/", clusterId: "high-data-high-data-cost-cost-ceiling" },
  { title: "升级高档位在哪种用量下才更省：如何计算条件平衡点", url: "/high-data/high-data-break-even/", clusterId: "high-data-high-data-cost-cost-ceiling" },
  { title: "高用量套餐跨币种比较时，如何记录汇率日期和支付费用", url: "/high-data/high-data-currency/", clusterId: "high-data-high-data-cost-cost-ceiling" },
  { title: "有明确预算上限时，怎样把超额费用暴露在计算结果中", url: "/high-data/high-data-cap/", clusterId: "high-data-high-data-cost-cost-ceiling" },

  // high-data/high-data-cost/high-data-options
  { title: "固定大包与按量计费适合哪种高用量任务分布", url: "/high-data/bundle-vs-payg/", clusterId: "high-data-high-data-cost-high-data-options" },
  { title: "一个大套餐与两份互补订阅怎样比较，哪些额度不能简单相加", url: "/high-data/one-vs-two-services/", clusterId: "high-data-high-data-cost-high-data-options" },
  { title: "大量使用但任务可能变化，长期预付大套餐应核对什么", url: "/high-data/high-data-prepay/", clusterId: "high-data-high-data-cost-high-data-options" },
  { title: "持续任务需要备用连接时，怎样确定备用额度而不是双倍购买", url: "/high-data/high-data-backup/", clusterId: "high-data-high-data-cost-high-data-options" },

  // high-data/high-data-cost/task-acceptance
  { title: "试用流量有限时，怎样验证大文件需求而不夸大测试结论", url: "/high-data/large-file-trial/", clusterId: "high-data-high-data-cost-task-acceptance" },
  { title: "视频用户怎样制定大流量套餐的播放验收清单", url: "/high-data/video-acceptance-plan/", clusterId: "high-data-high-data-cost-task-acceptance" },
  { title: "多设备使用的验收如何区分单设备成功与同时使用成功", url: "/high-data/multi-device-acceptance/", clusterId: "high-data-high-data-cost-task-acceptance" },
  { title: "大流量评测应保留哪些环境、样本和原始记录", url: "/high-data/high-data-records/", clusterId: "high-data-high-data-cost-task-acceptance" },

  // high-data/high-data-cost/optimization-review
  { title: "购买大套餐一个月后，怎样复盘成本与实际任务完成情况", url: "/high-data/high-data-month-review/", clusterId: "high-data-high-data-cost-optimization-review" },
  { title: "减少不必要后台代理流量，怎样验证确实降低了计费消耗", url: "/high-data/reduce-background-use/", clusterId: "high-data-high-data-cost-optimization-review" },
  { title: "大流量任务迁移到新服务时，怎样预算重复下载和并行测试", url: "/high-data/high-data-migration-cost/", clusterId: "high-data-high-data-cost-optimization-review" },
  { title: "一次大流量成功体验能说明什么，哪些长期判断仍需继续观察", url: "/high-data/high-data-review-limits/", clusterId: "high-data-high-data-cost-optimization-review" },

  // 10. brands/identity-records/naming
  { title: "遇到同名机场怎样区分：名称、域名与公开渠道核对", url: "/brands/brand-name-collisions/", clusterId: "brands-identity-records-naming" },
  { title: "机场中文名、英文名与别名如何登记，避免把不同品牌合并", url: "/brands/brand-alias-record/", clusterId: "brands-identity-records-naming" },
  { title: "机场品牌和客户端软件名字相近时，怎样确认各自提供什么", url: "/brands/brand-vs-app/", clusterId: "brands-identity-records-naming" },
  { title: "品牌身份档案应收集哪些公开证据，哪些信息仍应标未知", url: "/brands/brand-identity-evidence/", clusterId: "brands-identity-records-naming" },

  // brands/identity-records/official-entry
  { title: "怎样核对机场官方入口，而不是仅相信页面自称官网", url: "/brands/brand-official-source/", clusterId: "brands-identity-records-official-entry" },
  { title: "邀请链接、联盟链接和普通入口如何区分并说明关系", url: "/brands/brand-referral-link/", clusterId: "brands-identity-records-official-entry" },
  { title: "机场宣布换域后，怎样保存新旧入口的来源和生效记录", url: "/brands/brand-domain-change/", clusterId: "brands-identity-records-official-entry" },
  { title: "多个公开渠道给出不同域名时，如何暂停判断并继续核验", url: "/brands/brand-entry-conflict/", clusterId: "brands-identity-records-official-entry" },

  // brands/identity-records/service-identity
  { title: "服务方公开介绍的运营主体怎样记录，哪些不能靠域名推断", url: "/brands/operator-claim/", clusterId: "brands-identity-records-service-identity" },
  { title: "代理销售、转售与品牌直营的说法，应该用什么证据区分", url: "/brands/reseller-relationship/", clusterId: "brands-identity-records-service-identity" },
  { title: "服务商提供专用客户端时，怎样核对软件发行者和服务关系", url: "/brands/service-client-ownership/", clusterId: "brands-identity-records-service-identity" },
  { title: "品牌数据库收录自营或合作服务时，应怎样披露关系和展示依据", url: "/brands/brand-business-disclosure/", clusterId: "brands-identity-records-service-identity" },

  // brands/identity-records/history
  { title: "怎样整理品牌公告时间线，避免把转载时间当成事件发生时间", url: "/brands/brand-announcement-history/", clusterId: "brands-identity-records-history" },
  { title: "品牌改名、产品更名和新服务上线，历史档案怎样区别记录", url: "/brands/brand-renaming-history/", clusterId: "brands-identity-records-history" },
  { title: "官方网站暂时打不开时，为什么不能直接写成已经停运", url: "/brands/brand-status-unknown/", clusterId: "brands-identity-records-history" },
  { title: "品牌资料发现错误后，怎样更新正文并保留纠错记录", url: "/brands/brand-correction-log/", clusterId: "brands-identity-records-history" },

  // brands/evidence-maintenance/evidence-grades
  { title: "官方套餐说明与本站实测能证明的事项有哪些不同", url: "/brands/first-party-vs-test/", clusterId: "brands-evidence-maintenance-evidence-grades" },
  { title: "用户反馈能否直接写进品牌结论：证据范围怎样说明", url: "/brands/third-party-feedback/", clusterId: "brands-evidence-maintenance-evidence-grades" },
  { title: "引用主站的品牌数据时，怎样说明来源而不冒充独立验证", url: "/brands/main-site-source/", clusterId: "brands-evidence-maintenance-evidence-grades" },
  { title: "服务条款、宣传页和订单内容冲突时，品牌档案应该怎样呈现", url: "/brands/conflicting-evidence/", clusterId: "brands-evidence-maintenance-evidence-grades" },

  // brands/evidence-maintenance/plan-linking
  { title: "套餐名称重复或改名时，怎样建立稳定的品牌与套餐标识", url: "/brands/brand-plan-id/", clusterId: "brands-evidence-maintenance-plan-linking" },
  { title: "品牌档案如何引用价格历史，避免每篇文章维护不同数字", url: "/brands/brand-price-history-link/", clusterId: "brands-evidence-maintenance-plan-linking" },
  { title: "品牌提供的格式、协议和客户端支持，怎样分别链接来源", url: "/brands/brand-compatibility-links/", clusterId: "brands-evidence-maintenance-plan-linking" },
  { title: "优惠码属于哪个品牌和哪些套餐，资料关系怎样避免串用", url: "/brands/brand-coupon-relations/", clusterId: "brands-evidence-maintenance-plan-linking" },

  // brands/evidence-maintenance/verification-state
  { title: "资料修改日期与核验日期为什么要分开保存", url: "/brands/checked-vs-updated/", clusterId: "brands-evidence-maintenance-verification-state" },
  { title: "套餐来源很久没有复核时，怎样提示陈旧而不自动声称失效", url: "/brands/stale-data-label/", clusterId: "brands-evidence-maintenance-verification-state" },
  { title: "原始来源已经无法访问，怎样处理保留记录与当前判断", url: "/brands/source-unreachable/", clusterId: "brands-evidence-maintenance-verification-state" },
  { title: "品牌资料复核应检查哪些字段，怎样记录未完成部分", url: "/brands/verification-checklist/", clusterId: "brands-evidence-maintenance-verification-state" },

  // brands/evidence-maintenance/reuse-and-handoff
  { title: "预算站的品牌摘要应包含什么，哪些评测内容留给主站", url: "/brands/brand-summary-boundary/", clusterId: "brands-evidence-maintenance-reuse-and-handoff" },
  { title: "进入主站品牌详情前，怎样确认链接对应正确品牌和当前版本", url: "/brands/brand-detail-routing/", clusterId: "brands-evidence-maintenance-reuse-and-handoff" },
  { title: "共享品牌基础数据时，怎样保留来源而不复制全部评测正文", url: "/brands/brand-data-export/", clusterId: "brands-evidence-maintenance-reuse-and-handoff" },
  { title: "用户准备付款时，品牌档案应该提示重新核对哪些动态条件", url: "/brands/brand-purchase-verification/", clusterId: "brands-evidence-maintenance-reuse-and-handoff" },

  // 11. buying-checks/before-payment/price-presentation
  { title: "极低月价广告需要核对什么：周期、额度、首购和最低充值", url: "/buying-checks/low-price-label-check/", clusterId: "buying-checks-before-payment-price-presentation" },
  { title: "所谓限时大折扣的原价如何核对，资料不全时怎样表达", url: "/buying-checks/fake-discount-baseline/", clusterId: "buying-checks-before-payment-price-presentation" },
  { title: "价格卡片省略流量周期或倍率时，购买前应该补齐哪些信息", url: "/buying-checks/headline-quota-check/", clusterId: "buying-checks-before-payment-price-presentation" },
  { title: "同样一个价格数字可能不是同一币种，怎样避免误读套餐费用", url: "/buying-checks/currency-check/", clusterId: "buying-checks-before-payment-price-presentation" },

  // buying-checks/before-payment/technical-claims
  { title: "机场标注专线或精品线路时，用户能核对哪些条件", url: "/buying-checks/line-label-proof/", clusterId: "buying-checks-before-payment-technical-claims" },
  { title: "单次高速截图为什么不能证明所有时段都快：购买证据检查", url: "/buying-checks/speed-claim-limits/", clusterId: "buying-checks-before-payment-technical-claims" },
  { title: "宣传全平台支持时，怎样拆成具体应用和功能核验", url: "/buying-checks/all-platform-claim/", clusterId: "buying-checks-before-payment-technical-claims" },
  { title: "不限时、不限量与不限速分别是什么意思，条款应怎样逐项看", url: "/buying-checks/unlimited-conditions/", clusterId: "buying-checks-before-payment-technical-claims" },

  // buying-checks/before-payment/payment-terms
  { title: "付款前最后一次核对清单：订单金额、套餐名称、周期和入口", url: "/buying-checks/payment-before-check/", clusterId: "buying-checks-before-payment-payment-terms" },
  { title: "看到退款字样后还要确认什么，为什么不能擅自推定无条件退费", url: "/buying-checks/refund-not-assumption/", clusterId: "buying-checks-before-payment-payment-terms" },
  { title: "多设备与多人使用条件如何核对，避免购买后才发现不适用", url: "/buying-checks/shared-account-rules/", clusterId: "buying-checks-before-payment-payment-terms" },
  { title: "免费试用要求支付信息时，怎样检查扣款和取消规则", url: "/buying-checks/trial-charge-terms/", clusterId: "buying-checks-before-payment-payment-terms" },

  // buying-checks/before-payment/source-safety
  { title: "收到机场注册链接时，怎样从已知公开渠道核对而不只看页面外观", url: "/buying-checks/counterfeit-entry/", clusterId: "buying-checks-before-payment-source-safety" },
  { title: "为什么不应把真实订阅链接贴到公开比较工具或求助页面", url: "/buying-checks/subscription-secret/", clusterId: "buying-checks-before-payment-source-safety" },
  { title: "寻求客服帮助时，哪些记录可脱敏提供、哪些凭据不应直接分享", url: "/buying-checks/support-request-secrets/", clusterId: "buying-checks-before-payment-source-safety" },
  { title: "软件下载按钮与机场购买按钮如何区分，避免购买错误的产品", url: "/buying-checks/client-download-purchase/", clusterId: "buying-checks-before-payment-source-safety" },

  // buying-checks/after-purchase/delivery-check
  { title: "付款之后怎样核对套餐、期限和流量确实到账", url: "/buying-checks/payment-delivery-match/", clusterId: "buying-checks-after-purchase-delivery-check" },
  { title: "首次连接验收应检查哪些步骤，为什么不能只看客户端绿色图标", url: "/buying-checks/first-connection-check/", clusterId: "buying-checks-after-purchase-delivery-check" },
  { title: "购买前承诺的功能怎样逐项验收并记录条件", url: "/buying-checks/feature-purchase-check/", clusterId: "buying-checks-after-purchase-delivery-check" },
  { title: "套餐交付有差异时，怎样保存足够但不泄露隐私的核对资料", url: "/buying-checks/receipt-evidence/", clusterId: "buying-checks-after-purchase-delivery-check" },

  // buying-checks/after-purchase/troubleshooting-boundary
  { title: "使用不成功时怎样区分客户端配置、服务与目标应用问题", url: "/buying-checks/client-or-service/", clusterId: "buying-checks-after-purchase-troubleshooting-boundary" },
  { title: "AI或视频账号提示限制时，为什么不能直接归因于机场线路", url: "/buying-checks/account-platform-error/", clusterId: "buying-checks-after-purchase-troubleshooting-boundary" },
  { title: "感觉速度慢时，购买复盘怎样先排除本地网络和测试条件变化", url: "/buying-checks/slow-speed-blame/", clusterId: "buying-checks-after-purchase-troubleshooting-boundary" },
  { title: "连接失败与退款资格是两件事：如何分别核对技术和订单资料", url: "/buying-checks/failure-to-refund/", clusterId: "buying-checks-after-purchase-troubleshooting-boundary" },

  // buying-checks/after-purchase/change-response
  { title: "套餐权益调整后，怎样对照当时订单与当前公告", url: "/buying-checks/plan-change-notice/", clusterId: "buying-checks-after-purchase-change-response" },
  { title: "流量扣除与预期不符时，怎样用记录核对而不凭印象指控", url: "/buying-checks/quota-dispute/", clusterId: "buying-checks-after-purchase-change-response" },
  { title: "客服暂未回复时怎样保留沟通记录，不把等待直接写成跑路", url: "/buying-checks/support-unresponsive/", clusterId: "buying-checks-after-purchase-change-response" },
  { title: "服务变化不再满足需求时，怎样规划到期、迁移与凭据清理", url: "/buying-checks/exit-after-change/", clusterId: "buying-checks-after-purchase-change-response" },

  // buying-checks/after-purchase/editorial-risks
  { title: "购买避坑文章怎样分级描述证据，避免把推测写成确定事实", url: "/buying-checks/risk-level-evidence/", clusterId: "buying-checks-after-purchase-editorial-risks" },
  { title: "读者怎样识别推广关系，预算站应怎样说明推荐与商业利益", url: "/buying-checks/sponsored-recommendations/", clusterId: "buying-checks-after-purchase-editorial-risks" },
  { title: "负面信息后来被澄清时，风险页面应该怎样更正和保留说明", url: "/buying-checks/risk-update-correction/", clusterId: "buying-checks-after-purchase-editorial-risks" },
  { title: "一份检查清单能降低哪些信息缺口，为什么不能保证服务永远可靠", url: "/buying-checks/buying-checks-no-guarantee/", clusterId: "buying-checks-after-purchase-editorial-risks" },

  // 12. offers/offer-records/sources
  { title: "机场优惠码应从哪些公开渠道核对，怎样登记来源", url: "/offers/offer-source-register/", clusterId: "offers-offer-records-sources" },
  { title: "官方公告、合作渠道和转载优惠怎样分别标识可信范围", url: "/offers/source-vs-repost/", clusterId: "offers-offer-records-sources" },
  { title: "定向优惠和公开优惠有什么不同，哪些代码不应公开传播", url: "/offers/private-coupon-boundary/", clusterId: "offers-offer-records-sources" },
  { title: "没有核验到当前优惠时，优惠页应展示什么而不是编造代码", url: "/offers/no-current-offer/", clusterId: "offers-offer-records-sources" },

  // offers/offer-records/scope
  { title: "优惠覆盖哪些套餐和周期，怎样把公告条件整理成查询表", url: "/offers/offer-plan-scope/", clusterId: "offers-offer-records-scope" },
  { title: "新用户、老用户与指定账户优惠，记录时怎样避免扩大资格", url: "/offers/offer-user-scope/", clusterId: "offers-offer-records-scope" },
  { title: "优惠限定支付方式或地区时，信息表应该保留哪些条件", url: "/offers/offer-region-payment/", clusterId: "offers-offer-records-scope" },
  { title: "首购活动是否适用于续费，怎样寻找明确来源而不是猜测", url: "/offers/offer-first-vs-renewal/", clusterId: "offers-offer-records-scope" },

  // offers/offer-records/dates
  { title: "优惠公告、开始时间和截止时间如何分别登记", url: "/offers/offer-effective-dates/", clusterId: "offers-offer-records-dates" },
  { title: "没有写截止日期的优惠，为什么不能自动标为永久有效", url: "/offers/offer-no-end-date/", clusterId: "offers-offer-records-dates" },
  { title: "最近核验可用与当前一定可用有什么差别，如何表达更新状态", url: "/offers/offer-checked-not-guaranteed/", clusterId: "offers-offer-records-dates" },
  { title: "跨时区优惠结束时刻怎样展示，避免倒计时误导用户", url: "/offers/offer-time-boundary/", clusterId: "offers-offer-records-dates" },

  // offers/offer-records/status
  { title: "不付款情况下能核验优惠到哪一步，怎样说明验证局限", url: "/offers/offer-test-without-purchase/", clusterId: "offers-offer-records-status" },
  { title: "优惠码无法使用时，怎样区分资格不符与代码失效", url: "/offers/offer-failed-conditions/", clusterId: "offers-offer-records-status" },
  { title: "旧代码被新活动替代后，怎样维护记录和当前入口", url: "/offers/offer-replacement/", clusterId: "offers-offer-records-status" },
  { title: "已过期优惠应如何展示和移出当前清单，避免误导结算", url: "/offers/offer-expired-layout/", clusterId: "offers-offer-records-status" },

  // offers/offer-monitoring/change-log
  { title: "同一个优惠码折扣或条件变化时，怎样保留版本历史", url: "/offers/offer-version-history/", clusterId: "offers-offer-monitoring-change-log" },
  { title: "官方更正优惠公告后，本站应该怎样更新引用和计算依据", url: "/offers/offer-announcement-correction/", clusterId: "offers-offer-monitoring-change-log" },
  { title: "优惠来源页面被删除后，现行状态应该如何处理", url: "/offers/offer-source-disappeared/", clusterId: "offers-offer-monitoring-change-log" },
  { title: "活动门槛提高后，哪些旧比较结果需要重新计算", url: "/offers/offer-change-impact/", clusterId: "offers-offer-monitoring-change-log" },

  // offers/offer-monitoring/comparison
  { title: "两个可用活动不能叠加时，怎样把条件交给折扣计算器比较", url: "/offers/offer-a-or-b/", clusterId: "offers-offer-monitoring-comparison" },
  { title: "免费体验与首期折扣同时存在，怎样先判断自己符合哪个条件", url: "/offers/offer-free-period/", clusterId: "offers-offer-monitoring-comparison" },
  { title: "赠送流量活动和直接减价，优惠情报页怎样说明差异", url: "/offers/offer-gift-or-discount/", clusterId: "offers-offer-monitoring-comparison" },
  { title: "新购优惠不能用于续费时，为什么不能建议用户规避资格限制", url: "/offers/offer-repeat-purchase/", clusterId: "offers-offer-monitoring-comparison" },

  // offers/offer-monitoring/handoff
  { title: "从优惠情报进入主站，应带上哪些套餐条件而不是只传一个代码", url: "/offers/offer-to-main/", clusterId: "offers-offer-monitoring-handoff" },
  { title: "使用优惠前怎样再次核对最终订单，不把本站记录当实时承诺", url: "/offers/offer-checkout-final/", clusterId: "offers-offer-monitoring-handoff" },
  { title: "优惠码复制按钮应同时展示哪些限制，避免代码脱离条件传播", url: "/offers/offer-copy-design/", clusterId: "offers-offer-monitoring-handoff" },
  { title: "用户反馈优惠失效时，应收集哪些脱敏信息帮助复核", url: "/offers/offer-safe-feedback/", clusterId: "offers-offer-monitoring-handoff" },

  // offers/offer-monitoring/governance
  { title: "合作渠道提供优惠码时，应该怎样披露收益关系和核验方式", url: "/offers/offer-affiliate-disclosure/", clusterId: "offers-offer-monitoring-governance" },
  { title: "优惠列表按什么顺序展示才透明，商业优先级怎样单独说明", url: "/offers/offer-editorial-order/", clusterId: "offers-offer-monitoring-governance" },
  { title: "优惠台账怎样安排复核优先级，而不是每天机械刷新日期", url: "/offers/offer-maintenance-schedule/", clusterId: "offers-offer-monitoring-governance" },
  { title: "一条优惠从收录到下架应该保留哪些记录，方便以后纠错", url: "/offers/offer-audit-record/", clusterId: "offers-offer-monitoring-governance" },

  // 13. knowledge/billing-literacy/payment-concepts
  { title: "实付金额、月均费用和单位成本各自回答什么问题", url: "/knowledge/cash-average-cost/", clusterId: "knowledge-billing-literacy-payment-concepts" },
  { title: "机场服务费与客户端软件费为什么要分开看", url: "/knowledge/service-vs-software-price/", clusterId: "knowledge-billing-literacy-payment-concepts" },
  { title: "预付款、账户余额和可退款金额为什么不能互相替代", url: "/knowledge/prepayment-credit-refund/", clusterId: "knowledge-billing-literacy-payment-concepts" },
  { title: "付款周期、使用有效期与流量周期有什么关系", url: "/knowledge/payment-term-versus-use/", clusterId: "knowledge-billing-literacy-payment-concepts" },

  // knowledge/billing-literacy/traffic-units
  { title: "Mbps、MB每秒、GB和GiB怎样区分，费用比较为什么需要统一单位", url: "/knowledge/bits-bytes-gb/", clusterId: "knowledge-billing-literacy-traffic-units" },
  { title: "节点倍率如何影响流量扣除，什么信息不能仅靠倍率推断", url: "/knowledge/traffic-multiplier-basics/", clusterId: "knowledge-billing-literacy-traffic-units" },
  { title: "流量重置、结转与过期分别描述什么规则", url: "/knowledge/traffic-reset-expiry/", clusterId: "knowledge-billing-literacy-traffic-units" },
  { title: "带宽、速率和流量额度有什么不同：看套餐前的基础说明", url: "/knowledge/bandwidth-quota/", clusterId: "knowledge-billing-literacy-traffic-units" },

  // knowledge/billing-literacy/budget-reasoning
  { title: "平均费用与多用一点增加的费用有什么不同，套餐选择怎样用", url: "/knowledge/average-vs-marginal/", clusterId: "knowledge-billing-literacy-budget-reasoning" },
  { title: "已经支付的旧费用怎样影响后续比较，避免重复计入新方案", url: "/knowledge/sunk-cost-explanation/", clusterId: "knowledge-billing-literacy-budget-reasoning" },
  { title: "什么是预算情景分析：怎样改变假设而不制造确定预测", url: "/knowledge/sensitivity-explained/", clusterId: "knowledge-billing-literacy-budget-reasoning" },
  { title: "最低价格为什么不等于最佳适配：如何同时看约束与成本", url: "/knowledge/lowest-price-best-fit/", clusterId: "knowledge-billing-literacy-budget-reasoning" },

  // knowledge/billing-literacy/metric-literacy
  { title: "延迟与吞吐量分别影响什么任务，为什么不能直接换算成价格优势", url: "/knowledge/latency-throughput-cost/", clusterId: "knowledge-billing-literacy-metric-literacy" },
  { title: "丢包率应该怎样理解：测试方法、样本和目标决定了什么", url: "/knowledge/packet-loss-observation/", clusterId: "knowledge-billing-literacy-metric-literacy" },
  { title: "稳定性与可用率需要哪些定义，为什么观察窗口不可省略", url: "/knowledge/availability-window/", clusterId: "knowledge-billing-literacy-metric-literacy" },
  { title: "一次测速是怎样的证据：峰值、分布和持续表现的区别", url: "/knowledge/benchmark-snapshot/", clusterId: "knowledge-billing-literacy-metric-literacy" },

  // knowledge/network-cost-links/request-path
  { title: "客户端、代理核心、节点和机场服务分别负责哪一步", url: "/knowledge/client-core-service/", clusterId: "knowledge-network-cost-links-request-path" },
  { title: "系统代理、应用代理和TUN的范围差异如何影响实际用量", url: "/knowledge/proxy-scope-cost/", clusterId: "knowledge-network-cost-links-request-path" },
  { title: "订阅格式和节点协议有什么区别，转换配置为何不等于增加能力", url: "/knowledge/protocol-versus-format/", clusterId: "knowledge-network-cost-links-request-path" },
  { title: "共享出口、节点名称和实际IP怎样区分，数量为什么不能直接代表价值", url: "/knowledge/shared-exit-identity/", clusterId: "knowledge-network-cost-links-request-path" },

  // knowledge/network-cost-links/transport
  { title: "TCP与UDP的作用有什么不同，选服务时应如何对应实际应用", url: "/knowledge/tcp-udp-task/", clusterId: "knowledge-network-cost-links-transport" },
  { title: "QUIC相关连接条件怎样核对，为什么不能仅凭协议名字判断速度", url: "/knowledge/quic-compatibility/", clusterId: "knowledge-network-cost-links-transport" },
  { title: "TLS和代理隧道的保护范围怎样区分，为什么不能承诺绝对匿名", url: "/knowledge/tls-encryption-limits/", clusterId: "knowledge-network-cost-links-transport" },
  { title: "重传、应用重试与计费流量是什么关系，为什么不能套固定损耗比例", url: "/knowledge/retries-traffic-cost/", clusterId: "knowledge-network-cost-links-transport" },

  // knowledge/network-cost-links/dns-routing
  { title: "DNS解析和实际连接路径为何可能不同，购买判断应看哪些证据", url: "/knowledge/dns-route-explained/", clusterId: "knowledge-network-cost-links-dns-routing" },
  { title: "IPv4与IPv6可能走不同路径时，怎样理解连接与用量记录", url: "/knowledge/ipv4-ipv6-scope/", clusterId: "knowledge-network-cost-links-dns-routing" },
  { title: "Wi-Fi、网卡与路由器瓶颈怎样影响测速，为什么不一定是套餐问题", url: "/knowledge/local-bottleneck/", clusterId: "knowledge-network-cost-links-dns-routing" },
  { title: "直连、中转与专线宣传应怎样理解，哪些需要合同或实测依据", url: "/knowledge/line-type-claims/", clusterId: "knowledge-network-cost-links-dns-routing" },

  // knowledge/network-cost-links/evidence-literacy
  { title: "标准文档、商家声明、测试记录和用户反馈分别能证明什么", url: "/knowledge/source-types/", clusterId: "knowledge-network-cost-links-evidence-literacy" },
  { title: "软件版本变化为什么会改变兼容结论，文章应记录哪些版本条件", url: "/knowledge/version-specific-facts/", clusterId: "knowledge-network-cost-links-evidence-literacy" },
  { title: "发布日期、修改日、核验日和测试日各自代表什么", url: "/knowledge/provenance-dates/", clusterId: "knowledge-network-cost-links-evidence-literacy" },
  { title: "怎样写出可复查的机场选型结论，同时说明未知和利益关系", url: "/knowledge/transparent-conclusions/", clusterId: "knowledge-network-cost-links-evidence-literacy" }
];
