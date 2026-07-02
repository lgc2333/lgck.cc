<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { onMounted } from 'vue'

const app = useAppStore()

onMounted(() => {
  app.showLoading = false
})
</script>

<template>
  <ClientOnly>
    <LgcLoading />
  </ClientOnly>
</template>
