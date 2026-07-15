<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'right'
    collection: CollectionConfig
    description?: string
    mask?: 'gradient' | 'card'
    part?: 'all' | 'title' | 'body'
    path: string
    surface?: 'plain' | 'cover'
    title: string
  }>(),
  {
    align: 'left',
    mask: 'gradient',
    part: 'all',
    surface: 'plain',
  },
)

const { $tO } = useValaxyI18n()

const items = computed(() => props.collection.items || [])
const previewItems = computed(() => items.value.slice(0, 3))
const remainingCount = computed(() => Math.max(0, items.value.length - 3))
const rootClass = computed(() => [
  'lgc-collection-feed-content',
  `is-surface-${props.surface}`,
  `is-mask-${props.mask}`,
  `is-align-${props.align}`,
])
</script>

<template>
  <h3 v-if="part === 'title'" class="lgc-post-title lgc-collection-feed-title font-900">
    <RouterLink
      class="lgc-post-title-link text-inherit no-underline focus-visible:text-$md-sys-color-primary hover:text-$md-sys-color-primary"
      :to="path"
    >
      {{ title }}
    </RouterLink>
  </h3>

  <div v-else-if="part === 'body'" grid gap="$lgc-space-md" min-w="0">
    <p
      v-if="description"
      class="lgc-collection-feed-description text-size-$lgc-body-medium text-$md-sys-color-on-surface-variant"
      m="0"
      leading="[1.65]"
      wrap="anywhere"
    >
      {{ description }}
    </p>

    <div
      v-if="previewItems.length"
      class="lgc-collection-feed-chapters text-size-$lgc-body-small text-$md-sys-color-on-surface-variant"
      flex="~ wrap"
      gap-x="$lgc-space-sm"
      gap-y="$lgc-space-xs"
      font="700"
    >
      <template
        v-for="(item, index) in previewItems"
        :key="item.key || item.link || item.title"
      >
        <span v-if="index > 0" class="lgc-collection-feed-separator">·</span>
        <span>{{ $tO(item.title || '') }}</span>
      </template>
      <template v-if="remainingCount">
        <span class="lgc-collection-feed-separator">·</span>
        <span class="text-$md-sys-color-primary" font="900">
          +{{ remainingCount }}
        </span>
      </template>
    </div>
  </div>

  <div v-else :class="rootClass" grid min-w="0">
    <h3 class="lgc-post-title lgc-collection-feed-title font-900">
      <RouterLink
        class="lgc-post-title-link text-inherit no-underline focus-visible:text-$md-sys-color-primary hover:text-$md-sys-color-primary"
        :to="path"
      >
        {{ title }}
      </RouterLink>
    </h3>

    <p
      v-if="description"
      class="lgc-collection-feed-description text-size-$lgc-body-medium text-$md-sys-color-on-surface-variant"
      m="0"
      mt="$lgc-space-md"
      leading="[1.65]"
      wrap="anywhere"
    >
      {{ description }}
    </p>

    <div
      v-if="previewItems.length"
      class="lgc-collection-feed-chapters text-size-$lgc-body-small text-$md-sys-color-on-surface-variant"
      flex="~ wrap"
      gap-x="$lgc-space-sm"
      gap-y="$lgc-space-xs"
      mt="$lgc-space-md"
      font="700"
    >
      <template
        v-for="(item, index) in previewItems"
        :key="item.key || item.link || item.title"
      >
        <span v-if="index > 0" class="lgc-collection-feed-separator">·</span>
        <span>{{ $tO(item.title || '') }}</span>
      </template>
      <template v-if="remainingCount">
        <span class="lgc-collection-feed-separator">·</span>
        <span class="text-$md-sys-color-primary" font="900">
          +{{ remainingCount }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-collection-feed-title {
  @apply 'max-w-[704px] text-left';
}

.lgc-collection-feed-content.is-surface-cover.is-mask-gradient
  .lgc-collection-feed-title {
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-collection-feed-content.is-surface-cover.is-mask-gradient
  .lgc-collection-feed-description,
.lgc-collection-feed-content.is-surface-cover.is-mask-gradient
  .lgc-collection-feed-chapters {
  color: var(--lgc-post-cover-on-mask-variant);
  text-shadow: 0 1px 4px
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
}

.lgc-collection-feed-content.is-surface-cover.is-mask-card .lgc-collection-feed-title {
  @apply 'text-$md-sys-color-on-surface';
}

.lgc-collection-feed-content.is-align-right .lgc-collection-feed-title,
.lgc-collection-feed-content.is-align-right .lgc-collection-feed-description {
  @apply 'sm:text-right';
}

.lgc-collection-feed-content.is-align-right .lgc-collection-feed-chapters {
  @apply 'sm:justify-end';
}
</style>
