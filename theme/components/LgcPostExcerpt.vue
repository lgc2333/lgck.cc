<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  excerpt?: string
  excerptType?: string
}>()

const shouldRenderAsTemplate = computed(() => {
  if (!props.excerpt) return false
  if (props.excerptType === 'html') return true

  return /<[A-Z][\w.-]*(?:\s|\/?>)/.test(props.excerpt)
})
</script>

<template>
  <div v-if="excerpt && shouldRenderAsTemplate" class="lgc-post-excerpt">
    <ValaxyDynamicComponent :template-str="excerpt" />
  </div>
  <div v-else-if="excerpt" class="lgc-post-excerpt" v-html="excerpt" />
</template>
