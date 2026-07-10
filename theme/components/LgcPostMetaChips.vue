<script setup lang="ts">
import { computed } from 'vue'

import { formatPostDate, shouldShowPostUpdated } from '../utils/post'

const props = defineProps<{
  category?: string
  tags?: string[]
  created?: string | number | Date
  updated?: string | number | Date
}>()

const createdText = computed(() =>
  props.created != null && props.created !== '' ? formatPostDate(props.created) : '',
)
const updatedText = computed(() =>
  shouldShowPostUpdated(props.created, props.updated)
    ? formatPostDate(props.updated)
    : '',
)
</script>

<template>
  <span v-if="createdText" class="lgc-post-tag lgc-chip-tonal" title="Created">
    <span i-material-symbols-calendar-month-outline-rounded aria-hidden="true" />
    <time class="lgc-post-tag-time" :datetime="createdText">{{ createdText }}</time>
  </span>
  <span v-if="updatedText" class="lgc-post-tag lgc-chip-tonal" title="Updated">
    <span i-material-symbols-edit-calendar-outline-rounded aria-hidden="true" />
    <time class="lgc-post-tag-time" :datetime="updatedText">{{ updatedText }}</time>
  </span>
  <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
    <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
    {{ category }}
  </span>
  <span v-for="tag in tags" :key="tag" class="lgc-post-tag lgc-chip-tonal">
    <span i-material-symbols-tag-rounded aria-hidden="true" />
    {{ tag }}
  </span>
</template>

<style scoped lang="scss">
.lgc-post-tag {
  gap: 0.125rem;
  min-height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.lgc-post-tag-time {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}
</style>
