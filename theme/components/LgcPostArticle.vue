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
    <LgcPostCoverFrame
      v-if="frontmatter.cover"
      class="lgc-article-cover"
      :src="frontmatter.cover"
      :alt="frontmatter.title || ''"
      variant="article"
    >
      <header class="lgc-article-header lgc-article-header-cover">
        <h1 class="lgc-article-title">
          {{ frontmatter.title }}
        </h1>
        <p v-if="frontmatter.description" class="lgc-article-description">
          {{ frontmatter.description }}
        </p>
        <LgcPostArticleMeta
          :categories="categories"
          :created="frontmatter.date"
          :tags="tags"
          :updated="frontmatter.updated"
        />
      </header>
    </LgcPostCoverFrame>

    <header v-else class="lgc-article-header">
      <h1 class="lgc-article-title">
        {{ frontmatter.title }}
      </h1>
      <p v-if="frontmatter.description" class="lgc-article-description">
        {{ frontmatter.description }}
      </p>
      <LgcPostArticleMeta
        :categories="categories"
        :created="frontmatter.date"
        :tags="tags"
        :updated="frontmatter.updated"
      />
    </header>

    <div class="lgc-article-shell" :class="{ 'has-rail': frontmatter.author }">
      <LgcPostArticleRail :frontmatter="frontmatter" />

      <div class="lgc-article-main">
        <div class="lgc-article-content-card">
          <slot />
        </div>

        <nav
          v-if="nextPost?.path || prevPost?.path"
          class="lgc-article-nav"
          :class="{ 'has-both': nextPost?.path && prevPost?.path }"
          aria-label="Post navigation"
        >
          <RouterLink
            v-if="prevPost?.path"
            class="lgc-article-nav-item lgc-panel-link is-previous"
            :to="prevPost.path"
          >
            <span class="lgc-article-nav-icon" aria-hidden="true">
              <span i-material-symbols-arrow-back-rounded />
            </span>
            <span class="lgc-article-nav-copy">
              <span>Previous</span>
              <strong>{{ prevPost.title }}</strong>
            </span>
          </RouterLink>
          <RouterLink
            v-if="nextPost?.path"
            class="lgc-article-nav-item lgc-panel-link is-next"
            :to="nextPost.path"
          >
            <span class="lgc-article-nav-copy">
              <span>Next</span>
              <strong>{{ nextPost.title }}</strong>
            </span>
            <span class="lgc-article-nav-icon" aria-hidden="true">
              <span i-material-symbols-arrow-forward-rounded />
            </span>
          </RouterLink>
        </nav>
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

.lgc-article-cover {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: var(--lgc-radius-large);
}

.lgc-article-header-cover {
  position: relative;
  z-index: 0;
  align-self: end;
  gap: 1rem;
  margin-top: -3rem;
  padding: 4rem 1.25rem 2rem;
  color: var(--lgc-post-cover-on-mask);
}

.lgc-article-header-cover::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 76%, transparent) 0%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 68%, transparent)
      24%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 50%, transparent)
      46%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 28%, transparent)
      70%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 10%, transparent)
      92%,
    transparent 100%
  );
  content: '';
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

.lgc-article-header-cover .lgc-article-title {
  color: var(--lgc-post-cover-on-mask);
  font-size: clamp(2.75rem, 7vw, 4.25rem);
  line-height: 1.05;
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-description {
  max-width: 680px;
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  line-height: 1.75;
}

.lgc-article-header-cover .lgc-article-description {
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 700;
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-header-cover :deep(.lgc-post-tag) {
  color: color-mix(in srgb, var(--md-sys-color-on-secondary-container) 88%, white);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 78%,
    transparent
  );
  backdrop-filter: blur(12px);
}

.lgc-article-shell {
  display: grid;
  width: 100%;
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

.lgc-article-nav {
  display: grid;
  gap: 0.75rem;
}

.lgc-article-nav-item {
  gap: 0.5rem;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.lgc-article-nav-item.is-next {
  grid-template-columns: minmax(0, 1fr) auto;
  text-align: right;
}

.lgc-article-nav-copy {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.lgc-article-nav-copy span {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lgc-article-nav-copy strong {
  display: -webkit-box;
  overflow-wrap: anywhere;
  overflow: hidden;
  font-size: 0.9375rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
}

.lgc-article-nav-icon {
  display: inline-grid;
  width: var(--lgc-control-size-compact);
  height: var(--lgc-control-size-compact);
  flex: 0 0 auto;
  place-items: center;
  border-radius: var(--lgc-radius-control-active);
  color: var(--md-sys-color-primary);
  font-size: 1.5rem;
  background: var(--md-sys-color-surface-container-highest);
}

@media (min-width: 720px) {
  .lgc-article-header {
    padding-top: 2.5rem;
  }

  .lgc-article-header-cover {
    gap: 1.125rem;
    margin-top: -4rem;
    padding: 5rem 2rem 2.5rem;
  }

  .lgc-article-content-card {
    padding: 2rem;
  }

  .lgc-article-nav.has-both {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 720px) and (max-width: 1280px) {
  .lgc-article-header-cover .lgc-article-title {
    font-size: clamp(2.125rem, 4.5vw, 3rem);
    line-height: 1.08;
  }
}

@media (min-width: 1180px) {
  .lgc-article-shell.has-rail {
    max-width: 1080px;
    grid-template-columns: minmax(14rem, 16rem) minmax(0, 1fr);
    align-items: start;
    gap: 1.5rem;
  }

  .lgc-article-content-card {
    padding: 2.5rem;
  }
}

@media (max-width: 719px) {
  .lgc-article-header-cover {
    margin-top: -2.25rem;
    padding-top: 3rem;
    padding-bottom: 1.5rem;
  }

  .lgc-article-header-cover .lgc-article-title {
    font-size: clamp(1.875rem, 8vw, 2.5rem);
    line-height: 1.12;
  }
}

@media (min-width: 640px) and (max-width: 719px) {
  .lgc-article-header-cover {
    margin-top: -2.75rem;
    padding-top: 3.5rem;
    padding-bottom: 1.75rem;
  }
}
</style>
