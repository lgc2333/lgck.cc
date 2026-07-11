<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const slots = useSlots()
const hasContent = computed(() => Boolean(slots.default))
</script>

<template>
  <section
    v-if="hasContent"
    class="lgc-reading-panel"
    :aria-label="t('accessibility.comments')"
  >
    <ClientOnly>
      <slot />
    </ClientOnly>
  </section>
</template>
