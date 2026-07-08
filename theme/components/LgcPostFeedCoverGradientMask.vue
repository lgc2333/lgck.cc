<script setup lang="ts">
import type { CoverContentPosition } from '../types'

defineProps<{
  category?: string
  cover: string
  date: {
    day: string
    rest: string
    datetime: string
  }
  excerpt?: string
  excerptType?: string
  path: string
  position: CoverContentPosition
  tags: string[]
  title: string
}>()
</script>

<template>
  <LgcPostCoverFrame
    class="lgc-post-cover-card"
    :src="cover"
    :alt="title"
    variant="feed"
  >
    <div class="lgc-post-cover-gradient-mask" :class="`is-${position}`">
      <LgcPostDateBadge class="lgc-post-date-cover" v-bind="date" />

      <LgcPostFeedCardDetails
        class="lgc-post-body-cover"
        :category="category"
        :excerpt="excerpt"
        :excerpt-type="excerptType"
        :path="path"
        :tags="tags"
        :title="title"
      />

      <RouterLink
        class="lgc-post-arrow lgc-card-arrow"
        :to="path"
        aria-label="Read post"
      >
        <span i-material-symbols-arrow-forward-rounded />
      </RouterLink>
    </div>
  </LgcPostCoverFrame>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-post-cover-card {
  border-radius: inherit;
}

.lgc-post-cover-gradient-mask {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100%;
  grid-template-rows: auto minmax(min-content, 1fr);
  grid-template-columns: minmax(0, 1fr);
  align-content: space-between;
  align-items: stretch;
  gap: 1rem;
  padding: 1.25rem;
}

.lgc-post-date-cover {
  position: relative;
  z-index: var(--lgc-layer-local-raised);
  grid-row: 1;
  grid-column: 1;
  align-self: start;
  justify-self: start;
  color: var(--md-sys-color-on-primary-container);
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 50%,
    transparent
  );
  backdrop-filter: blur(8px);
}

.lgc-post-body-cover {
  --lgc-post-cover-gradient-padding-block-end: 1.25rem;
  --lgc-post-cover-gradient-color: var(--md-sys-color-surface-container-lowest);

  position: relative;
  z-index: var(--lgc-layer-local-base);
  grid-row: 2;
  grid-column: 1;
  align-self: end;
  justify-self: stretch;
  width: calc(100% + 2.5rem);
  max-width: none;
  margin-block-end: -1.25rem;
  margin-inline: -1.25rem;
  padding-block-start: var(--lgc-post-cover-gradient-padding-block-end);
  padding-block-end: var(--lgc-post-cover-gradient-padding-block-end);
  padding-inline-start: 1.25rem;
  padding-inline-end: calc(var(--lgc-control-size) + 1rem);
  border-radius: 0;
  color: var(--lgc-post-cover-on-mask);
  background: transparent;
}

.lgc-post-body-cover::before {
  position: absolute;
  z-index: -1;
  inset-block-start: calc(var(--lgc-post-cover-gradient-padding-block-end) * -2);
  inset-inline: 0;
  inset-block-end: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 76%, transparent) 0%,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 46%, transparent) 52%,
    transparent 100%
  );
  content: '';
}

.lgc-post-body-cover :deep(.lgc-post-title) {
  max-width: 44rem;
  color: var(--lgc-post-cover-on-mask);
  text-align: left;
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-post-body-cover :deep(.lgc-post-excerpt) {
  max-width: 42rem;
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 600;
  text-align: left;
  text-shadow: 0 0.0625rem 0.25rem
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
}

.lgc-post-arrow {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  display: none;
  align-self: center;
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 50%,
    transparent
  );
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
}

@include compact-up {
  .lgc-post-cover-gradient-mask {
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-body-cover {
    --lgc-post-cover-gradient-padding-block-end: 1.5rem;

    width: calc(100% + 3rem);
    margin-block-end: -1.5rem;
    margin-inline: -1.5rem;
    padding-inline-start: 1.5rem;
  }

  .lgc-post-cover-gradient-mask.is-right .lgc-post-body-cover {
    justify-self: stretch;
    justify-items: end;
    margin-inline: -1.5rem;
    padding-inline-start: 1.5rem;
    padding-inline-end: 1.5rem;
    border-radius: 0;
  }

  .lgc-post-cover-gradient-mask.is-right :deep(.lgc-post-title),
  .lgc-post-cover-gradient-mask.is-right :deep(.lgc-post-excerpt) {
    text-align: right;
  }

  .lgc-post-cover-gradient-mask.is-right :deep(.lgc-post-tags) {
    justify-content: flex-end;
  }

  .lgc-post-arrow {
    right: 1.5rem;
    display: inline-grid;
  }

  .lgc-post-cover-gradient-mask.is-right .lgc-post-arrow {
    top: 1.5rem;
    transform: none;
  }
}

@media (max-width: 639px) {
  .lgc-post-body-cover {
    width: calc(100% + 2.5rem);
    padding-inline: 1.25rem;
  }
}
</style>
