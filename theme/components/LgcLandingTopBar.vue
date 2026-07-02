<script setup lang="ts">
import { useAppStore, useLocale } from 'valaxy'
import type { SocialLink } from 'valaxy'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { TopBarLinksConfig } from '../types'

const props = withDefaults(
  defineProps<{
    addHome?: boolean
    homeFixed?: boolean
    homeLabel?: string
    linkOptions?: Partial<TopBarLinksConfig>
    links: SocialLink[]
  }>(),
  {
    addHome: true,
    homeFixed: true,
  },
)

const appStore = useAppStore()
const { t, locale } = useI18n()
const { toggleLocales } = useLocale()
const drawerOpen = ref(false)
const languageFlipping = ref(false)
const linkOptions = computed(() => props.linkOptions || {})
const linkMode = computed(() => linkOptions.value.mode || 'hover')
const linkStyle = computed(() => ({
  '--lgc-topbar-link-width': linkOptions.value.width || undefined,
  '--lgc-topbar-link-min-width': linkOptions.value.minWidth || '3rem',
  '--lgc-topbar-link-max-width': linkOptions.value.maxWidth || '11rem',
}))

const topbarLinks = computed(() => {
  return props.links.slice(0, 5).map((item) => ({
    text: item.name,
    link: item.link,
    icon: item.icon,
  }))
})

function closeDrawer() {
  drawerOpen.value = false
}

function toggleLanguage() {
  languageFlipping.value = false
  requestAnimationFrame(() => {
    languageFlipping.value = true
  })
  toggleLocales()
}
</script>

<template>
  <nav class="lgc-topbar" aria-label="Primary navigation">
    <div class="lgc-topbar-group lgc-topbar-primary">
      <button
        class="lgc-topbar-button lgc-topbar-menu lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        :aria-expanded="drawerOpen"
        aria-controls="lgc-mobile-drawer"
        aria-label="Open navigation"
        @click="drawerOpen = true"
      >
        <span i-material-symbols-menu-rounded aria-hidden="true" />
      </button>

      <RouterLink
        v-if="addHome"
        class="lgc-topbar-button lgc-topbar-home lgc-icon-button-base lgc-icon-button-hover"
        :class="{
          'has-label': homeLabel,
          'is-home-fixed': homeLabel && homeFixed,
          'is-home-collapsible': homeLabel && !homeFixed,
        }"
        to="/"
        :aria-label="homeLabel || 'Home'"
      >
        <span i-material-symbols-home-rounded aria-hidden="true" />
        <span v-if="homeLabel" class="lgc-topbar-home-label">{{ homeLabel }}</span>
      </RouterLink>

      <AppLink
        v-for="(item, index) in topbarLinks"
        :key="`${item.text}-${item.link}`"
        class="lgc-topbar-button lgc-topbar-link lgc-icon-button-base lgc-icon-button-hover"
        :class="[
          {
            'is-optional': index >= 3,
            'is-icon': linkMode === 'icon',
            'is-hover': linkMode === 'hover',
            'is-expanded': linkMode === 'expanded',
            'is-fixed': linkOptions.width,
          },
        ]"
        :style="linkStyle"
        :to="item.link"
        :aria-label="item.text"
      >
        <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
        <span v-else class="lgc-topbar-fallback">{{ item.text.slice(0, 1) }}</span>
        <span class="lgc-topbar-label">{{ item.text }}</span>
      </AppLink>
    </div>

    <div class="lgc-topbar-group">
      <button
        class="lgc-topbar-button lgc-topbar-lang lgc-icon-button-base lgc-icon-button-hover is-optional"
        type="button"
        :aria-label="t('button.toggle_langs')"
        :title="t('button.toggle_langs')"
        @click="toggleLanguage"
      >
        <span class="lgc-topbar-lang-label">{{ locale }}</span>
        <span
          class="lgc-topbar-lang-icon"
          :class="{ 'is-flipping': languageFlipping }"
          i-material-symbols-translate-rounded
          aria-hidden="true"
          @animationend="languageFlipping = false"
        />
      </button>

      <button
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        aria-label="Toggle dark mode"
        @click="appStore.toggleDarkWithTransition"
      >
        <span
          v-if="!appStore.isDark"
          i-material-symbols-dark-mode-outline-rounded
          aria-hidden="true"
        />
        <span v-else i-material-symbols-light-mode-outline-rounded aria-hidden="true" />
      </button>

      <button
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        aria-label="Search"
      >
        <span i-material-symbols-search-rounded aria-hidden="true" />
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <Transition name="lgc-drawer-fade">
      <button
        v-if="drawerOpen"
        class="lgc-drawer-backdrop"
        type="button"
        aria-label="Close navigation"
        @click="closeDrawer"
      />
    </Transition>

    <Transition name="lgc-drawer-slide">
      <aside
        v-if="drawerOpen"
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
            @click="closeDrawer"
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </button>
        </div>

        <nav class="lgc-drawer-list" aria-label="Mobile navigation links">
          <RouterLink
            v-if="addHome"
            class="lgc-drawer-link lgc-drawer-home"
            to="/"
            @click="closeDrawer"
          >
            <span i-material-symbols-home-rounded aria-hidden="true" />
            <span>{{ homeLabel || 'Home' }}</span>
          </RouterLink>

          <AppLink
            v-for="item in topbarLinks"
            :key="`drawer-${item.text}-${item.link}`"
            class="lgc-drawer-link"
            :to="item.link"
            @click="closeDrawer"
          >
            <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
            <span v-else class="lgc-drawer-fallback">{{ item.text.slice(0, 1) }}</span>
            <span>{{ item.text }}</span>
          </AppLink>
        </nav>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lgc-topbar {
  position: sticky;
  z-index: 30;
  top: 0;
  display: flex;
  width: 100%;
  max-width: 1180px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem;
  margin-inline: auto;
  backdrop-filter: blur(18px);
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 34%,
    transparent
  );
  border-radius: 0 0 1.5rem 1.5rem;
}

.lgc-topbar-group {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.lgc-topbar-button {
  inline-size: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
  font-size: 1.5rem;

  &:hover {
    border-radius: 1rem;
  }
}

.lgc-topbar-home > span:first-child,
.lgc-topbar-link > span:first-child {
  flex: 0 0 var(--lgc-topbar-link-icon-size, 1em);
  inline-size: var(--lgc-topbar-link-icon-size, 1em);
  block-size: var(--lgc-topbar-link-icon-size, 1em);
  font-size: var(--lgc-topbar-link-icon-size, 1em);
}

.lgc-topbar-menu {
  display: none;
}

.lgc-topbar-button.router-link-exact-active {
  border-radius: 1rem;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-topbar-link.router-link-active {
  border-radius: 1rem;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-topbar-home.has-label {
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: center;
  overflow: hidden;
}

.lgc-topbar-home.is-home-fixed {
  gap: 0.45rem;
}

.lgc-topbar-home.is-home-collapsible {
  inline-size: auto;
  min-inline-size: 3rem;
  max-inline-size: 3rem;
  gap: 0;

  &:hover,
  &:focus-visible {
    max-inline-size: min(13rem, 48vw);
    gap: 0.45rem;
    padding-inline: 0.85rem;
  }
}

.lgc-topbar-home-label {
  display: none;
  max-width: 9rem;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 900;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transition:
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-topbar-link {
  --lgc-topbar-link-icon-size: 1em;
  --lgc-topbar-link-rest-padding: calc(
    (var(--lgc-topbar-link-min-width, 3rem) - var(--lgc-topbar-link-icon-size)) / 2
  );

  inline-size: var(--lgc-topbar-link-width, auto);
  min-inline-size: var(--lgc-topbar-link-min-width, 3rem);
  max-inline-size: var(--lgc-topbar-link-min-width, 3rem);
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding-inline: var(--lgc-topbar-link-rest-padding);

  &:hover,
  &:focus-visible {
    max-inline-size: min(var(--lgc-topbar-link-max-width, 11rem), 42vw);
  }
}

.lgc-topbar-link.is-icon {
  max-inline-size: var(--lgc-topbar-link-width, var(--lgc-topbar-link-min-width, 3rem));

  &:hover,
  &:focus-visible {
    max-inline-size: var(
      --lgc-topbar-link-width,
      var(--lgc-topbar-link-min-width, 3rem)
    );
  }
}

.lgc-topbar-link.is-fixed {
  inline-size: var(--lgc-topbar-link-width);
  max-inline-size: var(--lgc-topbar-link-width);
}

.lgc-topbar-link.is-hover.is-fixed {
  &:hover,
  &:focus-visible {
    max-inline-size: var(--lgc-topbar-link-width);
  }
}

.lgc-topbar-link.is-expanded {
  max-inline-size: var(--lgc-topbar-link-max-width, 11rem);
}

.lgc-topbar-link.is-expanded.is-fixed {
  inline-size: var(--lgc-topbar-link-width);
  max-inline-size: var(--lgc-topbar-link-width);
}

.lgc-topbar-label {
  max-width: 0;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1;
  margin-left: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transition:
    margin-left var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-topbar-link:hover .lgc-topbar-label,
.lgc-topbar-link:focus-visible .lgc-topbar-label,
.lgc-topbar-link.is-expanded .lgc-topbar-label {
  max-width: 9rem;
  margin-left: 0.45rem;
  opacity: 1;
}

.lgc-topbar-link.is-icon .lgc-topbar-label,
.lgc-topbar-link.is-icon:hover .lgc-topbar-label,
.lgc-topbar-link.is-icon:focus-visible .lgc-topbar-label {
  max-width: 0;
  margin-left: 0;
  opacity: 0;
}

.lgc-topbar-home.is-home-collapsible:hover .lgc-topbar-home-label,
.lgc-topbar-home.is-home-collapsible:focus-visible .lgc-topbar-home-label {
  max-width: 9rem;
  opacity: 1;
}

.lgc-topbar-fallback {
  font-size: 1.25rem;
  font-weight: 800;
}

.lgc-topbar-lang {
  --lgc-topbar-lang-icon-size: 1.5rem;
  --lgc-topbar-lang-padding: calc((3rem - var(--lgc-topbar-lang-icon-size)) / 2);

  display: inline-flex;
  width: auto;
  min-width: 3rem;
  max-width: 3rem;
  align-items: center;
  justify-content: flex-end;
  padding-inline: var(--lgc-topbar-lang-padding);
  overflow: hidden;

  &:hover,
  &:focus-visible {
    max-width: 8rem;
  }
}

.lgc-topbar-lang-label {
  max-width: 0;
  margin-right: 0;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  transition:
    margin-right var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-topbar-lang:hover .lgc-topbar-lang-label,
.lgc-topbar-lang:focus-visible .lgc-topbar-lang-label {
  max-width: 4rem;
  margin-right: 0.45rem;
  opacity: 1;
}

.lgc-topbar-lang-icon {
  flex: 0 0 auto;
}

.lgc-topbar-lang-icon.is-flipping {
  animation: lgc-lang-flip 520ms var(--lgc-easing-standard);
}

@media (max-width: 720px) {
  .lgc-topbar-menu {
    display: grid;
  }

  .lgc-topbar-primary .lgc-topbar-home,
  .lgc-topbar-primary .lgc-topbar-link {
    display: none;
  }

  .lgc-topbar-button.is-optional {
    display: none;
  }
}

@media (min-width: 720px) {
  .lgc-topbar-home.is-home-fixed {
    inline-size: auto;
    max-inline-size: 13rem;
    padding-inline: 0.85rem;
  }

  .lgc-topbar-home.has-label .lgc-topbar-home-label {
    display: inline;
  }

  .lgc-topbar-home.is-home-fixed .lgc-topbar-home-label {
    opacity: 1;
  }

  .lgc-topbar-home.is-home-collapsible .lgc-topbar-home-label {
    max-width: 0;
  }
}

@media (min-width: 640px) {
  .lgc-topbar {
    padding: 0.875rem;
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

<style lang="scss">
.lgc-drawer-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  border: 0;
  background: color-mix(in srgb, var(--md-sys-color-scrim, #000) 42%, transparent);
}

.lgc-drawer {
  position: fixed;
  z-index: 90;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: min(20rem, calc(100vw - 3rem));
  flex-direction: column;
  padding: 1rem;
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-low);
  border-radius: 0 1.75rem 1.75rem 0;
}

.lgc-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3rem;
  margin-bottom: 0.5rem;
}

.lgc-drawer-title {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8125rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lgc-drawer-close {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 1.375rem;
  font-size: 1.5rem;
}

.lgc-drawer-list {
  display: grid;
  gap: 0.375rem;
  padding-top: 0.5rem;
}

.lgc-drawer-link {
  display: grid;
  min-height: 3rem;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.875rem;
  padding-inline: 1rem;
  border-radius: 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9375rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    color var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-drawer-link:hover,
.lgc-drawer-link:focus-visible {
  border-radius: 1rem;
  color: var(--md-sys-color-primary);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lgc-drawer-link.router-link-exact-active,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home) {
  border-radius: 1rem;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-drawer-link.router-link-exact-active:hover,
.lgc-drawer-link.router-link-exact-active:focus-visible,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):hover,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):focus-visible {
  border-radius: 1rem;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-drawer-fallback {
  font-weight: 900;
  text-align: center;
}

.lgc-drawer-fade-enter-active,
.lgc-drawer-fade-leave-active,
.lgc-drawer-slide-enter-active,
.lgc-drawer-slide-leave-active {
  transition: all var(--lgc-motion-medium) var(--lgc-easing-standard);
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
