<script lang="ts" setup>
import type { Post } from 'valaxy'

defineProps<{
  post: Post
}>()
</script>

<template>
  <RouterLink class="lgc-article-card lgc-card-link" :to="post.path || ''">
    <LgcPostStatusIcons :post="post" />

    <div class="lgc-article-card-date">
      <LgcPostDate :date="post.date" />
    </div>

    <div class="lgc-article-card-body">
      <h2 class="lgc-article-card-title">
        {{ post.title }}
      </h2>
      <div v-if="post.excerpt" class="lgc-article-card-excerpt" v-html="post.excerpt" />
    </div>

    <span class="lgc-article-card-arrow lgc-card-arrow" aria-hidden="true">
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.lgc-article-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: 1.25rem;
}

.lgc-article-card-date {
  :deep(.lgc-date) {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    padding-inline: 0.75rem;
    border-radius: 999px;
    color: var(--md-sys-color-on-primary-container);
    font-size: 0.75rem;
    background: var(--md-sys-color-primary-container);
  }
}

.lgc-article-card-body {
  display: grid;
  min-width: 0;
  gap: 0.75rem;
}

.lgc-article-card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: 0;
}

.lgc-article-card-excerpt {
  display: -webkit-box;
  max-width: none;
  overflow: hidden;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9375rem;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.lgc-article-card-excerpt :deep(p) {
  margin: 0;
}

.lgc-article-card-arrow {
  display: none;
}

@media (min-width: 720px) {
  .lgc-article-card {
    grid-template-columns: minmax(7rem, 9rem) minmax(0, 1fr) auto;
    align-items: center;
    padding: 1.5rem;
  }

  .lgc-article-card-arrow {
    display: grid;
  }
}
</style>
