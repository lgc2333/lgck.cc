<script setup lang="ts">
import { computed } from 'vue'

import { formatPostDate, shouldShowPostUpdated } from '../utils/post'

const props = withDefaults(
  defineProps<{
    category?: string
    tags?: string[]
    created?: string | number | Date
    updated?: string | number | Date
    /** Cover-on-image chip tone (owned here; no parent :deep). */
    tone?: 'default' | 'on-cover'
  }>(),
  {
    tone: 'default',
  },
)

const createdText = computed(() =>
  props.created != null && props.created !== '' ? formatPostDate(props.created) : '',
)
const updatedText = computed(() =>
  shouldShowPostUpdated(props.created, props.updated)
    ? formatPostDate(props.updated)
    : '',
)

const tagClass = computed(() => [
  'lgc-post-tag',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])
</script>

<template>
  <span v-if="createdText" :class="tagClass" title="Created">
    <span i-material-symbols-calendar-month-outline-rounded aria-hidden="true" />
    <time :datetime="createdText">{{ createdText }}</time>
  </span>
  <span v-if="updatedText" :class="tagClass" title="Updated">
    <span i-material-symbols-edit-calendar-outline-rounded aria-hidden="true" />
    <time :datetime="updatedText">{{ updatedText }}</time>
  </span>
  <span v-if="category" :class="tagClass">
    <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
    {{ category }}
  </span>
  <span v-for="tag in tags" :key="tag" :class="tagClass">
    <span i-material-symbols-tag-rounded aria-hidden="true" />
    {{ tag }}
  </span>
</template>

<style scoped lang="scss">
.lgc-post-tag {
  @apply 'inline-flex items-center gap-[2px] min-h-$lgc-meta-chip-min-height';
  @apply 'px-$lgc-space-md rounded-$lgc-radius-full';
  @apply 'text-$md-sys-color-on-secondary-container text-size-$lgc-label-small';
  @apply 'font-700 bg-$md-sys-color-secondary-container';
}

// Residual: color-mix on-cover tone.
.lgc-post-tag.is-on-cover {
  color: color-mix(in srgb, var(--md-sys-color-on-secondary-container) 88%, white);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 78%,
    transparent
  );
}
</style>
