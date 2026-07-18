<script setup lang="ts">
import type { Post } from 'valaxy'
import { formatDate } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatPostTimestamp, normalizeLocaleText } from '../../../utils/post'

const props = defineProps<{
  first?: boolean
  last?: boolean
  post: Post
}>()

const { locale, t } = useI18n()

const title = computed(() => normalizeLocaleText(props.post.title, locale.value, t))
const dateLabel = computed(() =>
  formatDate(props.post.date || '', { template: 'MM-DD' }),
)
const datetime = computed(() => formatDate(props.post.date || ''))
const fullTimestamp = computed(() => formatPostTimestamp(props.post.date))
const isCollection = computed(() => Boolean(props.post._collection))
const postTo = computed(() => props.post.path || '')
const titleClass = computed(() =>
  isCollection.value ? '' : props.post.postTitleClass || '',
)
</script>

<template>
  <article
    class="lgc-post-timeline-item"
    :class="{ 'is-first': first, 'is-last': last }"
    grid
    items-center
    gap-x="$lgc-post-timeline-column-gap"
    grid-cols="[var(--lgc-post-timeline-date-column)_var(--lgc-post-timeline-dot-size)_minmax(0,1fr)]"
    min-h="$lgc-post-timeline-row-height"
  >
    <time
      class="lgc-post-timeline-date"
      justify-self-start
      :datetime="datetime"
      :title="fullTimestamp"
    >
      {{ dateLabel }}
    </time>

    <span
      class="lgc-post-timeline-dot"
      w="$lgc-post-timeline-dot-size"
      h="$lgc-post-timeline-dot-size"
      aria-hidden="true"
    />

    <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children. -->
    <RouterLink
      class="lgc-post-timeline-link"
      :class="titleClass"
      :to="postTo"
      flex="~ items-center"
      gap="$lgc-space-sm"
      min-w="0"
      min-h="$lgc-post-timeline-row-height"
      p="x-$lgc-space-sm y-$lgc-space-sm"
      rounded="$lgc-radius-sm"
      no-underline
      self-stretch
    >
      <span class="lgc-post-timeline-kind" aria-hidden="true">
        <span
          v-if="isCollection"
          i-material-symbols-auto-stories-rounded
          aria-hidden="true"
        />
        <span v-else i-material-symbols-article-outline-rounded aria-hidden="true" />
      </span>

      <span
        min-w="0"
        wrap="anywhere"
        text-size="$lgc-body-large"
        font="700"
        leading-snug
      >
        {{ title }}
      </span>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.lgc-post-timeline-item {
  @apply 'relative';
}

.lgc-post-timeline-date {
  @apply 'relative z-$lgc-layer-local-raised text-$md-sys-color-on-surface-variant';
  @apply 'text-size-$lgc-label-small font-mono font-800 leading-none';
}

.lgc-post-timeline-item::before,
.lgc-post-timeline-item::after {
  @apply 'absolute';
  inline-size: var(--lgc-post-timeline-stem-width);
  inset-inline-start: var(--lgc-post-timeline-stem-inline);
  content: '';
  background-color: color-mix(in srgb, var(--md-sys-color-primary) 32%, transparent);
}

.lgc-post-timeline-item::before {
  top: 0;
  bottom: calc(50% + var(--lgc-post-timeline-dot-size) / 2);
}

.lgc-post-timeline-item::after {
  top: calc(50% + var(--lgc-post-timeline-dot-size) / 2);
  bottom: 0;
}

.lgc-post-timeline-item.is-first::before,
.lgc-post-timeline-item.is-last::after {
  content: none;
}

.lgc-post-timeline-dot {
  @apply 'relative z-$lgc-layer-local-raised justify-self-center box-border rounded-full';
  @apply 'border-2 border-$md-sys-color-primary bg-$md-sys-color-surface';
  box-shadow: 0 0 0 3px var(--md-sys-color-surface);
  transition-property: background-color, transform;
  transition-duration: var(--lgc-motion-short), var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-post-timeline-link {
  @apply 'relative z-$lgc-layer-local-base text-$md-sys-color-on-surface';
  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-post-timeline-link:hover,
.lgc-post-timeline-link:focus-visible {
  @apply 'rounded-$lgc-radius-md text-$md-sys-color-primary';
  background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
}

.lgc-post-timeline-link:active {
  background: var(--md-sys-color-surface-container-highest);
  transform: scale(var(--lgc-card-press-scale));
}

.lgc-post-timeline-kind {
  @apply 'inline-flex w-$lgc-icon-size-sm flex-none justify-center';
  @apply 'text-size-$lgc-icon-size-sm text-$md-sys-color-primary';
}

.lgc-post-timeline-item:has(
  .lgc-post-timeline-link:hover,
  .lgc-post-timeline-link:focus-visible
) {
  .lgc-post-timeline-dot {
    background: var(--md-sys-color-primary);
    transform: scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lgc-post-timeline-link:active,
  .lgc-post-timeline-item:has(
      .lgc-post-timeline-link:hover,
      .lgc-post-timeline-link:focus-visible
    )
    .lgc-post-timeline-dot {
    transform: none;
  }
}
</style>
