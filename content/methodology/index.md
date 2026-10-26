---
title: 评测方法论 ｜ 费用精算与算法模型白皮书
description: 机场预算（jichangyusuan.cc）五大计算器算法数学推导、数据采样口径、汇率与网关损耗模型，以及防坑审计指标体系。
---

# 评测方法论 (Methodology & Calculator Models)

在网络订阅服务市场中，商家标明的“折算月付”往往严重偏离消费者的“真实法币支出”。本白皮书系统公开「机场预算」站内五大核心计算器的数学推演模型与数据校验规范。

---

## 1. 五大计算器数学模型

### 1.1 真实首次实付模型 (Initial Cash Outlay Model)
首次支出的核心在于界定**不可逆沉没成本**与**第三方摩擦成本**：
$$\text{Total Initial Cost} = \text{Plan Nominal Price} \times (1 + \text{Gateway Fee Rate}) + \text{FX Loss} + \text{One-time Setup Fee} + \text{Client License}$$
- **网关处理费**：第三方聚合收银台通常加收 $2\% \sim 5\%$ 的手续费或固定笔费（¥1.0 ~ ¥2.5）。
- **客户端买断费**：独立买断软件属于终身数字资产，严禁摊入首月日常流量单价中混淆视听。

### 1.2 年付盈亏平衡期推演 (Annual Break-Even Horizon)
年付打折虽然降低了月均账面价格，但锁死了流动性并承受跑路风险：
$$\text{Break-Even Months} = \frac{\text{Annual Price}}{\text{Monthly Price}}$$
- 若盈亏平衡期为 8 个月，而该机场的历史存续周期或线路稳定性观察窗口小于 8 个月，则选择年付在财务上呈现负期望值。

### 1.3 真实流量有效单价公式 (Effective Bandwidth Cost)
名义流量不等于可用流量：
$$\text{Effective Unit Price} = \frac{\text{Monthly Plan Price}}{\text{Nominal Quota (GB)} \times \text{Average Node Multiplier}} \times (1 + \text{Retry Traffic Overhead})$$
- **倍率折算**：当高品质专线倍率为 3.0x 时，100GB 套餐实际仅能传输 33.3GB 数据。
- **重传损耗**：在丢包率达到 $5\% \sim 15\%$ 的劣质网络环境下，TCP 拥塞重传将额外消耗有效流量。

### 1.4 折扣真实让利核算 (True Discount Audit)
识别“先涨后折”或“仅限首期优惠”：
$$\text{Annualized Discount} = \frac{\text{First Term Price} + (N - 1) \times \text{Regular Renewal Price}}{N \times \text{Regular Renewal Price}}$$

### 1.5 续费与迁移成本估算 (Renewal Drift & Migration Friction)
续费价格漂移与重新配置所消耗的时间和过渡开销。

---

## 2. 数据采集与核验规范

1. **客观采样**：所有套餐样本均来自服务商公开收银台，严禁采用未公开的内测特权数据。
2. **十进制定点运算**：所有前端计算器统一使用基于纯函数的精准定点换算，杜绝浮点数精度误差。
3. **版本与时效标注**：所有评测均标明数据核验月份与客户端版本号。
