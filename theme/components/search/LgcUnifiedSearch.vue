<script setup lang="ts">
import type { ComponentPublicInstance, HTMLAttributes, VNodeRef } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUnifiedSearch } from '../../composables'
import LgcUnifiedSearchField from './LgcUnifiedSearchField.vue'
import LgcUnifiedSearchPanel from './LgcUnifiedSearchPanel.vue'
import LgcUnifiedSearchPreview from './LgcUnifiedSearchPreview.vue'

defineProps<{
  actionClass?: HTMLAttributes['class']
}>()

const { t } = useI18n()
const {
  algoliaLoaded,
  closeDrawer,
  drawerSelectedIndex,
  handleSearchKeydown,
  hasQuery,
  isAlgolia,
  isSupported,
  loading,
  mobileSearchMode,
  navigateToResult,
  openDrawer,
  openInline,
  openResultsDrawer,
  openSearch,
  previewResults,
  previewSelectedIsAll,
  previewSelectedIndex,
  query,
  resetAndClose,
  results,
  rootRef,
  mobileSelectedIndex,
} = useUnifiedSearch()
const inlineFocusKey = ref(0)

function closeDrawerAndFocusInline() {
  closeDrawer()
  inlineFocusKey.value += 1
}

const setRootRef: VNodeRef = (element) => {
  const rootElement =
    element instanceof HTMLElement
      ? element
      : (element as ComponentPublicInstance | null)?.$el

  rootRef.value = rootElement instanceof HTMLElement ? rootElement : undefined
}
</script>

<template>
  <div
    v-if="isSupported"
    :ref="setRootRef"
    class="lgc-search"
    inline-flex
    flex-none
    items-center
    justify-end
    relative
    gap="$lgc-space-sm"
    :class="actionClass"
  >
    <div
      v-if="!isAlgolia"
      class="lgc-search-inline"
      w="0"
      rounded="$lgc-radius-control-active"
      grid
      pointer-events-none
      justify-items-end
      overflow-hidden
      max-lg="hidden"
      :class="{ 'is-open': openInline }"
    >
      <LgcUnifiedSearchField
        v-model="query"
        :autofocus="openInline"
        :focus-key="inlineFocusKey"
        :open="openInline"
        :placeholder="t('search.placeholder')"
        @keydown="handleSearchKeydown"
      />

      <LgcUnifiedSearchPreview
        v-if="openInline"
        :count-text="t('search.hits', results.length || 0)"
        :has-query="hasQuery"
        :loading="loading"
        :loading-text="t('search.loading')"
        :no-results-text="t('search.no_results_hint')"
        :placeholder="t('search.placeholder')"
        :preview-results="previewResults"
        :selected-index="previewSelectedIndex"
        :view-all-selected="previewSelectedIsAll"
        @navigate="navigateToResult"
        @select="previewSelectedIndex = $event"
        @view-all="openResultsDrawer"
      />
    </div>

    <button
      class="lgc-header-button lgc-search-trigger lgc-control-reset lgc-control-on-surface lgc-control-state-layer"
      :class="[
        actionClass,
        {
          'is-active': openInline || openDrawer || mobileSearchMode,
        },
      ]"
      type="button"
      grid
      place-items="center"
      :aria-expanded="openInline || openDrawer || mobileSearchMode"
      :aria-label="t('menu.search')"
      :title="t('menu.search')"
      @click="openSearch"
    >
      <span i-material-symbols-search-rounded aria-hidden="true" />
    </button>

    <ClientOnly>
      <Teleport to="body">
        <Transition name="lgc-search-drawer">
          <LgcUnifiedSearchPanel
            v-if="openDrawer"
            v-model="query"
            variant="drawer"
            :count-text="t('search.hits', results.length || 0)"
            :has-query="hasQuery"
            :loading="loading"
            :loading-text="t('search.loading')"
            :no-results-text="t('search.no_results_hint')"
            :placeholder="t('search.placeholder')"
            :results="results"
            :selected-index="drawerSelectedIndex"
            @close="closeDrawerAndFocusInline"
            @keydown="handleSearchKeydown"
            @navigate="navigateToResult"
            @select="drawerSelectedIndex = $event"
          />
        </Transition>

        <LgcUnifiedSearchPanel
          v-if="mobileSearchMode"
          v-model="query"
          variant="mobile"
          :has-query="hasQuery"
          :loading="loading"
          :loading-text="t('search.loading')"
          :no-results-text="t('search.no_results_hint')"
          :placeholder="t('search.placeholder')"
          :results="results"
          :selected-index="mobileSelectedIndex"
          @close="resetAndClose"
          @keydown="handleSearchKeydown"
          @navigate="navigateToResult"
          @select="mobileSelectedIndex = $event"
        />

        <AlgoliaSearchBox v-if="algoliaLoaded" class="hidden" />
      </Teleport>
    </ClientOnly>
  </div>
</template>
