<script setup lang="ts">
defineProps<{
  category?: string
  tags?: string[]
}>()
</script>

<template>
  <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
    <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
    {{ category }}
  </span>
  <span v-for="tag in tags" :key="tag" class="lgc-post-tag lgc-chip-tonal">
    <span i-material-symbols-tag-rounded aria-hidden="true" />
    {{ tag }}
  </span>
</template>

<style scoped lang="scss">
.lgc-post-tag {
  gap: 0.125rem;
  height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
