<script setup lang="ts">
import type { Post } from 'valaxy'
import { useI18n } from 'vue-i18n'

import type { CoverContentMask, CoverContentPosition } from '../../../types'
import type { PostDateParts } from '../../../utils/post'

withDefaults(
  defineProps<{
    categories?: Post['categories']
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

const { t } = useI18n()
</script>

<template>
  <LgcPostCoverFrame rounded-inherit :src="cover" :alt="title" variant="feed">
    <div
      class="lgc-post-cover-mask-panel grid-rows-[auto_minmax(min-content,1fr)]"
      w="full"
      min-h="full"
      grid-cols="1"
      grid
      content-between
      items-stretch
      relative
      gap="$lgc-space-lg sm:$lgc-space-2xl"
      p="$lgc-space-xl sm:$lgc-space-2xl"
      :class="[`is-${mask}`, `is-${position}`]"
    >
      <LgcPostDateBadge class="lgc-post-date-cover" v-bind="date" />

      <LgcPostFeedCardDetails
        class="lgc-post-body-cover col-start-1 row-start-2 self-end relative"
        surface="cover"
        :cover-mask="mask"
        :cover-align="position"
        :categories="categories"
        :excerpt="excerpt"
        :excerpt-type="excerptType"
        :path="path"
        :tags="tags"
        :title="title"
      />

      <RouterLink
        class="lgc-post-arrow lgc-card-arrow max-sm:hidden -translate-y-1/2"
        absolute
        right="$lgc-space-xl sm:$lgc-space-2xl"
        top="1/2"
        sm="inline-grid"
        :to="path"
        :aria-label="t('post.read_more')"
      >
        <span i-material-symbols-arrow-forward-rounded />
      </RouterLink>
    </div>
  </LgcPostCoverFrame>
</template>

<style scoped lang="scss">
// Residual: color-mix, gradient mask, asymmetric card radii, bleed layout.
.lgc-post-date-cover {
  @apply 'relative z-$lgc-layer-local-raised row-start-1 col-start-1';
  @apply 'self-start justify-self-start text-$md-sys-color-on-primary-container';
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 65%,
    transparent
  );
  backdrop-filter: blur(var(--lgc-elevate-blur));
}

.lgc-post-arrow {
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 30%,
    transparent
  );
  backdrop-filter: blur(var(--lgc-elevate-blur));
}

// Gradient mask: full-width bottom fade (local calc owners for bleed geometry).
.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
  --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-xl);
  --lgc-post-cover-gradient-color: var(--md-sys-color-surface-container-lowest);
  --lgc-post-cover-bleed: var(--lgc-space-xl);
  --cover-bleed-width: calc(100% + 2 * var(--lgc-post-cover-bleed));
  --cover-bleed-out: calc(var(--lgc-post-cover-bleed) * -1);
  --cover-pad-inline-end: calc(var(--lgc-control-size) + var(--lgc-space-lg));
  --cover-grad-start: calc(var(--lgc-post-cover-gradient-padding-block-end) * -2);

  @apply 'z-$lgc-layer-local-base justify-self-stretch max-w-none';
  @apply 'rounded-none bg-transparent';
  width: var(--cover-bleed-width);
  margin-bottom: var(--cover-bleed-out);
  margin-inline: var(--cover-bleed-out);
  padding-block: var(--lgc-post-cover-gradient-padding-block-end);
  padding-inline-start: var(--lgc-post-cover-bleed);
  padding-inline-end: var(--cover-pad-inline-end);
  color: var(--lgc-post-cover-on-mask);
}

.lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover::before {
  @apply 'absolute -z-1 inset-x-0 bottom-0';
  inset-block-start: var(--cover-grad-start);
  content: '';
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 76%, transparent) 0%,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 46%, transparent) 52%,
    transparent 100%
  );
}

// Card mask: tonal floating panel + asymmetric radii.
.lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
  --lgc-post-cover-bleed: var(--lgc-space-xl);
  --cover-bleed-out: calc(var(--lgc-post-cover-bleed) * -1);
  --cover-card-max-w: min(
    672px,
    calc(100% - var(--lgc-control-size) - var(--lgc-space-lg))
  );
  --cover-radius-wide: calc(var(--lgc-radius-large) * 2.5);
  --cover-radius-soft: calc(var(--lgc-radius-large) * 0.5);

  @apply 'z-$lgc-layer-local-raised justify-self-start w-fit';
  @apply 'text-$md-sys-color-on-surface';
  margin-bottom: var(--cover-bleed-out);
  margin-inline-start: var(--cover-bleed-out);
  padding: var(--lgc-post-cover-bleed);
  max-width: var(--cover-card-max-w);
  border-top-left-radius: var(--lgc-radius-large);
  border-top-right-radius: var(--cover-radius-wide);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: var(--cover-radius-soft);
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
}

@screen sm {
  .lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
    --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-2xl);
    --lgc-post-cover-bleed: var(--lgc-space-2xl);
  }

  .lgc-post-cover-mask-panel.is-gradient.is-right .lgc-post-body-cover {
    @apply 'justify-self-stretch justify-items-end rounded-none';
    margin-inline: var(--cover-bleed-out);
    padding-inline: var(--lgc-post-cover-bleed);
  }

  .lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
    --lgc-post-cover-bleed: var(--lgc-space-2xl);
  }

  .lgc-post-cover-mask-panel.is-card.is-right .lgc-post-body-cover {
    @apply 'grid justify-self-end justify-items-end';
    margin-inline-start: 0;
    margin-inline-end: var(--cover-bleed-out);
    border-top-left-radius: var(--cover-radius-wide);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: var(--cover-radius-soft);
    border-bottom-right-radius: 0;
  }

  .lgc-post-cover-mask-panel.is-right .lgc-post-arrow {
    @apply 'top-$lgc-space-2xl translate-y-0';
  }
}

@media (max-width: 599.98px) {
  .lgc-post-cover-mask-panel.is-gradient .lgc-post-body-cover {
    --lgc-post-cover-bleed: var(--lgc-space-xl);
    --cover-pad-inline-end: var(--lgc-space-xl);
    padding-inline: var(--lgc-space-xl);
  }

  .lgc-post-cover-mask-panel.is-card .lgc-post-body-cover {
    --cover-bleed-out: calc(var(--lgc-space-xl) * -1);
    @apply 'col-span-full justify-self-stretch w-auto max-w-none';
    margin-bottom: var(--cover-bleed-out);
    margin-inline: var(--cover-bleed-out);
    border-top-left-radius: var(--lgc-radius-large);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
