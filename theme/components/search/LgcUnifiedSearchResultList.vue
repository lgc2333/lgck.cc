<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import type { SearchItem } from '../../types'
import LgcUnifiedSearchResultButton from './LgcUnifiedSearchResultButton.vue'

const props = defineProps<{
  hasQuery: boolean
  loading: boolean
  loadingText: string
  noResultsText: string
  placeholder: string
  preview?: boolean
  results: SearchItem[]
  selectedIndex: number
}>()

defineEmits<{
  navigate: [item: SearchItem]
  select: [index: number]
}>()

const listRef = ref<HTMLElement>()

watch(
  () => props.selectedIndex,
  async () => {
    await nextTick()

    listRef.value
      ?.querySelector('.lgc-search-result.is-selected')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  },
)
</script>

<template>
  <div ref="listRef" contents>
    <div
      v-if="loading"
      class="lgc-search-note"
      p="$lgc-space-xl"
      text="$md-sys-color-on-surface-variant size-$lgc-body-small"
      text-center
      font="750"
    >
      {{ loadingText }}
    </div>
    <div
      v-else-if="!hasQuery"
      class="lgc-search-note"
      p="$lgc-space-xl"
      text="$md-sys-color-on-surface-variant size-$lgc-body-small"
      text-center
      font="750"
    >
      {{ placeholder }}
    </div>
    <div
      v-else-if="results.length === 0"
      class="lgc-search-note"
      p="$lgc-space-xl"
      text="$md-sys-color-on-surface-variant size-$lgc-body-small"
      text-center
      font="750"
    >
      {{ noResultsText }}
    </div>
    <div
      v-else
      class="lgc-search-result-list"
      grid
      gap="$lgc-hairline"
      p="$lgc-hairline"
    >
      <LgcUnifiedSearchResultButton
        v-for="(item, index) in results"
        :key="item.id"
        :item="item"
        :preview="preview"
        :selected="selectedIndex === index"
        @mouseenter="$emit('select', index)"
        @click="$emit('navigate', item)"
      />
      <slot name="footer" />
    </div>
  </div>
</template>
