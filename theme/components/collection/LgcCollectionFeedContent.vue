<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  collection: CollectionConfig
  description?: string
}>()

const { $tO } = useValaxyI18n()

const items = computed(() => props.collection.items || [])
const previewItems = computed(() => items.value.slice(0, 3))
const remainingCount = computed(() => Math.max(0, items.value.length - 3))
const hasBody = computed(
  () => Boolean(props.description) || previewItems.value.length > 0,
)
</script>

<template>
  <div
    v-if="hasBody"
    class="lgc-collection-feed-content"
    grid
    gap="$lgc-space-sm"
    min-w="0"
  >
    <p
      v-if="description"
      class="lgc-collection-feed-description text-size-$lgc-body-small text-$md-sys-color-on-surface-variant"
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
      gap-x="$lgc-space-xs"
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
</template>
