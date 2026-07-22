<script setup lang="ts">
import directSvg from '../public/sponsors/direct.svg?raw'
</script>

<template>
  <div
    class="m-auto h-auto w-full [&>svg]:h-auto [&>svg]:max-w-full"
    v-html="directSvg"
  />
</template>
