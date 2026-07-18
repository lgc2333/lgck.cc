<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'

withDefaults(
  defineProps<{
    collapsible?: boolean
    collection?: CollectionConfig
    currentIndex?: number
    embedded?: boolean
    elevated?: boolean
  }>(),
  {
    collapsible: false,
    currentIndex: -1,
    embedded: false,
    elevated: false,
  },
)
</script>

<template>
  <aside
    v-if="collection"
    class="lgc-collection-aside text-$md-sys-color-on-surface"
    :class="{ 'is-embedded': embedded, 'is-elevated': elevated }"
    grid
    content-start
    sticky
    top="$collection-aside-top"
    max-h="$collection-aside-max-height"
    min-h="0"
    overflow-hidden
    p="$lgc-space-lg"
    rounded="$lgc-radius-large"
    bg="$md-sys-color-surface-container"
  >
    <LgcCollectionNav
      class="lgc-collection-aside-nav"
      :scrollable="!embedded"
      :scroll-max-height="
        embedded ? 'none' : 'var(--collection-aside-content-max-height)'
      "
      :collapsible="collapsible"
      :collection="collection"
      :current-index="currentIndex"
    />
  </aside>
</template>

<style scoped lang="scss">
// Residual: local calc owners for sticky bounds.
.lgc-collection-aside {
  --collection-aside-top: calc(var(--lgc-header-height) + var(--lgc-space-lg));
  --collection-aside-max-height: calc(
    100vh - var(--collection-aside-top) - var(--lgc-space-lg)
  );
  --collection-aside-max-height: calc(
    100dvh - var(--collection-aside-top) - var(--lgc-space-lg)
  );
  --collection-aside-content-max-height: calc(
    var(--collection-aside-max-height) - var(--lgc-space-lg) - var(--lgc-space-lg)
  );
}

.lgc-collection-aside.is-embedded {
  @apply 'static';
  max-height: none;
}

.lgc-collection-aside.is-elevated {
  @apply 'shadow-$lgc-elevation-shadow-level-1';
}
</style>
