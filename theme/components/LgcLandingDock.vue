<script setup lang="ts">
import type { LandingLink, LandingLinkVariant } from '../types'

defineProps<{
  links: LandingLink[]
}>()

const variantClass: Record<LandingLinkVariant, string> = {
  default: '',
  primary: 'is-primary',
  tonal: 'is-tonal',
  cookie: 'is-cookie',
  ribbon: 'is-ribbon',
}
</script>

<template>
  <nav class="lgc-dock" aria-label="Landing links">
    <AppLink
      v-for="item in links"
      :key="`${item.text}-${item.link}`"
      class="lgc-dock-link lgc-dock-link-base"
      :class="variantClass[item.variant || 'default']"
      :to="item.link"
    >
      <span
        v-if="item.icon"
        class="lgc-dock-link-icon"
        :class="item.icon"
        aria-hidden="true"
      />
      <span class="lgc-dock-link-text">{{ item.text }}</span>
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-dock {
  display: flex;
  max-width: var(--lgc-measure-wide);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--lgc-space-sm);
  margin-top: 28px;
}

.lgc-dock-link {
  --lgc-dock-hover-color: var(--md-sys-color-primary);
  --lgc-dock-hover-bg: var(--md-sys-color-surface-container-highest);

  min-height: var(--lgc-control-size-compact);
  padding-inline: var(--lgc-space-lg);

  &.is-primary {
    --lgc-dock-hover-color: var(--md-sys-color-on-primary-container);
    --lgc-dock-hover-bg: var(--md-sys-color-primary-container);

    color: var(--md-sys-color-on-primary);
    background: var(--md-sys-color-primary);
  }

  &.is-tonal {
    --lgc-dock-hover-color: var(--md-sys-color-on-secondary-container);
    --lgc-dock-hover-bg: var(--md-sys-color-secondary-container);

    color: var(--md-sys-color-on-secondary-container);
    background: var(--md-sys-color-secondary-container);
  }

  &.is-cookie {
    --lgc-dock-hover-color: #2b1a10;
    --lgc-dock-hover-bg: #ffd8a9;

    color: #2b1a10;
    background: #f4c892;
  }

  &.is-ribbon {
    --lgc-dock-hover-color: #3a0717;
    --lgc-dock-hover-bg: #ffd8e4;

    color: #3a0717;
    background: #ffc2d8;
  }

  &:hover {
    border-radius: var(--lgc-radius-control-morph);
    color: var(--lgc-dock-hover-color);
    background: var(--lgc-dock-hover-bg);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(var(--lgc-control-press-scale));
  }
}

.lgc-dock-link-icon {
  font-size: var(--lgc-icon-font-sm);
}

.lgc-dock-link-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@include compact-up {
  .lgc-dock {
    gap: var(--lgc-space-md);
    margin-top: 36px;
  }

  .lgc-dock-link {
    min-height: var(--lgc-control-size);
    padding-inline: var(--lgc-space-xl);
  }
}
</style>
