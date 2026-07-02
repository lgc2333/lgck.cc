<script setup lang="ts">
defineProps<{
  categories: string[]
  tags: string[]
  updated?: string | number | Date
}>()
</script>

<template>
  <div
    v-if="tags.length || categories.length || updated"
    class="lgc-article-meta"
    aria-label="Post metadata"
  >
    <span
      v-for="category in categories"
      :key="`category-${category}`"
      class="lgc-meta-chip"
    >
      {{ category }}
    </span>
    <span v-for="tag in tags" :key="`tag-${tag}`" class="lgc-meta-chip">
      #{{ tag }}
    </span>
    <span v-if="updated" class="lgc-meta-chip">
      Updated <LgcPostDate :date="updated" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.lgc-article-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  line-height: 1.4;

  :deep(.lgc-date) {
    color: inherit;
    font-size: inherit;
  }
}
</style>
