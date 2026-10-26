<template>
  <div class="answer-first-box">
    <div class="af-header">
      <span class="af-icon">💡</span>
      <span class="af-title"><slot name="title">核心结论摘要 (Answer-First)</slot></span>
    </div>
    <div class="af-content">
      <slot></slot>
    </div>
    <div v-if="$slots.conditions" class="af-conditions">
      <strong>适用前提与限制：</strong>
      <slot name="conditions"></slot>
    </div>
  </div>
</template>

<style scoped>
.answer-first-box {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
  border-top: 1px solid #e0f2fe;
  border-right: 1px solid #e0f2fe;
  border-bottom: 1px solid #e0f2fe;
  border-radius: 0 8px 8px 0;
  padding: 1.15rem 1.25rem;
  margin: 1.5rem 0;
}
.af-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.af-icon { font-size: 1.1rem; }
.af-title {
  font-weight: 700;
  color: #0369a1;
  font-size: 0.95rem;
}
.af-content {
  font-size: 0.925rem;
  color: #1e293b;
  line-height: 1.65;
}
.af-conditions {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #bae6fd;
  font-size: 0.8125rem;
  color: #475569;
}
</style>
