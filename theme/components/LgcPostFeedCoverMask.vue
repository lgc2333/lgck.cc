<script setup lang="ts">
import type { CoverContentMask, CoverContentPosition } from '../types'
import type { PostDateParts } from '../utils/post'

withDefaults(
  defineProps<{
    category?: string
    cover: string
    date: PostDateParts
    excerpt?: string
    excerptType?: string
    mask?: CoverContentMask
    path: string
    position: CoverContentPosition
    tags: string[]
    title: string
  }>(),
  {
    mask: 'gradient',
  },
)
</script>

<template>
  <LgcPostCoverFrame
    class="lgc-post-cover-card"
    :src="cover"
    :alt="title"
    variant="feed"
  >
    <div class="lgc-post-cover-mask-panel" :class="[`is-${mask}`, `is-${position}`]">
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

.lgc-post-cover-mask-panel {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100%;
  grid-template-rows: auto minmax(min-content, 1fr);
  grid-template-columns: minmax(0, 1fr);
  align-content: space-between;
  align-items: stretch;
  gap: var(--lgc-space-lg);
  padding: var(--lgc-space-xl);
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
  backdrop-filter: blur(var(--lgc-surface-blur));
}

.lgc-post-body-cover {
  position: relative;
  grid-row: 2;
  grid-column: 1;
  align-self: end;
}

.lgc-post-body-cover :deep(.lgc-post-title) {
  max-width: 704px;
  text-align: left;
}

.lgc-post-body-cover :deep(.lgc-post-excerpt) {
  max-width: 672px;
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 600;
  text-align: left;
}

.lgc-post-arrow {
  position: absolute;
  right: var(--lgc-space-xl);
  top: 50%;
  display: none;
  align-self: center;
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 50%,
    transparent
  );
  backdrop-filter: blur(var(--lgc-surface-blur));
  transform: translateY(-50%);
}

// Gradient mask: full-width bottom fade
.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
  --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-xl);
  --lgc-post-cover-gradient-color: var(--md-sys-color-surface-container-lowest);

  z-index: var(--lgc-layer-local-base);
  justify-self: stretch;
  width: calc(100% + 2 * var(--lgc-space-xl));
  max-width: none;
  margin-block-end: calc(var(--lgc-space-xl) * -1);
  margin-inline: calc(var(--lgc-space-xl) * -1);
  padding-block-start: var(--lgc-post-cover-gradient-padding-block-end);
  padding-block-end: var(--lgc-post-cover-gradient-padding-block-end);
  padding-inline-start: var(--lgc-space-xl);
  padding-inline-end: calc(var(--lgc-control-size) + var(--lgc-space-lg));
  border-radius: 0;
  color: var(--lgc-post-cover-on-mask);
  background: transparent;
}

.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover::before {
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

.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover :deep(.lgc-post-title) {
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover :deep(.lgc-post-excerpt) {
  text-shadow: 0 1px 4px
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
}

// Card mask: tonal floating panel
.lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
  z-index: var(--lgc-layer-local-raised);
  justify-self: start;
  width: fit-content;
  max-width: min(672px, calc(100% - var(--lgc-control-size) - var(--lgc-space-lg)));
  margin-block-end: calc(var(--lgc-space-xl) * -1);
  margin-inline-start: calc(var(--lgc-space-xl) * -1);
  padding: var(--lgc-space-xl);
  border-top-left-radius: var(--lgc-radius-large);
  border-top-right-radius: calc(var(--lgc-radius-large) * 2.5);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: calc(var(--lgc-radius-large) * 0.5);
  color: var(--md-sys-color-on-surface);
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
}

.lgc-post-cover-mask-panel.is-card .lgc-post-body-cover :deep(.lgc-post-title) {
  color: var(--md-sys-color-on-surface);
}

@include compact-up {
  .lgc-post-cover-mask-panel {
    gap: var(--lgc-space-2xl);
    padding: var(--lgc-space-2xl);
  }

  .lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
    --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-2xl);

    width: calc(100% + 2 * var(--lgc-space-2xl));
    margin-block-end: calc(var(--lgc-space-2xl) * -1);
    margin-inline: calc(var(--lgc-space-2xl) * -1);
    padding-inline-start: var(--lgc-space-2xl);
  }

  .lgc-post-cover-mask-panel.is-gradient.is-right .lgc-post-body-cover {
    justify-self: stretch;
    justify-items: end;
    margin-inline: calc(var(--lgc-space-2xl) * -1);
    padding-inline-start: var(--lgc-space-2xl);
    padding-inline-end: var(--lgc-space-2xl);
    border-radius: 0;
  }

  .lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
    margin-block-end: calc(var(--lgc-space-2xl) * -1);
    margin-inline-start: calc(var(--lgc-space-2xl) * -1);
    padding: var(--lgc-space-2xl);
  }

  .lgc-post-cover-mask-panel.is-card.is-right .lgc-post-body-cover {
    display: grid;
    justify-self: end;
    justify-items: end;
    margin-inline-start: 0;
    margin-inline-end: calc(var(--lgc-space-2xl) * -1);
    border-top-left-radius: calc(var(--lgc-radius-large) * 2.5);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: calc(var(--lgc-radius-large) * 0.5);
    border-bottom-right-radius: 0;
  }

  .lgc-post-cover-mask-panel.is-right :deep(.lgc-post-title),
  .lgc-post-cover-mask-panel.is-right :deep(.lgc-post-excerpt) {
    text-align: right;
  }

  .lgc-post-cover-mask-panel.is-right :deep(.lgc-post-tags) {
    justify-content: flex-end;
  }

  .lgc-post-arrow {
    right: var(--lgc-space-2xl);
    display: inline-grid;
  }

  .lgc-post-cover-mask-panel.is-right .lgc-post-arrow {
    top: var(--lgc-space-2xl);
    transform: none;
  }
}

@include compact-down {
  .lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
    width: calc(100% + 2 * var(--lgc-space-xl));
    padding-inline: var(--lgc-space-xl);
  }

  .lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
    grid-column: 1 / -1;
    justify-self: stretch;
    width: auto;
    max-width: none;
    margin-block-end: calc(var(--lgc-space-xl) * -1);
    margin-inline: calc(var(--lgc-space-xl) * -1);
    border-top-left-radius: var(--lgc-radius-large);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
