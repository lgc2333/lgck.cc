<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface NavItem {
  external?: boolean
  href: string
  title: string
}

defineProps<{
  label: string
  next?: NavItem
  prev?: NavItem
}>()

const { t } = useI18n()
</script>

<template>
  <nav
    v-if="prev || next"
    class="lgc-prev-next-nav"
    :class="{ 'has-pair': prev && next }"
    grid
    gap="$lgc-space-md"
    :aria-label="label"
  >
    <component
      :is="prev?.external ? 'a' : 'RouterLink'"
      v-if="prev"
      class="lgc-prev-next-nav-item lgc-panel-link is-previous"
      grid
      min-w="0"
      items-center
      gap="$lgc-space-sm"
      overflow-hidden
      v-bind="
        prev.external
          ? { href: prev.href, target: '_blank', rel: 'noopener noreferrer' }
          : { to: prev.href }
      "
    >
      <span
        flex-none
        inline-grid
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        text="$md-sys-color-primary size-$lgc-icon-size"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span i-material-symbols-arrow-back-rounded />
      </span>
      <span grid min-w="0" gap="$lgc-space-xs">
        <span
          text="$md-sys-color-on-surface-variant size-$lgc-label-small"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          {{ t('post.previous') }}
        </span>
        <strong class="lgc-prev-next-nav-title">{{ prev.title }}</strong>
      </span>
    </component>

    <component
      :is="next?.external ? 'a' : 'RouterLink'"
      v-if="next"
      class="lgc-prev-next-nav-item lgc-panel-link is-next"
      min-w="0"
      gap="$lgc-space-sm"
      text-right
      grid
      items-center
      overflow-hidden
      v-bind="
        next.external
          ? { href: next.href, target: '_blank', rel: 'noopener noreferrer' }
          : { to: next.href }
      "
    >
      <span grid min-w="0" gap="$lgc-space-xs">
        <span
          text="$md-sys-color-on-surface-variant size-$lgc-label-small"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          {{ t('post.next') }}
        </span>
        <strong class="lgc-prev-next-nav-title">{{ next.title }}</strong>
      </span>
      <span
        flex-none
        inline-grid
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        text="$md-sys-color-primary size-$lgc-icon-size"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span
          :class="
            next.external
              ? 'i-material-symbols-open-in-new-rounded'
              : 'i-material-symbols-arrow-forward-rounded'
          "
        />
      </span>
    </component>
  </nav>
</template>

<style scoped lang="scss">
.lgc-prev-next-nav.has-pair {
  @apply 'md:grid-cols-2';
}

// Residual: asymmetric grid tracks (icon | copy vs copy | icon).
.lgc-prev-next-nav-item {
  grid-template-columns: auto minmax(0, 1fr);
}

.lgc-prev-next-nav-item.is-next {
  grid-template-columns: minmax(0, 1fr) auto;
}

// Residual: multi-line clamp needs -webkit-box (line-clamp alone is incomplete here).
.lgc-prev-next-nav-title {
  display: -webkit-box;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  @apply 'overflow-hidden text-size-$lgc-body-medium leading-[1.45] line-clamp-2';
}
</style>
