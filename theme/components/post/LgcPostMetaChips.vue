<script setup lang="ts">
import type { Post } from 'valaxy'

withDefaults(
  defineProps<{
    categories?: Post['categories']
    tags?: Post['tags']
    created?: string | number | Date
    updated?: string | number | Date
    wordCount?: Post['wordCount']
    readingTime?: Post['readingTime']
    /**
     * Feed cards: only category/tags chips.
     * Article: full meta on one wrapping row.
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
</script>

<template>
  <LgcTaxonomyChips
    v-if="onlyTaxonomies"
    :categories="categories"
    :tags="tags"
    :tone="tone"
  />
  <LgcPostMetaRow
    v-else
    :categories="categories"
    :tags="tags"
    :created="created"
    :updated="updated"
    :word-count="wordCount"
    :reading-time="readingTime"
    :tone="tone"
    :align="align"
  />
</template>

<style lang="scss">
// Multi-use chip chrome. Residual: geometric pill (½ min-height), color-mix tones,
// multi-duration transition, classic transform (not Wind4 translate/scale).
.lgc-post-tag {
  // leading-none: parent row may set leading-[1.4]; inherited line-height makes
  // label+icon read optically high inside the min-height pill.
  // pt-px: slight optical nudge down for CJK/latin + Material icon metrics.
  @apply 'inline-flex items-center gap-[2px] min-h-$lgc-meta-chip-min-height leading-none';
  @apply 'px-$lgc-space-md pt-px text-$md-sys-color-on-secondary-container';
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
  color: color-mix(
    in srgb,
    var(--md-sys-color-on-secondary-container) 88%,
    var(--md-sys-color-on-primary)
  );
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 78%,
    transparent
  );
}

.lgc-post-tag.is-on-cover.is-link:hover,
.lgc-post-tag.is-on-cover.is-link:focus-visible {
  color: color-mix(
    in srgb,
    var(--md-sys-color-on-secondary-container) 92%,
    var(--md-sys-color-on-primary)
  );
  border-radius: var(--lgc-radius-md);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 88%,
    transparent
  );
}
</style>
