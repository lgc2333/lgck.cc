<script setup lang="ts">
import type { SearchItem } from '../types/search'
import LgcUnifiedSearchField from './LgcUnifiedSearchField.vue'
import LgcUnifiedSearchResults from './LgcUnifiedSearchResults.vue'

defineProps<{
  hasQuery: boolean
  loading: boolean
  loadingText: string
  noResultsText: string
  placeholder: string
  results: SearchItem[]
  selectedIndex: number
}>()

defineEmits<{
  close: []
  keydown: [event: KeyboardEvent]
  navigate: [item: SearchItem]
  select: [index: number]
}>()
const query = defineModel<string>({ required: true })
</script>

<template>
  <div class="lgc-search-mobile">
    <div class="lgc-search-mobile-head">
      <button
        class="lgc-search-close lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        aria-label="Close search"
        @click="$emit('close')"
      >
        <span i-material-symbols-arrow-back-rounded aria-hidden="true" />
      </button>
      <LgcUnifiedSearchField
        v-model="query"
        autofocus
        has-icon
        open
        :placeholder="placeholder"
        @keydown="$emit('keydown', $event)"
      />
    </div>

    <LgcUnifiedSearchResults
      :has-query="hasQuery"
      :loading="loading"
      :loading-text="loadingText"
      :no-results-text="noResultsText"
      :placeholder="placeholder"
      :results="results"
      :selected-index="selectedIndex"
      @navigate="$emit('navigate', $event)"
      @select="$emit('select', $event)"
    />
  </div>
</template>
