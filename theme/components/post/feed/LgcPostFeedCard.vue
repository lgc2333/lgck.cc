<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../../../composables'
import type { CoverContentMask, CoverContentPosition } from '../../../types'
import {
  formatPostDateParts,
  normalizeLocaleText,
  normalizePostListValue,
} from '../../../utils/post'

const props = defineProps<{
  post: Post
}>()

const themeConfig = useThemeConfig()
const { t, locale } = useI18n()

const date = computed(() => formatPostDateParts(props.post.date))
const tags = computed(() => normalizePostListValue(props.post.tags))
const title = computed(() => normalizeLocaleText(props.post.title, locale.value, t))
const hasCover = computed(() => Boolean(props.post.cover))
const postPath = computed(() => props.post.path || '')
const postUrl = computed(() => props.post.url || '')
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
    grid
    items-start
    relative
    gap="$lgc-space-lg sm:$lgc-space-2xl"
    p="$lgc-space-xl sm:$lgc-space-2xl"
    :class="{
      'has-cover': hasCover,
    }"
  >
    <LgcPostStatusIcons :post="post" />

    <LgcPostFeedCoverMask
      v-if="post.cover"
      :categories="post.categories"
      :cover="post.cover"
      :date="date"
      :excerpt="post.excerpt"
      :excerpt-type="post.excerpt_type"
      :mask="coverContentMask"
      :path="postPath"
      :position="coverContentPosition"
      :tags="tags"
      :title="title"
      :url="postUrl"
    />

    <LgcPostFeedPlainCard
      v-else
      :categories="post.categories"
      :date="date"
      :excerpt="post.excerpt"
      :excerpt-type="post.excerpt_type"
      :path="postPath"
      :tags="tags"
      :title="title"
      :url="postUrl"
    />
  </article>
</template>

<style scoped lang="scss">
// Residual: grid tracks, rest bg token, title/arrow-owned lift (giscus).
.lgc-post-card {
  --lgc-post-card-rest-bg: var(--md-sys-color-surface-container-low);
  --post-card-cols: 84px minmax(0, 1fr);
  grid-template-columns: var(--post-card-cols);
  background: var(--lgc-post-card-rest-bg);
}

@screen sm {
  .lgc-post-card:not(.has-cover) {
    --post-card-cols: 120px minmax(0, 1fr) auto;
  }
}

.lgc-post-card:focus-within {
  @apply 'rounded-$lgc-radius-large-active bg-$md-sys-color-surface-container';
}

.lgc-post-card > :not(.lgc-post-status-icons) {
  @apply 'relative z-$lgc-layer-local-base';
}

// Whole-card hover: keep rest shape/lift (no radius morph, no translate).
// Lift + radius morph only when title or arrow is the target.
.lgc-post-card.lgc-card-link:hover {
  @apply 'rounded-$lgc-radius-large';
  transform: none;
}

.lgc-post-card.lgc-card-link:active {
  @apply 'rounded-$lgc-radius-large';
  background: var(--lgc-post-card-rest-bg);
  transform: none;
}

.lgc-post-card.lgc-card-link:has(
    :deep(.lgc-post-title-link:hover),
    :deep(.lgc-post-title-link:focus-visible),
    :deep(.lgc-post-arrow:hover),
    :deep(.lgc-post-arrow:focus-visible)
  ) {
  @apply 'rounded-$lgc-radius-large-active';
  transform: translateY(-2px);
}

.lgc-post-card.lgc-card-link:has(
    :deep(.lgc-post-title-link:active),
    :deep(.lgc-post-arrow:active)
  ) {
  @apply 'rounded-$lgc-radius-large-active';
  background: var(--md-sys-color-surface-container-high);
  transform: scale(var(--lgc-card-press-scale));
}

// Keep rest bg as plain-card low while cover loads / fails (image covers when ready).
.lgc-post-card.has-cover {
  @apply 'block p-0';
  color: var(--lgc-post-cover-on-mask);
}
</style>
