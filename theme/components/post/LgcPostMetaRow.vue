<script setup lang="ts">
import type { Post, PostCollectionInfo } from 'valaxy'
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  formatPostDate,
  formatPostTimestamp,
  normalizePostListValue,
  shouldShowPostUpdated,
} from '../../utils/post'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    collections?: PostCollectionInfo[]
    tags?: Post['tags']
    created?: string | number | Date
    updated?: string | number | Date
    wordCount?: Post['wordCount']
    readingTime?: Post['readingTime']
    tone?: 'default' | 'on-cover'
    align?: 'start' | 'center'
  }>(),
  {
    tone: 'default',
    align: 'start',
    collections: () => [],
  },
)

const { t } = useI18n()
const siteConfig = useSiteConfig()
const tagClass = computed(() => [
  'lgc-post-meta-chip',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])
const rowClass = computed(() => [
  'flex flex-wrap gap-$lgc-space-sm',
  props.align === 'center' ? 'justify-center' : '',
])
const createdText = computed(() => {
  if (props.created == null || props.created === '') return ''
  return formatPostDate(props.created)
})
const createdTitle = computed(() => {
  if (!createdText.value) return ''
  return t('post.posted') + formatPostTimestamp(props.created)
})
const updatedText = computed(() => {
  if (!shouldShowPostUpdated(props.created, props.updated)) return ''
  return formatPostDate(props.updated)
})
const updatedTitle = computed(() => {
  if (!updatedText.value) return ''
  return t('post.edited') + formatPostTimestamp(props.updated)
})
const showStatistics = computed(() => Boolean(siteConfig.value.statistics?.enable))
const wordCountText = computed(() => {
  if (!showStatistics.value || !props.wordCount) return ''
  return t('statistics.word_count', { n: props.wordCount })
})
const readingTimeText = computed(() => {
  if (!showStatistics.value || props.readingTime == null || props.readingTime === 0)
    return ''
  return t('statistics.reading_time', { n: props.readingTime })
})
const tagItems = computed(() => normalizePostListValue(props.tags))
const hasMeta = computed(
  () =>
    Boolean(createdText.value) ||
    Boolean(updatedText.value) ||
    Boolean(wordCountText.value) ||
    Boolean(readingTimeText.value) ||
    props.collections.length > 0 ||
    Boolean(props.categories) ||
    tagItems.value.length > 0,
)
</script>

<template>
  <div v-if="hasMeta" class="lgc-post-meta" leading="[1.4]" :class="rowClass">
    <span v-if="createdText" :class="tagClass" :title="createdTitle">
      <span i-material-symbols-calendar-month-outline-rounded aria-hidden="true" />
      <time :datetime="createdText">{{ createdText }}</time>
    </span>
    <span v-if="updatedText" :class="tagClass" :title="updatedTitle">
      <span i-material-symbols-edit-calendar-outline-rounded aria-hidden="true" />
      <time :datetime="updatedText">{{ updatedText }}</time>
    </span>
    <span v-if="wordCountText" :class="tagClass" :title="t('statistics.word')">
      <span i-material-symbols-article-outline-rounded aria-hidden="true" />
      {{ wordCountText }}
    </span>
    <span v-if="readingTimeText" :class="tagClass" :title="t('statistics.time')">
      <span i-material-symbols-timer-outline-rounded aria-hidden="true" />
      <time>{{ readingTimeText }}</time>
    </span>
    <LgcTaxonomyChips
      :categories="categories"
      :collections="collections"
      :tags="tags"
      :tone="tone"
    />
  </div>
</template>
