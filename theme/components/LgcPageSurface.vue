<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'article' | 'div' | 'section'
  }>(),
  {
    as: 'div',
  },
)
</script>

<template>
  <component :is="as" class="lgc-page-surface">
    <slot />
  </component>
</template>
