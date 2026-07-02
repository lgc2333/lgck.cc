<script setup lang="ts">
import type { HeaderNavLink } from '../types'

defineProps<{
  addHome?: boolean
  homeLabel?: string
  links: HeaderNavLink[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
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
          <RouterLink
            v-if="addHome"
            class="lgc-drawer-link lgc-drawer-home"
            to="/"
            @click="emit('close')"
          >
            <span i-material-symbols-home-rounded aria-hidden="true" />
            <span>{{ homeLabel || 'Home' }}</span>
          </RouterLink>

          <AppLink
            v-for="item in links"
            :key="`drawer-${item.text}-${item.link}`"
            class="lgc-drawer-link"
            :to="item.link"
            @click="emit('close')"
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
  width: min(20rem, calc(100vw - var(--lgc-control-size)));
  flex-direction: column;
  padding: 1rem;
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-low);
  backdrop-filter: blur(18px);
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
  font-size: 0.8125rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lgc-drawer-close {
  display: grid;
  width: var(--lgc-control-size-compact);
  height: var(--lgc-control-size-compact);
  border-radius: calc(var(--lgc-control-size-compact) / 2);
  font-size: 1.5rem;
}

.lgc-drawer-list {
  display: grid;
  gap: 0.375rem;
  padding-top: 0.5rem;
}

.lgc-drawer-link {
  display: grid;
  min-height: var(--lgc-control-size);
  grid-template-columns: 1.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.875rem;
  padding-inline: 1rem;
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9375rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    color var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
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
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home) {
  border-radius: var(--lgc-radius-control-active);
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.lgc-drawer-link.router-link-exact-active:hover,
.lgc-drawer-link.router-link-exact-active:focus-visible,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):hover,
.lgc-drawer-link.router-link-active:not(.lgc-drawer-home):focus-visible {
  border-radius: var(--lgc-radius-control-active);
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
