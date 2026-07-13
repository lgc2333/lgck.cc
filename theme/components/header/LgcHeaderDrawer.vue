<script setup lang="ts">
import { useAppStore, useLocale } from 'valaxy'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import {
  resolveHeaderNavItemState,
  useFixedBg,
  useHeaderNavItemState,
  useLanguageFlip,
  useThemeConfig,
} from '../../composables'
import type { HeaderActivePathRewrite, HeaderNavLink } from '../../types'
import { formatLocaleName } from '../../utils/locale'
import { normalizeLocaleText } from '../../utils/post'

const props = defineProps<{
  addHome?: boolean
  activePathRewrites?: HeaderActivePathRewrite[]
  homeLink: HeaderNavLink
  links: HeaderNavLink[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const appStore = useAppStore()
const route = useRoute()
const themeConfig = useThemeConfig()
const { t, locale } = useI18n()
const { toggleLocales } = useLocale()
const { flipLanguageIcon, languageFlipping, stopLanguageFlip } = useLanguageFlip()
const { canSwitchImage, isSwitching, switchNow, visibleImage } = useFixedBg()
const showI18n = computed(() => themeConfig.value.header?.i18n !== false)
const languageName = computed(() => formatLocaleName(locale.value))
const fixedBgActionHref = computed(() => {
  const image = visibleImage.value
  return image?.sourceUrl || image?.url || ''
})
const fixedBgActionLabel = computed(
  () => visibleImage.value?.title || t('fixed_bg.title'),
)
const fixedBgActionAuthor = computed(() => visibleImage.value?.author)
const fixedBgActionDescription = computed(
  () => visibleImage.value?.description || t('fixed_bg.empty_description'),
)
const fixedBgSwitchLabel = computed(() =>
  isSwitching.value ? t('fixed_bg.loading') : t('fixed_bg.refresh'),
)
const homeLinkState = useHeaderNavItemState({
  activeMatch: 'exact',
  activePathRewrites: toRef(props, 'activePathRewrites'),
  item: toRef(props, 'homeLink'),
})

function isDrawerLinkActive(item: HeaderNavLink) {
  if (item.link === props.homeLink.link) return homeLinkState.isRouteActive.value

  return resolveHeaderNavItemState(
    route.path,
    item,
    item.link === '/' ? 'exact' : 'prefix',
    props.activePathRewrites,
  ).isRouteActive
}

function getDrawerIcon(item: HeaderNavLink) {
  if (item.link === props.homeLink.link) return homeLinkState.iconClass.value

  return resolveHeaderNavItemState(
    route.path,
    item,
    item.link === '/' ? 'exact' : 'prefix',
    props.activePathRewrites,
  ).iconClass
}

function toggleLanguage() {
  flipLanguageIcon()
  toggleLocales()
}

function refreshFixedBg() {
  if (isSwitching.value) return

  void switchNow()
}

function linkLabel(item: HeaderNavLink) {
  return normalizeLocaleText(item.text, locale.value, t)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lgc-drawer-fade">
      <button
        v-if="open"
        class="lgc-drawer-backdrop"
        z="$lgc-layer-overlay"
        border-0
        inset-0
        fixed
        type="button"
        :aria-label="t('accessibility.close_nav')"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="lgc-drawer-slide">
      <aside
        v-if="open"
        id="lgc-mobile-drawer"
        class="lgc-drawer"
        flex="~ col"
        bottom-0
        left-0
        top-0
        fixed
        z="$lgc-layer-modal"
        p="$lgc-space-lg"
        text="$md-sys-color-on-surface"
        bg="$md-sys-color-surface-container-low"
        :aria-label="t('accessibility.mobile_nav')"
      >
        <div
          flex="~ items-center justify-between"
          min-h="$lgc-control-size"
          gap="$lgc-space-lg"
          mb="$lgc-space-sm"
        >
          <span
            text="$md-sys-color-on-surface-variant size-$lgc-label-medium"
            font="900"
            tracking="[0.04em]"
            uppercase
          >
            {{ t('menu.title') }}
          </span>
          <button
            class="lgc-icon-button-base lgc-icon-button-hover"
            w="$lgc-control-size-compact"
            h="$lgc-control-size-compact"
            rounded-full
            grid
            text="size-$lgc-icon-size"
            type="button"
            :aria-label="t('accessibility.close_nav')"
            @click="emit('close')"
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </button>
        </div>

        <nav
          flex-1
          grid
          content-start
          gap="1.5"
          pt="$lgc-space-sm"
          :aria-label="t('accessibility.mobile_nav_links')"
        >
          <AppLink
            v-if="addHome"
            class="lgc-drawer-link lgc-drawer-home"
            :class="{ 'is-route-active': isDrawerLinkActive(homeLink) }"
            :to="homeLink.link"
            @click="emit('close')"
          >
            <span
              class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
              :class="getDrawerIcon(homeLink)"
              aria-hidden="true"
            />
            <span>{{ linkLabel(homeLink) }}</span>
          </AppLink>

          <AppLink
            v-for="item in links"
            :key="`drawer-${item.link}`"
            class="lgc-drawer-link"
            :class="{ 'is-route-active': isDrawerLinkActive(item) }"
            :to="item.link"
            @click="emit('close')"
          >
            <span
              class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
              :class="getDrawerIcon(item)"
              aria-hidden="true"
            />
            <span>{{ linkLabel(item) }}</span>
          </AppLink>
        </nav>

        <div
          gap="1.5"
          pt="$lgc-space-lg"
          mt-auto
          grid
          :aria-label="t('accessibility.nav_settings')"
        >
          <a
            v-if="visibleImage && fixedBgActionHref"
            class="lgc-drawer-link"
            items-center
            py="$lgc-space-md"
            :href="fixedBgActionHref"
            target="_blank"
            rel="noopener"
            :aria-label="fixedBgActionLabel"
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
                {{ fixedBgActionLabel }}
              </span>
              <span
                v-if="fixedBgActionAuthor"
                mt="0.5"
                font="400"
                text="$md-sys-color-on-surface-variant size-$lgc-body-small"
                leading-snug
                block
                whitespace="pre-wrap"
                wrap="anywhere"
              >
                {{ fixedBgActionAuthor }}
              </span>
              <span
                mt="0.5"
                font="400"
                text="$md-sys-color-on-surface-variant size-$lgc-body-small"
                leading-snug
                block
                whitespace="pre-wrap"
                wrap="anywhere"
              >
                {{ fixedBgActionDescription }}
              </span>
            </span>
          </a>

          <button
            v-if="canSwitchImage"
            class="lgc-drawer-link font-inherit appearance-none bg-transparent cursor-pointer"
            type="button"
            :disabled="isSwitching"
            :aria-label="fixedBgSwitchLabel"
            @click="refreshFixedBg"
          >
            <span
              class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
              :class="{ 'is-loading': isSwitching }"
              i-material-symbols-refresh-rounded
              aria-hidden="true"
            />
            <span>{{ fixedBgSwitchLabel }}</span>
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
            :aria-label="
              appStore.isDark ? t('button.toggle_light') : t('button.toggle_dark')
            "
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
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
// Residual: scrim color-mix, drawer width min(), blur, asymmetric radius, state-layer
// color-mix, grid tracks. Multi-use link chrome stays @apply (state/hover cascade).
// Transition *name* classes must stay CSS (Vue Transition cannot take attributify).
.lgc-drawer-backdrop {
  background: color-mix(in srgb, var(--md-sys-color-scrim, #000) 42%, transparent);
}

.lgc-drawer {
  --drawer-panel-width: min(
    var(--lgc-drawer-width),
    calc(100vw - var(--lgc-control-size))
  );
  width: var(--drawer-panel-width);
  backdrop-filter: blur(var(--lgc-elevate-blur));
  border-radius: 0 var(--lgc-radius-large) var(--lgc-radius-large) 0;
}

.lgc-drawer-link {
  --drawer-link-cols: var(--lgc-icon-size) minmax(0, 1fr);
  grid-template-columns: var(--drawer-link-cols);
  @apply 'grid min-h-$lgc-control-size items-center gap-[14px]';
  @apply 'px-$lgc-space-lg border-0 rounded-$lgc-radius-control';
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-body-medium';
  @apply 'font-800 text-left no-underline';
  @apply 'transition-[background-color,border-radius,color,transform]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
}

.lgc-drawer-link:hover,
.lgc-drawer-link:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary';
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lgc-drawer-link:active {
  background: color-mix(
    in srgb,
    currentColor var(--lgc-state-pressed-opacity),
    transparent
  );
  @apply 'scale-$lgc-control-press-scale';
}

.lgc-drawer-link:disabled,
.lgc-drawer-link:disabled:hover,
.lgc-drawer-link:disabled:focus-visible {
  transform: none;
  @apply 'text-$md-sys-color-on-surface-variant opacity-70 cursor-wait';
  @apply 'rounded-$lgc-radius-control bg-transparent';
}

.is-loading {
  animation: lgc-drawer-refresh-spin 900ms linear infinite;
}

@keyframes lgc-drawer-refresh-spin {
  to {
    transform: rotate(1turn);
  }
}

.lgc-drawer-link.router-link-exact-active,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home),
.lgc-drawer-link.is-route-active {
  @apply 'rounded-$lgc-radius-control-active';
  @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
}

.lgc-drawer-link.router-link-exact-active:hover,
.lgc-drawer-link.router-link-exact-active:focus-visible,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):hover,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):focus-visible,
.lgc-drawer-link.is-route-active:hover,
.lgc-drawer-link.is-route-active:focus-visible {
  @apply 'rounded-$lgc-radius-control-active';
  @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
}

.lgc-drawer-fade-enter-active,
.lgc-drawer-fade-leave-active,
.lgc-drawer-slide-enter-active,
.lgc-drawer-slide-leave-active {
  @apply 'transition-[opacity,transform] duration-$lgc-motion-medium';
  @apply 'ease-$lgc-easing-standard';
}

.lgc-drawer-fade-enter-from,
.lgc-drawer-fade-leave-to {
  @apply 'opacity-0';
}

.lgc-drawer-slide-enter-from,
.lgc-drawer-slide-leave-to {
  @apply '-translate-x-full';
}
</style>
