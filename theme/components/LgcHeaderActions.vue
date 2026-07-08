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
  <div class="lgc-header-group">
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
        class="lgc-header-lang-icon"
        :class="{ 'is-flipping': languageFlipping }"
        i-material-symbols-translate-rounded
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
@use '../styles/helpers' as *;

.lgc-header-lang {
  --lgc-header-lang-icon-size: 1.5rem;
  --lgc-header-lang-padding: calc(
    (var(--lgc-control-size) - var(--lgc-header-lang-icon-size)) / 2
  );

  display: inline-flex;
  width: auto;
  min-width: var(--lgc-control-size);
  max-width: var(--lgc-control-size);
  align-items: center;
  justify-content: flex-end;
  padding-inline: var(--lgc-header-lang-padding);
  overflow: hidden;

  &:hover,
  &:focus-visible {
    max-width: 9rem;
  }
}

.lgc-header-lang-label {
  max-width: 0;
  margin-right: 0;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 900;
  line-height: 1;
  // text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  transition:
    margin-right var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-header-lang:hover .lgc-header-lang-label,
.lgc-header-lang:focus-visible .lgc-header-lang-label {
  max-width: 5rem;
  margin-right: var(--lgc-gap-compact);
  opacity: 1;
}

.lgc-header-lang-icon {
  flex: 0 0 auto;
}

.lgc-header-lang-icon.is-flipping {
  animation: lgc-lang-flip 520ms var(--lgc-easing-standard);
}

@include nav-down {
  .lgc-header-button.is-header-action {
    display: none;
  }

  .lgc-search.is-header-action,
  .lgc-search.is-header-action .lgc-header-button.is-header-action {
    display: grid;
  }
}

@keyframes lgc-lang-flip {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}
</style>
