<template>
  <div class="answer-first-card">
    <div class="af-top-bar">
      <div class="af-badge-group">
        <span class="af-icon">💡</span>
        <span class="af-badge">核心结论 · ANSWER-FIRST</span>
      </div>
      <span class="af-timer">30 秒速览核心决策</span>
    </div>

    <div class="af-headline">
      <slot name="title">核心决策结论</slot>
    </div>

    <div class="af-body">
      <slot></slot>
    </div>

    <div v-if="$slots.conditions" class="af-footer">
      <div class="af-conditions-header">
        <span class="cond-icon">⚖️</span>
        <span class="cond-label">适用前提与边界约束</span>
      </div>
      <div class="cond-body">
        <slot name="conditions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.answer-first-card {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-left: 5px solid #0284c7;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 1.75rem 0;
  box-shadow: 0 4px 12px -2px rgba(2, 132, 199, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02);
}

.af-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.af-badge-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.af-icon {
  font-size: 1.15rem;
}

.af-badge {
  background: #0284c7;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.af-timer {
  font-size: 0.8125rem;
  color: #0369a1;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.af-headline {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.65rem;
  line-height: 1.45;
}

.af-body {
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.75;
}

.af-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e2e8f0;
  background: #f8fafc;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-bottom: -1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 0.85rem;
  border-radius: 0 0 9px 9px;
}

.af-conditions-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.35rem;
}

.cond-icon {
  font-size: 0.9rem;
}

.cond-body {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.6;
}
</style>
