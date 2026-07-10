<script setup lang="ts">
import { useAppStore, useLocale } from 'valaxy'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import {
  resolveHeaderNavItemState,
  useHeaderNavItemState,
  useLanguageFlip,
  useThemeConfig,
} from '../composables'
import type { HeaderActivePathRewrite, HeaderNavLink } from '../types'
import { formatLocaleName } from '../utils/locale'

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
const showI18n = computed(() => themeConfig.value.header?.i18n !== false)
const languageName = computed(() => formatLocaleName(locale.value))
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
</script>

<template>
  <Teleport to="body">
    <Transition name="lgc-drawer-fade">
      <button
        v-if="open"
        class="lgc-drawer-backdrop"
        type="button"
        aria-label="Close navigation"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="lgc-drawer-slide">
      <aside
        v-if="open"
        id="lgc-mobile-drawer"
        class="lgc-drawer"
        aria-label="Mobile navigation"
      >
        <div class="lgc-drawer-header">
          <span class="lgc-drawer-title">Navigation</span>
          <button
            class="lgc-drawer-close lgc-icon-button-base lgc-icon-button-hover"
            type="button"
            aria-label="Close navigation"
            @click="emit('close')"
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </button>
        </div>

        <nav class="lgc-drawer-list" aria-label="Mobile navigation links">
          <AppLink
            v-if="addHome"
            class="lgc-drawer-link lgc-drawer-home"
            :class="{ 'is-route-active': isDrawerLinkActive(homeLink) }"
            :to="homeLink.link"
            @click="emit('close')"
          >
            <span
              class="lgc-drawer-icon"
              :class="getDrawerIcon(homeLink)"
              aria-hidden="true"
            />
            <span>{{ homeLink.text }}</span>
          </AppLink>

          <AppLink
            v-for="item in links"
            :key="`drawer-${item.text}-${item.link}`"
            class="lgc-drawer-link"
            :class="{ 'is-route-active': isDrawerLinkActive(item) }"
            :to="item.link"
            @click="emit('close')"
          >
            <span
              class="lgc-drawer-icon"
              :class="getDrawerIcon(item)"
              aria-hidden="true"
            />
            <span>{{ item.text }}</span>
          </AppLink>
        </nav>

        <div class="lgc-drawer-footer" aria-label="Navigation settings">
          <button
            v-if="showI18n"
            class="lgc-drawer-link lgc-drawer-control"
            type="button"
            :aria-label="t('button.toggle_langs')"
            @click="toggleLanguage"
          >
            <span
              class="lgc-drawer-icon lgc-lang-flip-icon"
              :class="{ 'is-flipping': languageFlipping }"
              i-material-symbols-translate-rounded
              aria-hidden="true"
              @animationend="stopLanguageFlip"
            />
            <span>{{ languageName }}</span>
          </button>

          <button
            class="lgc-drawer-link lgc-drawer-control"
            type="button"
            :aria-label="
              appStore.isDark ? t('button.toggle_light') : t('button.toggle_dark')
            "
            @click="appStore.toggleDarkWithTransition"
          >
            <span
              v-if="!appStore.isDark"
              class="lgc-drawer-icon"
              i-material-symbols-light-mode-outline-rounded
              aria-hidden="true"
            />
            <span
              v-else
              class="lgc-drawer-icon"
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
.lgc-drawer-backdrop {
  position: fixed;
  z-index: var(--lgc-layer-overlay);
  inset: 0;
  border: 0;
  background: color-mix(in srgb, var(--md-sys-color-scrim, #000) 42%, transparent);
}

.lgc-drawer {
  position: fixed;
  z-index: var(--lgc-layer-modal);
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: min(20rem, calc(100vw - var(--lgc-control-size)));
  flex-direction: column;
  padding: 1rem;
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-low);
  backdrop-filter: blur(var(--lgc-surface-blur));
  border-radius: 0 var(--lgc-radius-large) var(--lgc-radius-large) 0;
}

.lgc-drawer-header {
  display: flex;
  min-height: var(--lgc-control-size);
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.lgc-drawer-title {
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--lgc-label-medium);
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lgc-drawer-close {
  display: grid;
  width: var(--lgc-control-size-compact);
  height: var(--lgc-control-size-compact);
  border-radius: calc(var(--lgc-control-size-compact) / 2);
  font-size: var(--lgc-icon-size);
}

.lgc-drawer-list {
  display: grid;
  flex: 1;
  align-content: start;
  gap: 0.375rem;
  padding-top: 0.5rem;
}

.lgc-drawer-footer {
  display: grid;
  gap: 0.375rem;
  padding-top: 1rem;
  margin-top: auto;
}

.lgc-drawer-link {
  display: grid;
  min-height: var(--lgc-control-size);
  grid-template-columns: 1.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.875rem;
  padding-inline: 1rem;
  border: 0;
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--lgc-body-medium);
  font-weight: 800;
  text-align: left;
  text-decoration: none;
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    color var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-drawer-control {
  appearance: none;
  font: inherit;
  cursor: pointer;
  background: transparent;
}

.lgc-drawer-link:hover,
.lgc-drawer-link:focus-visible {
  border-radius: var(--lgc-radius-control-active);
  color: var(--md-sys-color-primary);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lgc-drawer-link:active {
  background: color-mix(
    in srgb,
    currentColor calc(var(--lgc-state-pressed-opacity) * 100%),
    transparent
  );
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-drawer-link.router-link-exact-active,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home),
.lgc-drawer-link.is-route-active {
  border-radius: var(--lgc-radius-control-active);
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-drawer-link.router-link-exact-active:hover,
.lgc-drawer-link.router-link-exact-active:focus-visible,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):hover,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):focus-visible,
.lgc-drawer-link.is-route-active:hover,
.lgc-drawer-link.is-route-active:focus-visible {
  border-radius: var(--lgc-radius-control-active);
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-drawer-icon {
  inline-size: var(--lgc-icon-size);
  block-size: var(--lgc-icon-size);
  font-size: var(--lgc-icon-size);
}

.lgc-drawer-fade-enter-active,
.lgc-drawer-fade-leave-active,
.lgc-drawer-slide-enter-active,
.lgc-drawer-slide-leave-active {
  transition:
    opacity var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-drawer-fade-enter-from,
.lgc-drawer-fade-leave-to {
  opacity: 0;
}

.lgc-drawer-slide-enter-from,
.lgc-drawer-slide-leave-to {
  transform: translateX(-100%);
}
</style>
