<template>
  <div class="price-table-container">
    <div class="table-header-desc">
      <span class="table-badge">结构化参数表</span>
      <h4>{{ title || '典型套餐横向精算对比表' }}</h4>
      <p>标称价格、周期折算、真实倍率预算与设备限制综合呈现，无隐瞒条款</p>
    </div>

    <div class="table-scroll-wrapper">
      <table class="numbers-table">
        <thead>
          <tr>
            <th>方案类型</th>
            <th>付款周期</th>
            <th>单期首次实付</th>
            <th>月均折算成本</th>
            <th>标称流量额度</th>
            <th>综合倍率</th>
            <th>实际可用预算</th>
            <th>连接设备限制</th>
            <th>核验依据</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx">
            <td class="col-name"><strong>{{ row.name }}</strong></td>
            <td><span class="badge-cycle">{{ row.cycle }}</span></td>
            <td class="col-price">¥{{ row.firstPay }}</td>
            <td class="col-monthly">¥{{ row.monthlyEq }} /月</td>
            <td>{{ row.nominalQuota }}</td>
            <td><span class="badge-multi">{{ row.multiplier }}x</span></td>
            <td class="col-effective">{{ row.effectiveQuota }}</td>
            <td>{{ row.deviceLimit }}</td>
            <td class="col-source">
              <span class="badge-verified">{{ row.source }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer-note">
      注：以上数值为标准模型假设演算，单位均为人民币元（CNY）；真实下单前须在商家结账页核对支付通道费与优惠资格。
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ComparisonRow {
  name: string;
  cycle: string;
  firstPay: number;
  monthlyEq: number;
  nominalQuota: string;
  multiplier: number;
  effectiveQuota: string;
  deviceLimit: string;
  source: string;
}

withDefaults(defineProps<{
  title?: string;
  rows?: ComparisonRow[];
}>(), {
  rows: () => [
    {
      name: '轻度体验入门型',
      cycle: '月付',
      firstPay: 12,
      monthlyEq: 12.00,
      nominalQuota: '50 GB',
      multiplier: 1.0,
      effectiveQuota: '50 GB',
      deviceLimit: '2 台同时在线',
      source: '纯数学演算'
    },
    {
      name: '日常主力性价比型',
      cycle: '年付',
      firstPay: 120,
      monthlyEq: 10.00,
      nominalQuota: '150 GB/月',
      multiplier: 1.0,
      effectiveQuota: '150 GB/月',
      deviceLimit: '3 台同时在线',
      source: '纯数学演算'
    },
    {
      name: '多设备大流量型',
      cycle: '月付',
      firstPay: 35,
      monthlyEq: 35.00,
      nominalQuota: '500 GB',
      multiplier: 1.5,
      effectiveQuota: '333 GB',
      deviceLimit: '5 台同时在线',
      source: '纯数学演算'
    },
    {
      name: '极客高带宽专线型',
      cycle: '季付',
      firstPay: 120,
      monthlyEq: 40.00,
      nominalQuota: '300 GB/月',
      multiplier: 2.0,
      effectiveQuota: '150 GB/月',
      deviceLimit: '不限设备/限连接',
      source: '纯数学演算'
    }
  ]
});
</script>

<style scoped>
.price-table-container {
  margin: 2rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.table-header-desc {
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.table-badge {
  display: inline-block;
  font-size: 0.725rem;
  font-weight: 700;
  color: #0369a1;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.35rem;
}
.table-header-desc h4 { margin: 0 0 0.25rem; font-size: 1.15rem; color: #0f172a; }
.table-header-desc p { margin: 0; font-size: 0.85rem; color: #64748b; }
.table-scroll-wrapper {
  overflow-x: auto;
}
.numbers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  text-align: left;
}
.numbers-table th {
  background: #f1f5f9;
  color: #334155;
  font-weight: 600;
  padding: 0.75rem 1rem;
  white-space: nowrap;
  border-bottom: 1px solid #cbd5e1;
}
.numbers-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  white-space: nowrap;
}
.numbers-table tbody tr:hover {
  background: #f8fafc;
}
.col-price {
  font-weight: 700;
  color: #0369a1;
}
.col-monthly {
  font-weight: 600;
  color: #16a34a;
}
.col-effective {
  font-weight: 600;
  color: #0f172a;
}
.badge-cycle {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.badge-multi {
  background: #fef3c7;
  color: #b45309;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
}
.badge-verified {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.table-footer-note {
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
  background: #fafafa;
  border-top: 1px solid #f1f5f9;
}
</style>
