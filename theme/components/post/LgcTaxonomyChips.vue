<script setup lang="ts">
import type { Post } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'

import { normalizePostCategoryQuery, normalizePostListValue } from '../../utils/post'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    tags?: Post['tags']
    tone?: 'default' | 'on-cover'
  }>(),
  {
    tone: 'default',
  },
)

const { $tCategory, $tTag } = useValaxyI18n()
const tagClass = computed(() => [
  'lgc-post-tag',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])
const categoryQuery = computed(() => normalizePostCategoryQuery(props.categories))
const categoryLabel = computed(() => {
  if (!props.categories) return ''
  if (Array.isArray(props.categories))
    return props.categories.map((c) => $tCategory(String(c))).join(' / ')
  return $tCategory(String(props.categories))
})
const tagItems = computed(() =>
  normalizePostListValue(props.tags).map((tag) => ({
    tag,
    label: $tTag(tag),
  })),
)
</script>

<template>
  <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children -->
  <RouterLink
    v-if="categoryLabel"
    class="is-link"
    :class="tagClass"
    :to="{ path: '/categories', query: { category: categoryQuery } }"
  >
    <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
    <span>{{ categoryLabel }}</span>
  </RouterLink>
  <RouterLink
    v-for="item in tagItems"
    :key="item.tag"
    class="is-link"
    :class="tagClass"
    :to="{ path: '/tags/', query: { tag: item.tag } }"
  >
    <span i-material-symbols-tag-rounded aria-hidden="true" />
    <span>{{ item.label }}</span>
  </RouterLink>
</template>
