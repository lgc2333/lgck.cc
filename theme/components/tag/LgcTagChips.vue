<script setup lang="ts">
import { tagRouteLocation } from '../../utils/taxonomy'

interface TagChipItem {
  count: number
  label: string
  name: string
  tone: 'high' | 'low' | 'medium'
}

defineProps<{
  activeTag?: string
  ariaLabel?: string
  tags: TagChipItem[]
}>()
</script>

<template>
  <nav :aria-label="ariaLabel">
    <ul m="0" flex="~ wrap" list-none justify-center gap="$lgc-space-sm" p="0">
      <li v-for="item in tags" :key="item.name">
        <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children. -->
        <RouterLink
          class="lgc-tag-chip"
          :class="[`is-${item.tone}`, { 'is-active': item.name === activeTag }]"
          :to="tagRouteLocation(item.name)"
          :title="`${item.label} (${item.count})`"
          :aria-current="item.name === activeTag ? 'page' : undefined"
          min-h="$lgc-control-size-sm"
          gap="$lgc-space-xs"
          rounded="$lgc-radius-control"
          p="x-$lgc-space-md y-$lgc-space-xs"
          no-underline
          inline-flex
          items-center
        >
          <span i-material-symbols-tag-rounded aria-hidden="true" />
          <span font="800" leading-none>
            {{ item.label }}
          </span>
          <span class="lgc-tag-chip-count">
            {{ item.count }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.lgc-tag-chip {
  @apply 'text-$md-sys-color-on-surface-variant bg-$md-sys-color-surface-variant';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: background-color, border-radius, color, transform;
}

.lgc-tag-chip.is-medium {
  // Residual: tag frequency is a tonal state between static MD tokens.
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 8%,
    var(--md-sys-color-surface-variant)
  );
}

.lgc-tag-chip.is-high {
  @apply 'text-$md-sys-color-primary';
  // Residual: top tags need softer emphasis than a selected primary container.
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 14%,
    var(--md-sys-color-surface-variant)
  );
}

.lgc-tag-chip:hover,
.lgc-tag-chip:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-highest';
}

.lgc-tag-chip.is-active {
  @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
}

.lgc-tag-chip.is-active:hover,
.lgc-tag-chip.is-active:focus-visible {
  @apply 'text-$md-sys-color-on-primary-container';
  // Residual: selected hover keeps the active container and adds a state layer.
  background: color-mix(
    in srgb,
    currentColor 8%,
    var(--md-sys-color-primary-container)
  );
}

.lgc-tag-chip:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-tag-chip-count {
  @apply 'inline-flex min-w-$lgc-icon-size-sm justify-center';
  @apply 'rounded-$lgc-radius-full px-$lgc-space-xs py-0';
  @apply 'text-size-$lgc-label-small font-900 leading-normal';
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .lgc-tag-chip:active {
    transform: none;
  }
}
</style>
