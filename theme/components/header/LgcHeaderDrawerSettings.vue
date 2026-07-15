<script setup lang="ts">
import { useAppStore, useLocale } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFixedBgPresenter, useLanguageFlip, useThemeConfig } from '../../composables'
import { formatLocaleName } from '../../utils/locale'

const emit = defineEmits<{
  close: []
}>()

const appStore = useAppStore()
const themeConfig = useThemeConfig()
const { t, locale } = useI18n()
const { toggleLocales } = useLocale()
const { flipLanguageIcon, languageFlipping, stopLanguageFlip } = useLanguageFlip()
const {
  actionHref,
  author,
  canSwitchImage,
  description,
  isSwitching,
  refresh,
  switchLabel,
  title,
  visibleImage,
} = useFixedBgPresenter()
const showI18n = computed(
  () => themeConfig.value.header?.i18n !== false && appStore.showToggleLocale,
)
const languageName = computed(() => formatLocaleName(locale.value))

function toggleLanguage() {
  flipLanguageIcon()
  toggleLocales()
}
</script>

<template>
  <div
    gap="1.5"
    pt="$lgc-space-lg"
    mt-auto
    grid
    :aria-label="t('accessibility.nav_settings')"
  >
    <a
      v-if="visibleImage && actionHref"
      class="lgc-drawer-link"
      items-center
      py="$lgc-space-md"
      :href="actionHref"
      target="_blank"
      rel="noopener"
      :aria-label="title"
      @click="emit('close')"
    >
      <span
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        i-material-symbols-imagesmode-outline-rounded
        self-center
        aria-hidden="true"
      />
      <span min-w="0">
        <span
          font="900"
          text="$md-sys-color-on-surface"
          leading-snug
          block
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ title }}
        </span>
        <span
          v-if="author"
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant size-$lgc-body-small"
          leading-snug
          block
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ author }}
        </span>
        <span
          v-if="description"
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant size-$lgc-body-small"
          leading-snug
          block
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ description }}
        </span>
      </span>
    </a>

    <button
      v-if="canSwitchImage"
      class="lgc-drawer-link font-inherit appearance-none bg-transparent cursor-pointer"
      type="button"
      :disabled="isSwitching"
      :aria-label="switchLabel"
      @click="refresh"
    >
      <span
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        :class="{ 'is-loading': isSwitching }"
        i-material-symbols-refresh-rounded
        aria-hidden="true"
      />
      <span>{{ switchLabel }}</span>
    </button>

    <button
      v-if="showI18n"
      class="lgc-drawer-link font-inherit appearance-none bg-transparent cursor-pointer"
      type="button"
      :aria-label="t('button.toggle_langs')"
      @click="toggleLanguage"
    >
      <span
        class="lgc-drawer-icon lgc-lang-flip-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        :class="{ 'is-flipping': languageFlipping }"
        i-material-symbols-translate-rounded
        aria-hidden="true"
        @animationend="stopLanguageFlip"
      />
      <span>{{ languageName }}</span>
    </button>

    <button
      class="lgc-drawer-link font-inherit appearance-none bg-transparent cursor-pointer"
      type="button"
      :aria-label="appStore.isDark ? t('button.toggle_light') : t('button.toggle_dark')"
      @click="appStore.toggleDarkWithTransition"
    >
      <span
        v-if="!appStore.isDark"
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        i-material-symbols-light-mode-outline-rounded
        aria-hidden="true"
      />
      <span
        v-else
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        i-material-symbols-dark-mode-outline-rounded
        aria-hidden="true"
      />
      <span>
        {{ appStore.isDark ? t('button.toggle_light') : t('button.toggle_dark') }}
      </span>
    </button>
  </div>
</template>
