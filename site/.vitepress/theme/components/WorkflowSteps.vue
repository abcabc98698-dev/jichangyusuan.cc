<template>
  <div class="workflow-container">
    <div class="workflow-header">
      <div class="wf-title-group">
        <span class="wf-badge">实操推导算法</span>
        <h4 class="wf-title">{{ title || '标准推导与量化核算工作流' }}</h4>
      </div>
      <span class="wf-hint">纯前端内存复算 · 零敏感数据上传</span>
    </div>

    <div class="workflow-pipeline">
      <div 
        v-for="(item, idx) in steps" 
        :key="idx" 
        class="wf-step-card"
      >
        <div class="wf-indicator">
          <div class="wf-num">{{ idx + 1 }}</div>
          <div v-if="idx < steps.length - 1" class="wf-line"></div>
        </div>
        <div class="wf-body">
          <div class="wf-step-name">{{ item.name }}</div>
          <p class="wf-step-desc">{{ item.description }}</p>
          <div v-if="item.action" class="wf-step-action">
            <span class="action-tag">核验对策</span>
            <span class="action-text">{{ item.action }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface WorkflowStep {
  name: string;
  description: string;
  action?: string;
}

defineProps<{
  title?: string;
  steps: WorkflowStep[];
}>();
</script>

<style scoped>
.workflow-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 1.75rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.workflow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
}

.wf-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.wf-badge {
  background: #0284c7;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.wf-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.wf-hint {
  font-size: 0.8125rem;
  color: #64748b;
}

.workflow-pipeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wf-step-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

.wf-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 32px;
}

.wf-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0284c7;
  border: 2px solid #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
  z-index: 1;
}

.wf-line {
  width: 2px;
  flex-grow: 1;
  min-height: 48px;
  background: #cbd5e1;
  margin: 4px 0;
}

.wf-body {
  flex-grow: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.85rem 1.15rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.wf-step-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.wf-step-desc {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 0.5rem 0;
}

.wf-step-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f0f9ff;
  border-left: 3px solid #0284c7;
  padding: 0.4rem 0.65rem;
  border-radius: 0 4px 4px 0;
  font-size: 0.8125rem;
}

.action-tag {
  color: #0369a1;
  font-weight: 700;
  flex-shrink: 0;
}

.action-text {
  color: #0f172a;
}

@media (max-width: 640px) {
  .workflow-container {
    padding: 1rem;
  }
  .wf-indicator {
    width: 26px;
  }
  .wf-num {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
}
</style>
