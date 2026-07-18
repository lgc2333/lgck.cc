<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { HeaderActivePathRewrite, HeaderNavLink } from '../../types'

defineProps<{
  addHome?: boolean
  activePathRewrites?: HeaderActivePathRewrite[]
  homeLink: HeaderNavLink
  links: HeaderNavLink[]
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <Transition name="lgc-drawer-fade">
      <button
        v-if="open"
        class="lgc-drawer-backdrop"
        z="$lgc-layer-overlay"
        backdrop="blur-$lgc-mask-blur"
        border-0
        inset-0
        fixed
        type="button"
        :aria-label="t('accessibility.navigation.close')"
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
        :aria-label="t('accessibility.navigation.mobile')"
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
            class="lgc-control-reset lgc-control-on-surface lgc-control-state-layer"
            w="$lgc-control-size-compact"
            h="$lgc-control-size-compact"
            rounded-full
            grid
            place-items="center"
            text="size-$lgc-icon-size"
            type="button"
            :aria-label="t('accessibility.navigation.close')"
            @click="emit('close')"
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </button>
        </div>

        <LgcHeaderDrawerNav
          :active-path-rewrites="activePathRewrites"
          :add-home="addHome"
          :home-link="homeLink"
          :links="links"
          @close="emit('close')"
        />

        <LgcHeaderDrawerSettings @close="emit('close')" />
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
// Residual: scrim color-mix, drawer width min(), asymmetric radius, state-layer
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
  transform: scale(var(--lgc-control-press-scale));
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
  transform: translateX(-100%);
}
</style>
