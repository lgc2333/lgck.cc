<script setup lang="ts">
import LgcCollectionDrawer from '../collection/LgcCollectionDrawer.vue'
</script>

<template>
  <div
    class="lgc-floating-actions"
    z="$lgc-layer-floating"
    right="$lgc-space-lg md:$lgc-space-3xl"
    bottom="$lgc-space-lg md:$lgc-space-3xl"
    flex="~ col"
    items-end
    fixed
    gap="$lgc-space-sm"
  >
    <LgcCollectionDrawer />
    <LgcPostOutlineAction />
    <LgcFixedBgAction />
    <LgcBackToTop />
  </div>
</template>
