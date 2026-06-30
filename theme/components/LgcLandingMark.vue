<script setup lang="ts">
defineProps<{
  avatar?: string
  title: string
}>()
</script>

<template>
  <div class="lgc-mark" :class="{ 'has-image': avatar }" aria-hidden="true">
    <img v-if="avatar" class="lgc-mark__image" :src="avatar" :alt="title">
  </div>
</template>
