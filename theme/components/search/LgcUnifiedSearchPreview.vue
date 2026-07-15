<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { SearchItem } from '../../types'
import LgcUnifiedSearchResultList from './LgcUnifiedSearchResultList.vue'

defineProps<{
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

const { t } = useI18n()
</script>

<template>
  <div
    class="lgc-search-preview"
    flex="~ col"
    gap="$lgc-space-xs"
    p="$lgc-space-md"
    rounded="$lgc-radius-control"
    pointer-events-auto
    items-stretch
    box-border
    top="$search-preview-top"
    right-0
    w="$search-preview-width"
    absolute
    text="$md-sys-color-on-surface"
    bg="$md-sys-color-surface-container-low"
    shadow="$lgc-elevation-shadow-overlay"
    role="listbox"
  >
    <LgcUnifiedSearchResultList
      preview
      :has-query="hasQuery"
      :loading="loading"
      :loading-text="loadingText"
      :no-results-text="noResultsText"
      :placeholder="placeholder"
      :results="previewResults"
      :selected-index="selectedIndex"
      @navigate="$emit('navigate', $event)"
      @select="$emit('select', $event)"
    >
      <template #footer>
        <button
          class="lgc-search-result is-preview is-view-all"
          :class="{ 'is-selected': viewAllSelected }"
          type="button"
          role="option"
          :aria-selected="viewAllSelected"
          @mouseenter="$emit('select', previewResults.length)"
          @click="$emit('viewAll')"
        >
          <span class="lgc-search-result-title">{{ t('search.view_all') }}</span>
          <span class="lgc-search-result-meta">
            {{ countText }}
          </span>
        </button>
      </template>
    </LgcUnifiedSearchResultList>
  </div>
</template>
