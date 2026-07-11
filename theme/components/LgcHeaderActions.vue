<script setup lang="ts">
import { useAppStore, useLocale } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLanguageFlip, useThemeConfig } from '../composables'
import { formatLocaleName } from '../utils/locale'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    actionClass?: string
    optionalClass?: string
    showLanguage?: boolean
    showSearch?: boolean
    showTheme?: boolean
  }>(),
  {
    showLanguage: true,
    showSearch: true,
    showTheme: true,
  },
)

const actionClasses = computed(() => [props.optionalClass, props.actionClass])

const appStore = useAppStore()
const themeConfig = useThemeConfig()
const { t, locale } = useI18n()
const { toggleLocales } = useLocale()
const { flipLanguageIcon, languageFlipping, stopLanguageFlip } = useLanguageFlip()
const showI18n = computed(() => {
  return props.showLanguage && themeConfig.value.header?.i18n !== false
})
const languageName = computed(() => formatLocaleName(locale.value))

function toggleLanguage() {
  flipLanguageIcon()
  toggleLocales()
}
</script>

<template>
  <div flex="~ items-center" min-w="0" gap="$lgc-space-sm">
    <button
      v-if="showI18n"
      class="lgc-header-button lgc-header-lang lgc-icon-button-base lgc-icon-button-hover"
      :class="actionClasses"
      type="button"
      :aria-label="t('button.toggle_langs')"
      :title="t('button.toggle_langs')"
      @click="toggleLanguage"
    >
      <span class="lgc-header-lang-label">{{ languageName }}</span>
      <span
        class="lgc-lang-flip-icon"
        :class="{ 'is-flipping': languageFlipping }"
        i-material-symbols-translate-rounded
        flex-none
        aria-hidden="true"
        @animationend="stopLanguageFlip"
      />
    </button>

    <button
      v-if="showTheme"
      class="lgc-header-button lgc-icon-button-base lgc-icon-button-hover"
      :class="actionClasses"
      type="button"
      aria-label="Toggle dark mode"
      @click="appStore.toggleDarkWithTransition"
    >
      <span
        v-if="!appStore.isDark"
        i-material-symbols-light-mode-outline-rounded
        aria-hidden="true"
      />
      <span v-else i-material-symbols-dark-mode-outline-rounded aria-hidden="true" />
    </button>

    <LgcUnifiedSearch v-if="showSearch" :action-class="actionClasses" />
  </div>
</template>

<style scoped lang="scss">
// Residual: expand on hover uses local calc padding.
.lgc-header-lang {
  --lgc-header-lang-icon-size: var(--lgc-icon-size);
  --lgc-header-lang-padding: calc(
    (var(--lgc-control-size) - var(--lgc-header-lang-icon-size)) / 2
  );

  @apply 'inline-flex w-auto min-w-$lgc-control-size max-w-$lgc-control-size';
  @apply 'items-center justify-end overflow-hidden px-$lgc-header-lang-padding';

  &:hover,
  &:focus-visible {
    @apply 'max-w-$lgc-label-width';
  }
}

.lgc-header-lang-label {
  @apply 'max-w-0 mr-0 overflow-hidden text-size-$lgc-label-medium';
  @apply 'font-900 leading-none whitespace-nowrap opacity-0';
  // Residual: multi-duration list (medium width, short opacity).
  transition:
    margin-right var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-header-lang:hover .lgc-header-lang-label,
.lgc-header-lang:focus-visible .lgc-header-lang-label {
  // 80px open target matches pre-migration lang label (tighter than --lgc-label-width).
  @apply 'max-w-[80px] mr-$lgc-gap-compact opacity-100';
}

// Mobile: hide chrome actions except search (owner styles — parent scoped cannot
// reach non-root nodes inside this child). Pure responsive display → @apply only.
.lgc-header-button.is-header-action {
  @apply 'max-md:hidden';
}

.lgc-search.is-header-action,
.lgc-search.is-header-action .lgc-header-button.is-header-action {
  @apply 'max-md:grid';
}
</style>
