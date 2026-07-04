<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{
  categories: string[]
  frontmatter: Post
  tags: string[]
}>()
</script>

<template>
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
</template>

<style scoped lang="scss">
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
  // backdrop-filter: blur(12px);
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
}

@media (min-width: 720px) and (max-width: 1280px) {
  .lgc-article-header-cover .lgc-article-title {
    font-size: clamp(2.125rem, 4.5vw, 3rem);
    line-height: 1.08;
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
