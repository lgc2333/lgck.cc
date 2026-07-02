<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  post: Post
}>()

const hideTitle = computed(() => {
  if (!props.post.hide) return ''
  return `hide:${props.post.hide === true ? 'all' : props.post.hide}`
})
</script>

<template>
  <div v-if="post.hide" class="lgc-post-status-icons" :title="hideTitle">
    <span
      v-if="post.hide === 'index'"
      class="lgc-post-status-icon"
      i-material-symbols-visibility-off-rounded
      aria-hidden="true"
    />
    <span
      v-else
      class="lgc-post-status-icon"
      i-material-symbols-visibility-rounded
      aria-hidden="true"
    />
    <span class="sr-only">{{ hideTitle }}</span>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-status-icons {
  position: absolute;
  z-index: 1;
  top: 0.875rem;
  left: 0.875rem;
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 999px;
  color: var(--md-sys-color-on-tertiary-container);
  font-size: 1.125rem;
  background: var(--md-sys-color-tertiary-container);
}

.lgc-post-status-icon {
  display: inline-block;
}
</style>
