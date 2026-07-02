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
    <header class="lgc-article-header">
      <LgcPostDate :date="frontmatter.date" />
      <h1 class="lgc-article-title">
        {{ frontmatter.title }}
      </h1>
      <p v-if="frontmatter.description" class="lgc-article-description">
        {{ frontmatter.description }}
      </p>
      <LgcPostArticleMeta
        :categories="categories"
        :tags="tags"
        :updated="frontmatter.updated"
      />
    </header>

    <div class="lgc-article-shell">
      <LgcPostArticleRail
        :frontmatter="frontmatter"
        :next-post="nextPost"
        :prev-post="prevPost"
      />

      <div class="lgc-article-content-card">
        <slot />
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

.lgc-article-header {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0 2rem;
  text-align: center;
}

.lgc-article-title {
  max-width: 820px;
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: 0;
}

.lgc-article-description {
  max-width: 680px;
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  line-height: 1.75;
}

.lgc-article-shell {
  display: grid;
  gap: 1rem;
  padding-bottom: 4rem;
}

.lgc-article-content-card {
  min-width: 0;
  padding: 1.25rem;
  border-radius: var(--lgc-radius-large);
  background: var(--md-sys-color-surface-container);
}

@media (min-width: 720px) {
  .lgc-article-header {
    padding-top: 4rem;
  }

  .lgc-article-content-card {
    padding: 2rem;
  }
}

@media (min-width: 1180px) {
  .lgc-article-shell {
    grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem;
  }

  .lgc-article-content-card {
    padding: 2.5rem;
  }
}
</style>
