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
    fixed
    inset-0
    z="$lgc-layer-overlay"
    @keydown="$emit('keydown', $event)"
  >
    <button
      class="lgc-search-scrim"
      absolute
      inset-0
      border-0
      opacity-100
      type="button"
      aria-label="Close search"
      @click="$emit('close')"
    />
    <aside
      class="lgc-search-drawer"
      absolute
      top-0
      right-0
      grid
      h-full
      p="$lgc-space-lg"
      translate-x-0
      text="$md-sys-color-on-surface"
      bg="$md-sys-color-surface-container-low"
      aria-label="Search results"
    >
      <div class="lgc-search-drawer-head" grid items-center gap="$lgc-space-sm">
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
          w="$lgc-control-size"
          h="$lgc-control-size"
          rounded="$lgc-radius-control"
          text="size-$lgc-icon-size"
          type="button"
          aria-label="Close search"
          @click="$emit('close')"
        >
          <span i-material-symbols-close-rounded aria-hidden="true" />
        </button>
      </div>

      <div
        v-if="countText"
        class="lgc-search-count"
        pt="$lgc-space-md"
        px="$lgc-space-xs"
        pb="$lgc-space-sm"
        text="$md-sys-color-on-surface-variant size-$lgc-label-medium"
        font="800"
      >
        {{ countText }}
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
    </aside>
  </div>

  <div
    v-else
    class="lgc-search-mobile hidden max-md:grid text-$md-sys-color-on-surface"
    fixed
    inset-0
    z="$lgc-layer-modal"
    p="$lgc-space-sm"
    bg="$md-sys-color-surface-container-low"
  >
    <div class="lgc-search-mobile-head" grid items-center gap="$lgc-space-sm">
      <button
        class="lgc-search-close lgc-icon-button-base lgc-icon-button-hover"
        w="$lgc-control-size"
        h="$lgc-control-size"
        rounded="$lgc-radius-control"
        text="size-$lgc-icon-size"
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
