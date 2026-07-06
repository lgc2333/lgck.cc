<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUnifiedSearch } from '../composables'
import LgcUnifiedSearchDrawer from './LgcUnifiedSearchDrawer.vue'
import LgcUnifiedSearchField from './LgcUnifiedSearchField.vue'
import LgcUnifiedSearchMobile from './LgcUnifiedSearchMobile.vue'
import LgcUnifiedSearchPreview from './LgcUnifiedSearchPreview.vue'

defineProps<{
  actionClass?: unknown
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
</script>

<template>
  <div v-if="isSupported" ref="rootRef" class="lgc-search" :class="actionClass">
    <div v-if="!isAlgolia" class="lgc-search-inline" :class="{ 'is-open': openInline }">
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
      class="lgc-header-button lgc-search-trigger lgc-icon-button-base lgc-icon-button-hover"
      :class="[
        actionClass,
        {
          'is-active': openInline || openDrawer || mobileSearchMode,
        },
      ]"
      type="button"
      :aria-expanded="openInline || openDrawer || mobileSearchMode"
      aria-label="Search"
      title="Search"
      @click="openSearch"
    >
      <span i-material-symbols-search-rounded aria-hidden="true" />
    </button>

    <Teleport to="body">
      <ClientOnly>
        <Transition name="lgc-search-drawer">
          <LgcUnifiedSearchDrawer
            v-if="openDrawer"
            v-model="query"
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

        <LgcUnifiedSearchMobile
          v-if="mobileSearchMode"
          v-model="query"
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

        <AlgoliaSearchBox v-if="algoliaLoaded" class="lgc-search-algolia" />
      </ClientOnly>
    </Teleport>
  </div>
</template>
