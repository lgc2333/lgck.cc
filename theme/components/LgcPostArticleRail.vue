<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{
  frontmatter: Post
}>()
</script>

<template>
  <aside
    v-if="frontmatter.author"
    class="lgc-article-rail"
    aria-label="Article details"
  >
    <LgcPostAuthor :frontmatter="frontmatter" />
  </aside>
</template>

<style scoped lang="scss">
.lgc-article-rail {
  display: grid;
  gap: 1rem;
  align-content: start;
}

@media (min-width: 1180px) {
  .lgc-article-rail {
    position: sticky;
    top: 7rem;
  }
}
</style>
