<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import type { SearchItem } from '../types'
import LgcUnifiedSearchResultButton from './LgcUnifiedSearchResultButton.vue'

const props = defineProps<{
  countText: string
  hasQuery: boolean
  loading: boolean
  loadingText: string
  noResultsText: string
  placeholder: string
  previewResults: SearchItem[]
  selectedIndex: number
  viewAllSelected: boolean
}>()

defineEmits<{
  navigate: [item: SearchItem]
  select: [index: number]
  viewAll: []
}>()

const previewRef = ref<HTMLElement>()

watch(
  () => props.selectedIndex,
  async () => {
    await nextTick()

    previewRef.value
      ?.querySelector('.lgc-search-result.is-selected')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  },
)
</script>

<template>
  <div
    ref="previewRef"
    class="lgc-search-preview"
    flex="~ col"
    gap="$lgc-space-xs"
    p="$lgc-space-md"
    rounded="$lgc-radius-control"
    pointer-events-auto
    items-stretch
    box-border
    right-0
    absolute
    text="$md-sys-color-on-surface"
    bg="$md-sys-color-surface-container-low"
    role="listbox"
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
      v-else-if="previewResults.length === 0"
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
        v-for="(item, index) in previewResults"
        :key="item.id"
        :item="item"
        preview
        :selected="selectedIndex === index"
        @mouseenter="$emit('select', index)"
        @click="$emit('navigate', item)"
      />
      <button
        class="lgc-search-result is-preview is-view-all"
        :class="{ 'is-selected': viewAllSelected }"
        type="button"
        role="option"
        :aria-selected="viewAllSelected"
        @mouseenter="$emit('select', previewResults.length)"
        @click="$emit('viewAll')"
      >
        <span class="lgc-search-result-title">查看全部搜索结果</span>
        <span class="lgc-search-result-meta">
          {{ countText }}
        </span>
      </button>
    </div>
  </div>
</template>
