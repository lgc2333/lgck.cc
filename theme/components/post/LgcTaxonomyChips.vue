<script setup lang="ts">
import type { Post, PostCollectionInfo } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { normalizePostListValue } from '../../utils/post'
import { categoryRouteLocation, tagRouteLocation } from '../../utils/taxonomy'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    collections?: PostCollectionInfo[]
    tags?: Post['tags']
    tone?: 'default' | 'on-cover'
  }>(),
  {
    collections: () => [],
    tone: 'default',
  },
)

const { t } = useI18n()
const { $tCategory, $tO, $tTag } = useValaxyI18n()
const tagClass = computed(() => [
  'lgc-post-meta-chip',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])
const collectionItems = computed(() =>
  props.collections
    .map(({ collection, itemIndex }) => {
      const path =
        collection.path || (collection.key ? `/collections/${collection.key}/` : '')
      const name =
        $tO(collection.title || collection.name || collection.key || '') ||
        t('collection.badge')
      const total = collection.items?.length || 0
      const position = itemIndex >= 0 && total > 0 ? `${itemIndex + 1}/${total}` : ''
      const title = position
        ? `${t('collection.article_hint_title', { name })} (${position})`
        : t('collection.article_hint_title', { name })

      return {
        key: collection.key || collection.path || name,
        name,
        path,
        title,
      }
    })
    .filter((item) => item.path),
)
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
    :to="categoryRouteLocation(categories)"
  >
    <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
    <span>{{ categoryLabel }}</span>
  </RouterLink>
  <RouterLink
    v-for="item in collectionItems"
    :key="item.key"
    class="is-link"
    :class="tagClass"
    :to="item.path"
    :title="item.title"
  >
    <span i-material-symbols-auto-stories-rounded aria-hidden="true" />
    <span>{{ item.name }}</span>
  </RouterLink>
  <RouterLink
    v-for="item in tagItems"
    :key="item.tag"
    class="is-link"
    :class="tagClass"
    :to="tagRouteLocation(item.tag)"
  >
    <span i-material-symbols-tag-rounded aria-hidden="true" />
    <span>{{ item.label }}</span>
  </RouterLink>
</template>
