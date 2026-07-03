<script setup lang="ts">
import { useFrontmatter, usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { normalizePostListValue } from '../utils/post'

const frontmatter = useFrontmatter()
const route = useRoute()
const posts = usePostList()

const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])

const tags = computed(() => normalizePostListValue(frontmatter.value.tags))
const categories = computed(() => normalizePostListValue(frontmatter.value.categories))
</script>

<template>
  <article class="lgc-article">
    <LgcPostArticleHeader
      :categories="categories"
      :frontmatter="frontmatter"
      :tags="tags"
    />

    <div class="lgc-article-shell">
      <div class="lgc-article-main">
        <div class="lgc-article-content-card">
          <slot />
        </div>

        <LgcPostArticleNav :next-post="nextPost" :prev-post="prevPost" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.lgc-article {
  position: relative;
  isolation: isolate;
  color: var(--md-sys-color-on-surface);
}

.lgc-article-shell {
  display: grid;
  max-width: var(--lgc-container-reading);
  gap: 1rem;
  padding-bottom: 4rem;
  margin-inline: auto;
}

.lgc-article-main {
  display: grid;
  min-width: 0;
  gap: 1rem;
}

.lgc-article-content-card {
  min-width: 0;
  overflow: hidden;
  padding: 1.25rem;
  border-radius: var(--lgc-radius-large);
  background: var(--md-sys-color-surface-container);

  :deep(.lgc-markdown) {
    min-width: 0;
    overflow: hidden;
    padding-bottom: 0;
  }

  :deep(.lgc-markdown > *) {
    max-width: 100%;
  }

  :deep(.markdown-body > :first-child) {
    margin-top: 0;
  }

  :deep(.markdown-body > :last-child) {
    margin-bottom: 0;
  }
}

@media (min-width: 720px) {
  .lgc-article-content-card {
    padding: 2rem;
  }
}

@media (min-width: 1180px) {
  .lgc-article-content-card {
    padding: 2.5rem;
  }
}
</style>
