<script setup lang="ts">
import { formatDate } from 'valaxy'
import { computed } from 'vue'

import { normalizePostCategoryPath } from '../utils/post'

const props = defineProps<{
  categories: string[]
  tags: string[]
  created?: string | number | Date
  updated?: string | number | Date
}>()

const shouldShowUpdated = computed(() => {
  if (!props.updated) return false
  if (!props.created) return true

  return formatDate(props.updated) !== formatDate(props.created)
})

const category = computed(() => normalizePostCategoryPath(props.categories))
</script>

<template>
  <div
    v-if="created || shouldShowUpdated || tags.length || category"
    class="lgc-article-meta"
    aria-label="Post metadata"
  >
    <span v-if="created" class="lgc-post-tag lgc-chip-tonal" title="Created">
      <span i-material-symbols-calendar-month-outline-rounded aria-hidden="true" />
      <LgcPostDate :date="created" />
    </span>
    <span v-if="shouldShowUpdated" class="lgc-post-tag lgc-chip-tonal" title="Updated">
      <span i-material-symbols-edit-calendar-outline-rounded aria-hidden="true" />
      <LgcPostDate :date="updated" />
    </span>
    <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
      <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
      {{ category }}
    </span>
    <span v-for="tag in tags" :key="`tag-${tag}`" class="lgc-post-tag lgc-chip-tonal">
      <span i-material-symbols-tag-rounded aria-hidden="true" />
      {{ tag }}
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
}

.lgc-post-tag {
  gap: 0.125rem;
  min-height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;

  :deep(.lgc-date) {
    color: inherit;
    font-size: inherit;
  }
}
</style>
