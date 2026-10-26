<template>
  <span :class="['source-badge', `badge-${type}`]" :title="tooltip">
    <span class="badge-dot"></span>
    <span class="badge-text"><slot>{{ label }}</slot></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'official' | 'calc' | 'test' | 'feedback' | 'unverified';
}>(), {
  type: 'calc'
});

const label = computed(() => {
  switch (props.type) {
    case 'official': return '官方公开条款';
    case 'calc': return '本站纯数学演算';
    case 'test': return '实验室条件测算';
    case 'feedback': return '用户脱敏账本样本';
    case 'unverified': return '待核验/未知项';
    default: return '数据核验';
  }
});

const tooltip = computed(() => {
  switch (props.type) {
    case 'official': return '信息源于服务商官网/公开Tos/计费文档';
    case 'calc': return '基于输入假设的确定性公式计算，非品牌固定承诺';
    case 'test': return '特定时间与单点网络下的实测记录';
    case 'feedback': return '经过授权与脱敏处理的实际支出案例';
    case 'unverified': return '缺少官方明确依据，按保留未知项处理';
    default: return '';
  }
});
</script>

<style scoped>
.source-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  line-height: 1.4;
  vertical-align: middle;
  margin: 0 4px;
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.badge-calc {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.badge-calc .badge-dot { background: #22c55e; }

.badge-official {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}
.badge-official .badge-dot { background: #0284c7; }

.badge-test {
  background: #fdf4ff;
  color: #86198f;
  border: 1px solid #f5d0fe;
}
.badge-test .badge-dot { background: #c026d3; }

.badge-feedback {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
.badge-feedback .badge-dot { background: #f59e0b; }

.badge-unverified {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.badge-unverified .badge-dot { background: #ef4444; }
</style>
