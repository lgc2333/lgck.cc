<script setup lang="ts">
import type { SearchItem } from '../types/search'
import LgcUnifiedSearchResultButton from './LgcUnifiedSearchResultButton.vue'

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
  navigate: [item: SearchItem]
  select: [index: number]
}>()
</script>

<template>
  <div class="lgc-search-results">
    <div v-if="loading" class="lgc-search-note">{{ loadingText }}</div>
    <div v-else-if="!hasQuery" class="lgc-search-note">{{ placeholder }}</div>
    <div v-else-if="results.length === 0" class="lgc-search-note">
      {{ noResultsText }}
    </div>
    <LgcUnifiedSearchResultButton
      v-for="(item, index) in results"
      v-else
      :key="item.id"
      :item="item"
      :selected="selectedIndex === index"
      @mouseenter="$emit('select', index)"
      @click="$emit('navigate', item)"
    />
  </div>
</template>
