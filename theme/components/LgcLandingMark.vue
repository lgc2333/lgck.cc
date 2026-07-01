<script setup lang="ts">
defineProps<{
  avatar?: string
  title: string
}>()
</script>

<template>
  <img
    v-if="avatar"
    class="mb-4 h-28 w-28 object-cover border-radius-[28px] sm:h-24 sm:w-24"
    :src="avatar"
    :alt="title"
  />
</template>

<style scoped lang="scss"></style>
