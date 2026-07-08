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
@use '../styles/helpers' as *;

.lgc-comment {
  @include reading-panel;
}
</style>
