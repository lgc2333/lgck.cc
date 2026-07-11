<script setup lang="ts">
import type { Post } from 'valaxy'
import { useSiteConfig, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  formatPostDate,
  formatPostTimestamp,
  normalizePostCategoryQuery,
  normalizePostListValue,
  shouldShowPostUpdated,
} from '../utils/post'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    tags?: Post['tags']
    created?: string | number | Date
    updated?: string | number | Date
    wordCount?: Post['wordCount']
    readingTime?: Post['readingTime']
    /**
     * Feed cards: only category/tags row.
     * Article: full meta — other fields on the first row, c/t on the second.
     */
    onlyTaxonomies?: boolean
    /** Cover-on-image chip tone (owned here; no parent :deep). */
    tone?: 'default' | 'on-cover'
    /** Row alignment (article header centers; feed starts). */
    align?: 'start' | 'center'
  }>(),
  {
    onlyTaxonomies: false,
    tone: 'default',
    align: 'start',
  },
)

const { t } = useI18n()
const { $tCategory, $tTag } = useValaxyI18n()
const siteConfig = useSiteConfig()

const tagClass = computed(() => [
  'lgc-post-tag',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])

const rowClass = computed(() => [
  'flex flex-wrap gap-$lgc-space-sm',
  props.align === 'center' ? 'justify-center' : '',
])

const createdText = computed(() => {
  if (props.onlyTaxonomies) return ''
  if (props.created == null || props.created === '') return ''
  return formatPostDate(props.created)
})

const createdTitle = computed(() => {
  if (!createdText.value) return ''
  return t('post.posted') + formatPostTimestamp(props.created)
})

const updatedText = computed(() => {
  if (props.onlyTaxonomies) return ''
  if (!shouldShowPostUpdated(props.created, props.updated)) return ''
  return formatPostDate(props.updated)
})

const updatedTitle = computed(() => {
  if (!updatedText.value) return ''
  return t('post.edited') + formatPostTimestamp(props.updated)
})

const showStatistics = computed(
  () => !props.onlyTaxonomies && Boolean(siteConfig.value.statistics?.enable),
)

const wordCountText = computed(() => {
  if (!showStatistics.value || !props.wordCount) return ''
  return String(props.wordCount)
})

const readingTimeText = computed(() => {
  if (!showStatistics.value || props.readingTime == null || props.readingTime === 0)
    return ''
  return `${props.readingTime}m`
})

const hasOtherRow = computed(
  () =>
    Boolean(createdText.value) ||
    Boolean(updatedText.value) ||
    Boolean(wordCountText.value) ||
    Boolean(readingTimeText.value),
)

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

const hasTaxonomyRow = computed(
  () => Boolean(categoryLabel.value) || tagItems.value.length > 0,
)
</script>

<template>
  <!-- Feed: multi-root chips so parent flex wrap / justify-end still owns layout -->
  <template v-if="onlyTaxonomies">
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

  <!-- Article: two rows — other meta, then category/tags -->
  <div
    v-else-if="hasOtherRow || hasTaxonomyRow"
    class="lgc-post-meta"
    flex="~ col"
    gap="$lgc-space-sm"
    leading="[1.4]"
  >
    <div v-if="hasOtherRow" :class="rowClass">
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
    </div>

    <div v-if="hasTaxonomyRow" :class="rowClass">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
// Multi-use chip chrome. Residual: geometric pill (½ min-height), color-mix tones,
// multi-duration transition, classic transform (not Wind4 translate/scale).
.lgc-post-tag {
  @apply 'inline-flex items-center gap-[2px] min-h-$lgc-meta-chip-min-height';
  @apply 'px-$lgc-space-md text-$md-sys-color-on-secondary-container';
  @apply 'text-size-$lgc-label-small font-700 bg-$md-sys-color-secondary-container no-underline';
  // Do NOT use radius-full (999) — hover morph to control-morph (18) stays ≥ half of
  // 32px chips, so the shape change is invisible.
  border-radius: calc(var(--lgc-meta-chip-min-height) / 2);
}

.lgc-post-tag.is-link {
  @apply 'cursor-pointer';
  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);

  &:hover,
  &:focus-visible {
    outline: none;
    // 12px — under half of 32px chip; 14 felt too soft.
    border-radius: var(--lgc-radius-md);
    transform: translateY(-1px);
    background: color-mix(
      in srgb,
      var(--md-sys-color-secondary-container) 88%,
      var(--md-sys-color-on-secondary-container)
    );
  }

  // Press scale only — keep hover morph radius, no second active radius.
  &:active {
    transform: scale(var(--lgc-control-press-scale));
  }
}

.lgc-post-tag.is-on-cover {
  color: color-mix(in srgb, var(--md-sys-color-on-secondary-container) 88%, white);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 78%,
    transparent
  );
}

.lgc-post-tag.is-on-cover.is-link:hover,
.lgc-post-tag.is-on-cover.is-link:focus-visible {
  color: color-mix(in srgb, var(--md-sys-color-on-secondary-container) 92%, white);
  border-radius: var(--lgc-radius-md);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 88%,
    transparent
  );
}
</style>
