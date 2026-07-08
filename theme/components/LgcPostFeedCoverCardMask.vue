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
    <div class="lgc-post-cover-card-mask" :class="`is-${position}`">
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

.lgc-post-cover-card-mask {
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
  position: relative;
  z-index: var(--lgc-layer-local-raised);
  grid-row: 2;
  grid-column: 1;
  align-self: end;
  justify-self: start;
  width: fit-content;
  max-width: min(42rem, calc(100% - var(--lgc-control-size) - 1rem));
  margin-block-end: -1.25rem;
  margin-inline-start: -1.25rem;
  padding: 1.25rem;
  border-top-left-radius: var(--lgc-radius-large);
  border-top-right-radius: calc(var(--lgc-radius-large) * 2.5);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: calc(var(--lgc-radius-large) * 0.5);
  color: var(--md-sys-color-on-surface);
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
}

.lgc-post-body-cover :deep(.lgc-post-title) {
  max-width: 44rem;
  color: var(--md-sys-color-on-surface);
  text-align: left;
}

.lgc-post-body-cover :deep(.lgc-post-excerpt) {
  max-width: 42rem;
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 600;
  text-align: left;
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
  .lgc-post-cover-card-mask {
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-body-cover {
    margin-block-end: -1.5rem;
    margin-inline-start: -1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-cover-card-mask.is-right .lgc-post-body-cover {
    display: grid;
    justify-self: end;
    justify-items: end;
    margin-inline-start: 0;
    margin-inline-end: -1.5rem;
    border-top-left-radius: calc(var(--lgc-radius-large) * 2.5);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: calc(var(--lgc-radius-large) * 0.5);
    border-bottom-right-radius: 0;
  }

  .lgc-post-cover-card-mask.is-right :deep(.lgc-post-title),
  .lgc-post-cover-card-mask.is-right :deep(.lgc-post-excerpt) {
    text-align: right;
  }

  .lgc-post-cover-card-mask.is-right :deep(.lgc-post-tags) {
    justify-content: flex-end;
  }

  .lgc-post-arrow {
    right: 1.5rem;
    display: inline-grid;
  }

  .lgc-post-cover-card-mask.is-right .lgc-post-arrow {
    top: 1.5rem;
    transform: none;
  }
}

@media (max-width: 639px) {
  .lgc-post-body-cover {
    grid-column: 1 / -1;
    justify-self: stretch;
    width: auto;
    max-width: none;
    margin-block-end: -1.25rem;
    margin-inline: -1.25rem;
    border-top-left-radius: var(--lgc-radius-large);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
