<script setup lang="ts">
import type { Post } from 'valaxy'
import { usePostList } from 'valaxy'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: string
    posts?: Post[]
    curPage?: number
  }>(),
  {
    curPage: 1,
  },
)

const routes = usePostList({ type: props.type || '' })
const posts = computed(() => props.posts || routes.value)
</script>

<template>
  <section class="lgc-post-list" aria-label="Posts">
    <div v-if="posts.length" class="lgc-post-list-grid">
      <LgcPostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
    <p v-else class="lgc-post-list-empty">还没有公开文章。</p>
  </section>
</template>

<style scoped lang="scss">
.lgc-post-list {
  padding-block: 1rem 4rem;
}

.lgc-post-list-grid {
  display: grid;
  gap: 1rem;
}

.lgc-post-list-empty {
  padding: 1.5rem;
  margin: 0;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container);
}
</style>
