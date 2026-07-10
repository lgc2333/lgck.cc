<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../composables'
import type { CoverContentMask, CoverContentPosition, LgcPost } from '../types'
import {
  formatPostDateParts,
  normalizeLocaleText,
  normalizePostCategoryPath,
  normalizePostListValue,
} from '../utils/post'

const props = defineProps<{
  post: LgcPost
}>()

const themeConfig = useThemeConfig()
const { locale } = useI18n()

const date = computed(() => formatPostDateParts(props.post.date))
const category = computed(() => normalizePostCategoryPath(props.post.categories))
const tags = computed(() => normalizePostListValue(props.post.tags).slice(0, 3))
const title = computed(() => normalizeLocaleText(props.post.title, locale.value))
const hasCover = computed(() => Boolean(props.post.cover))
const postPath = computed(() => props.post.path || '')
const coverContentMask = computed<CoverContentMask>(() => {
  const mask =
    props.post.coverContentMask ?? themeConfig.value.postFeed?.coverContentMask
  return mask === 'card' ? 'card' : 'gradient'
})
const coverContentPosition = computed<CoverContentPosition>(() => {
  const position =
    props.post.coverContentPosition ?? themeConfig.value.postFeed?.coverContentPosition
  return position === 'right' ? 'right' : 'left'
})
</script>

<template>
  <article
    class="lgc-post-card lgc-card-link"
    :class="{
      'has-cover': hasCover,
    }"
  >
    <LgcPostStatusIcons :post="post" />

    <LgcPostFeedCoverMask
      v-if="post.cover"
      :category="category"
      :cover="post.cover"
      :date="date"
      :excerpt="post.excerpt"
      :excerpt-type="post.excerpt_type"
      :mask="coverContentMask"
      :path="postPath"
      :position="coverContentPosition"
      :tags="tags"
      :title="title"
    />

    <LgcPostFeedPlainCard
      v-else
      :category="category"
      :date="date"
      :excerpt="post.excerpt"
      :excerpt-type="post.excerpt_type"
      :path="postPath"
      :tags="tags"
      :title="title"
    />
  </article>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-post-card {
  --lgc-post-card-rest-bg: var(--md-sys-color-surface-container-low);

  position: relative;
  display: grid;
  grid-template-columns: 5.25rem minmax(0, 1fr);
  align-items: start;
  gap: var(--lgc-space-lg);
  padding: var(--lgc-space-xl);
  background: var(--lgc-post-card-rest-bg);
}

.lgc-post-card:focus-within {
  border-radius: calc(var(--lgc-radius-large) - 0.375rem);
  background: var(--md-sys-color-surface-container);
}

.lgc-post-card > :not(.lgc-post-status-icons) {
  position: relative;
  z-index: var(--lgc-layer-local-base);
}

.lgc-post-card.lgc-card-link:hover {
  transform: none;
}

.lgc-post-card.lgc-card-link:active {
  background: var(--lgc-post-card-rest-bg);
  transform: none;
}

.lgc-post-card.lgc-card-link:has(
    :deep(.lgc-post-title-link:hover),
    :deep(.lgc-post-title-link:focus-visible),
    :deep(.lgc-post-arrow:hover),
    :deep(.lgc-post-arrow:focus-visible)
  ) {
  transform: translateY(-2px);
}

.lgc-post-card.lgc-card-link:has(
    :deep(.lgc-post-title-link:active),
    :deep(.lgc-post-arrow:active)
  ) {
  background: var(--md-sys-color-surface-container-high);
  transform: scale(var(--lgc-card-press-scale));
}

.lgc-post-card.has-cover {
  --lgc-post-card-rest-bg: var(--md-sys-color-surface-container);

  display: block;
  padding: 0;
  color: var(--lgc-post-cover-on-mask);
}

@include compact-up {
  .lgc-post-card {
    grid-template-columns: 120px minmax(0, 1fr) auto;
    gap: var(--lgc-space-2xl);
    padding: var(--lgc-space-2xl);
  }

  .lgc-post-card.has-cover {
    padding: 0;
  }
}
</style>
