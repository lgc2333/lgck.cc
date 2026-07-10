<script setup lang="ts">
import { computed } from 'vue'

import type { SearchItem } from '../types/search'
import LgcUnifiedSearchField from './LgcUnifiedSearchField.vue'
import LgcUnifiedSearchResults from './LgcUnifiedSearchResults.vue'

const props = defineProps<{
  variant: 'drawer' | 'mobile'
  countText?: string
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

const isDrawer = computed(() => props.variant === 'drawer')
</script>

<template>
  <div
    v-if="isDrawer"
    class="lgc-search-drawer-layer"
    @keydown="$emit('keydown', $event)"
  >
    <button
      class="lgc-search-scrim"
      type="button"
      aria-label="Close search"
      @click="$emit('close')"
    />
    <aside class="lgc-search-drawer" aria-label="Search results">
      <div class="lgc-search-drawer-head">
        <LgcUnifiedSearchField
          v-model="query"
          autofocus
          has-icon
          open
          :placeholder="placeholder"
          @keydown="$emit('keydown', $event)"
        />
        <button
          class="lgc-search-close lgc-icon-button-base lgc-icon-button-hover"
          type="button"
          aria-label="Close search"
          @click="$emit('close')"
        >
          <span i-material-symbols-close-rounded aria-hidden="true" />
        </button>
      </div>

      <div v-if="countText" class="lgc-search-count">{{ countText }}</div>
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
    </aside>
  </div>

  <div v-else class="lgc-search-mobile">
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
