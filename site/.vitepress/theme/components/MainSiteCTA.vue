<template>
  <div class="mainsite-cta-card" data-pagefind-ignore>
    <div class="mcta-header">
      <span class="mcta-tag">选购交接</span>
      <h4>{{ title || '已算清预算？前往主站「机场榜一」挑选已核验服务' }}</h4>
    </div>
    <p class="mcta-desc">
      {{ description || '本站（机场预算）专注于费用精算与防坑模型；具体服务商综合排名、流媒体/专线解锁跑分及实时下单购买，由唯一主站「机场榜一」承接。' }}
    </p>

    <div class="mcta-action-area">
      <a :href="handoffUrl" target="_blank" rel="noopener noreferrer" class="mcta-button">
        前往主站机场榜一 {{ buttonText ? `(${buttonText})` : '' }} ↗
      </a>
      <span class="mcta-disclosure">
        本站与「机场榜一」同属站群协作网络。点击将以标准转介方式跳转至主站，不含您的个人隐私或本地预算输入数据。
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildMainSiteHandoffUrl, MainSiteHandoffTarget } from '@lib/links/handoff';

const props = withDefaults(defineProps<{
  target?: MainSiteHandoffTarget;
  campaign?: string;
  content?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}>(), {
  target: 'pricing',
  campaign: 'budget_selection',
  content: 'inline_cta_card'
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: props.target,
    campaign: props.campaign,
    content: props.content
  });
});
</script>

<style scoped>
.mainsite-cta-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}
.mcta-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}
.mcta-tag {
  background: #0284c7;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.mcta-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}
.mcta-desc {
  margin: 0.4rem 0 1rem;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
}
.mcta-action-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mcta-button {
  display: inline-block;
  align-self: flex-start;
  background: #0284c7;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.mcta-button:hover {
  background: #0369a1;
  box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);
}
.mcta-disclosure {
  font-size: 0.725rem;
  color: #94a3b8;
  line-height: 1.4;
}
</style>
