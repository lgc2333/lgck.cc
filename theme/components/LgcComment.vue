<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()
const hasContent = computed(() => Boolean(slots.default))
</script>

<template>
  <section v-if="hasContent" class="lgc-comment" aria-label="Comments">
    <ClientOnly>
      <slot />
    </ClientOnly>
  </section>
</template>

<style scoped lang="scss">
.lgc-comment {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 1.25rem;
  border-radius: var(--lgc-radius-large);
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}

@media (min-width: 720px) {
  .lgc-comment {
    padding: 2rem;
  }
}

@media (min-width: 1180px) {
  .lgc-comment {
    padding: 2.5rem;
  }
}
</style>
