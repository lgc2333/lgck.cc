<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { SearchItem } from '../../types'
import LgcUnifiedSearchField from './LgcUnifiedSearchField.vue'
import LgcUnifiedSearchResultList from './LgcUnifiedSearchResultList.vue'

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

const { t } = useI18n()
const query = defineModel<string>({ required: true })

const isDrawer = computed(() => props.variant === 'drawer')
</script>

<template>
  <div
    v-if="isDrawer"
    class="lgc-search-drawer-layer"
    inset-0
    fixed
    z="$lgc-layer-overlay"
    @keydown="$emit('keydown', $event)"
  >
    <button
      class="lgc-search-scrim"
      backdrop="blur-$lgc-mask-blur"
      border-0
      bg="$search-scrim-bg"
      opacity-100
      inset-0
      absolute
      type="button"
      :aria-label="t('accessibility.close_search')"
      @click="$emit('close')"
    />
    <aside
      class="lgc-search-drawer rounded-r-0 rounded-bl-$lgc-radius-large rounded-tl-$lgc-radius-large"
      grid-rows="[auto_auto_minmax(0,1fr)]"
      p="$lgc-space-lg"
      grid
      h-full
      w="$search-drawer-width"
      right-0
      top-0
      absolute
      text="$md-sys-color-on-surface"
      bg="$md-sys-color-surface-container-low"
      :aria-label="t('accessibility.search_results')"
    >
      <div
        grid-cols="[minmax(0,1fr)_var(--lgc-control-size)]"
        grid
        items-center
        gap="$lgc-space-sm"
      >
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
          :aria-label="t('accessibility.close_search')"
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
      <div
        class="lgc-search-results"
        overscroll-contain
        grid
        min-h-0
        content-start
        overflow-auto
        rounded="$lgc-radius-control"
      >
        <LgcUnifiedSearchResultList
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
    </aside>
  </div>

  <div
    v-else
    class="lgc-search-mobile text-$md-sys-color-on-surface hidden max-sm:grid"
    grid-rows="[auto_minmax(0,1fr)]"
    inset-0
    fixed
    z="$lgc-layer-modal"
    p="$lgc-space-sm"
    bg="$md-sys-color-surface-container-low"
  >
    <div
      grid-cols="[var(--lgc-control-size)_minmax(0,1fr)]"
      grid
      items-center
      gap="$lgc-space-sm"
    >
      <button
        class="lgc-search-close lgc-icon-button-base lgc-icon-button-hover"
        w="$lgc-control-size"
        h="$lgc-control-size"
        rounded="$lgc-radius-control"
        text="size-$lgc-icon-size"
        type="button"
        :aria-label="t('accessibility.close_search')"
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

    <div
      class="lgc-search-results"
      overscroll-contain
      grid
      min-h-0
      content-start
      overflow-auto
      rounded="$lgc-radius-control"
    >
      <LgcUnifiedSearchResultList
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
  </div>
</template>
