<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <div class="nav-search-slot">
        <SearchModal />
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import SearchModal from './components/SearchModal.vue';
</script>

<style scoped>
.nav-search-slot {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
@media (max-width: 768px) {
  .nav-search-slot {
    margin-left: 0.5rem;
  }
}
</style>
