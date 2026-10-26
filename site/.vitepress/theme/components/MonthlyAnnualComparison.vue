<template>
  <div class="calculator-card" data-pagefind-ignore>
    <div class="calc-header">
      <div class="calc-badge">长周期对比工具</div>
      <h3>月付 vs 年付现金流与平衡点演算</h3>
      <p class="calc-sub">算出真实第几个月相等，不把预付折算当成随时可退的低价</p>
    </div>

    <div class="calc-grid">
      <div class="form-group">
        <label for="c-monthly">月付单月标价 (元/月)</label>
        <input id="c-monthly" type="number" min="1" step="1" v-model.number="monthlyPrice" />
      </div>
      <div class="form-group">
        <label for="c-annual">年付单次全款 (元/年)</label>
        <input id="c-annual" type="number" min="1" step="1" v-model.number="annualPrice" />
      </div>
      <div class="form-group">
        <label for="c-months">比较观察月份数 (1~24个月)</label>
        <input id="c-months" type="number" min="1" max="24" v-model.number="months" />
      </div>
    </div>

    <div v-if="result.success && result.data" class="calc-results">
      <div class="result-highlight-row">
        <div class="highlight-box">
          <div class="h-label">现金平衡点月份</div>
          <div class="h-val">
            <span v-if="result.data.breakEvenMonth > 0">第 {{ result.data.breakEvenMonth }} 个月</span>
            <span v-else>未打平</span>
          </div>
          <div class="h-note">在此月之前月付累计现金更省</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">年付折算月均价</div>
          <div class="h-val">¥{{ result.data.annualEquivalentMonthly }} /月</div>
          <div class="h-note">注意：首次付款仍须全额掏出 ¥{{ annualPrice }}</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">首次付款现金差额</div>
          <div class="h-val">+¥{{ result.data.firstPaymentDifference }}</div>
          <div class="h-note">年付首月对现金流的额外占用</div>
        </div>
      </div>

      <div class="timeline-table-wrap">
        <table class="timeline-table">
          <thead>
            <tr>
              <th>月份</th>
              <th>月付累计现金</th>
              <th>年付累计现金</th>
              <th>差额 (月付-年付)</th>
              <th>结论判断</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="point in result.data.timeline" :key="point.month" :class="{ 'row-highlight': point.month === result.data.breakEvenMonth }">
              <td>第 {{ point.month }} 个月</td>
              <td>¥{{ point.monthlyCumulativeCash }}</td>
              <td>¥{{ point.annualCumulativeCash }}</td>
              <td>
                <span :class="point.difference >= 0 ? 'text-green' : 'text-blue'">
                  {{ point.difference >= 0 ? `省 ¥${point.difference}` : `多付 ¥${-point.difference}` }}
                </span>
              </td>
              <td>
                <span v-if="point.month < result.data.breakEvenMonth" class="tag-status tag-monthly">月付更省现金</span>
                <span v-else-if="point.month === result.data.breakEvenMonth" class="tag-status tag-even">刚好持平</span>
                <span v-else class="tag-status tag-annual">年付累计更省</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="calc-assumptions">
        <strong>假设与风险边界：</strong>
        <ul>
          <li v-for="(asm, idx) in result.data.assumptions" :key="idx">{{ asm }}</li>
        </ul>
      </div>

      <div class="calc-cta-bridge">
        <a :href="handoffUrl" target="_blank" rel="nofollow sponsored noopener" class="cta-link-btn">
          前往主站「机场榜一」对比同价位下各服务商线路稳定性 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { compareMonthlyAnnual } from '@lib/calc';
import { buildMainSiteHandoffUrl } from '@lib/links/handoff';

const monthlyPrice = ref(15);
const annualPrice = ref(120);
const months = ref(12);

const result = computed(() => {
  return compareMonthlyAnnual({
    monthlyPlanPrice: monthlyPrice.value,
    annualPlanPrice: annualPrice.value,
    comparisonMonths: months.value
  });
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: 'compare',
    campaign: 'monthly_compare',
    content: 'monthly_annual_comparison_result'
  });
});
</script>

<style scoped>
.calculator-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.calc-header { margin-bottom: 1.25rem; }
.calc-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.calc-header h3 { margin: 0 0 0.25rem; font-size: 1.25rem; color: #0f172a; }
.calc-sub { margin: 0; font-size: 0.875rem; color: #64748b; }
.calc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group label { font-size: 0.8125rem; font-weight: 500; color: #334155; }
.form-group input {
  padding: 0.5rem 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  color: #0f172a;
}
.calc-results {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
}
.result-highlight-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.highlight-box {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}
.h-label { font-size: 0.75rem; color: #475569; }
.h-val { font-size: 1.35rem; font-weight: 700; color: #0369a1; margin: 0.2rem 0; }
.h-note { font-size: 0.7rem; color: #94a3b8; }
.timeline-table-wrap {
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}
.timeline-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  text-align: left;
}
.timeline-table th {
  background: #f8fafc;
  padding: 0.6rem 0.75rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}
.timeline-table td {
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}
.row-highlight {
  background: #fefce8 !important;
  font-weight: 600;
}
.text-green { color: #16a34a; font-weight: 600; }
.text-blue { color: #0284c7; }
.tag-status {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.tag-monthly { background: #e0f2fe; color: #0369a1; }
.tag-even { background: #fef08a; color: #854d0e; }
.tag-annual { background: #dcfce7; color: #15803d; }
.calc-assumptions {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}
.calc-assumptions ul { margin: 0.25rem 0 0; padding-left: 1.25rem; }
.calc-cta-bridge { margin-top: 1.25rem; text-align: center; }
.cta-link-btn {
  display: inline-block;
  background: #0284c7;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
}
.cta-link-btn:hover { background: #0369a1; }
</style>
