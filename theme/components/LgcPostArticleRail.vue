<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{
  frontmatter: Post
  nextPost?: Post
  prevPost?: Post
}>()
</script>

<template>
  <aside
    v-if="frontmatter.author || nextPost || prevPost"
    class="lgc-article-rail"
    aria-label="Article details"
  >
    <LgcPostAuthor v-if="frontmatter.author" :frontmatter="frontmatter" />

    <nav class="lgc-article-nav" aria-label="Post navigation">
      <RouterLink
        v-if="nextPost?.path"
        class="lgc-article-nav-item lgc-panel-link"
        :to="nextPost.path"
      >
        <span>Next</span>
        <strong>{{ nextPost.title }}</strong>
      </RouterLink>
      <RouterLink
        v-if="prevPost?.path"
        class="lgc-article-nav-item lgc-panel-link"
        :to="prevPost.path"
      >
        <span>Previous</span>
        <strong>{{ prevPost.title }}</strong>
      </RouterLink>
      <RouterLink class="lgc-article-nav-item lgc-panel-link" to="/">
        <span>Index</span>
        <strong>Back to the blog</strong>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.lgc-article-rail {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lgc-article-nav {
  display: grid;
  gap: 0.75rem;
}

.lgc-article-nav-item span {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lgc-article-nav-item strong {
  font-size: 0.9375rem;
  line-height: 1.45;
}

@media (min-width: 1180px) {
  .lgc-article-rail {
    position: sticky;
    top: 7rem;
  }
}
</style>
