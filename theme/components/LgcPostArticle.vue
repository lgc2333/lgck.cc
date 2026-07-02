<script setup lang="ts">
import { useFrontmatter, usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const frontmatter = useFrontmatter()
const route = useRoute()
const posts = usePostList()

const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])

const tags = computed(() => {
  const raw = frontmatter.value.tags || []
  if (Array.isArray(raw)) return raw.map(String)
  return [String(raw)].filter(Boolean)
})

const categories = computed(() => {
  const raw = frontmatter.value.categories || []
  if (Array.isArray(raw)) return raw.map(String)
  return [String(raw)].filter(Boolean)
})
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
      <div
        v-if="tags.length || categories.length || frontmatter.updated"
        class="lgc-article-meta"
        aria-label="Post metadata"
      >
        <span v-for="category in categories" :key="`category-${category}`">
          {{ category }}
        </span>
        <span v-for="tag in tags" :key="`tag-${tag}`">#{{ tag }}</span>
        <span v-if="frontmatter.updated">
          Updated <LgcPostDate :date="frontmatter.updated" />
        </span>
      </div>
    </header>

    <div class="lgc-article-shell">
      <aside
        v-if="frontmatter.author || nextPost || prevPost"
        class="lgc-article-rail"
        aria-label="Article details"
      >
        <LgcPostAuthor v-if="frontmatter.author" :frontmatter="frontmatter" />

        <nav class="lgc-article-nav" aria-label="Post navigation">
          <RouterLink
            v-if="nextPost && nextPost.path"
            class="lgc-article-nav-item"
            :to="nextPost.path"
          >
            <span>Next</span>
            <strong>{{ nextPost.title }}</strong>
          </RouterLink>
          <RouterLink
            v-if="prevPost && prevPost.path"
            class="lgc-article-nav-item"
            :to="prevPost.path"
          >
            <span>Previous</span>
            <strong>{{ prevPost.title }}</strong>
          </RouterLink>
          <RouterLink class="lgc-article-nav-item" to="/">
            <span>Index</span>
            <strong>Back to the blog</strong>
          </RouterLink>
        </nav>
      </aside>

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

.lgc-article-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1.4;

  > span {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    padding-inline: 0.75rem;
    border-radius: 999px;
    background: var(--md-sys-color-secondary-container);
  }

  :deep(.lgc-date) {
    color: inherit;
    font-size: inherit;
  }
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

.lgc-article-rail {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.lgc-article-nav {
  display: grid;
  gap: 0.75rem;
}

.lgc-article-nav-item {
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  background: var(--md-sys-color-surface-container);
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover,
  &:focus-visible {
    border-radius: calc(var(--lgc-radius-large) - 0.375rem);
    background: var(--md-sys-color-surface-container-high);
    transform: translateY(-1px);
  }

  span {
    color: var(--md-sys-color-on-surface-variant);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  strong {
    font-size: 0.9375rem;
    line-height: 1.45;
  }
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

  .lgc-article-rail {
    position: sticky;
    top: 7rem;
  }

  .lgc-article-content-card {
    padding: 2.5rem;
  }
}
</style>
