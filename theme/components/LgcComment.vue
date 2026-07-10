<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()
const hasContent = computed(() => Boolean(slots.default))
</script>

<template>
  <section v-if="hasContent" class="lgc-reading-panel" aria-label="Comments">
    <ClientOnly>
      <slot />
    </ClientOnly>
  </section>
</template>
