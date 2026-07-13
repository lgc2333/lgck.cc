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
  results: SearchItem[]
  selectedIndex: number
}>()

defineEmits<{
  navigate: [item: SearchItem]
  select: [index: number]
}>()

const resultsRef = ref<HTMLElement>()

watch(
  () => props.selectedIndex,
  async () => {
    await nextTick()

    resultsRef.value
      ?.querySelector('.lgc-search-result.is-selected')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  },
)
</script>

<template>
  <div
    ref="resultsRef"
    class="lgc-search-results"
    overscroll-contain
    grid
    min-h-0
    content-start
    overflow-auto
    rounded="$lgc-radius-control"
  >
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
        :selected="selectedIndex === index"
        @mouseenter="$emit('select', index)"
        @click="$emit('navigate', item)"
      />
    </div>
  </div>
</template>
