<script lang="ts" setup>
import type { Post } from 'valaxy'

defineProps<{
  post: Post
}>()
</script>

<template>
  <RouterLink class="lgc-article-card" :to="post.path || ''">
    <div class="lgc-article-card-date">
      <LgcPostDate :date="post.date" />
    </div>

    <div class="lgc-article-card-body">
      <h2 class="lgc-article-card-title">
        {{ post.title }}
      </h2>
      <div v-if="post.excerpt" class="lgc-article-card-excerpt" v-html="post.excerpt" />
    </div>

    <span class="lgc-article-card-arrow" aria-hidden="true">
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.lgc-article-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  overflow: hidden;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  background: var(--md-sys-color-surface-container-low);
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover,
  &:focus-visible {
    border-radius: calc(var(--lgc-radius-large) - 0.375rem);
    background: var(--md-sys-color-surface-container);
    transform: translateY(-2px);
  }
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
  width: var(--lgc-control-size);
  height: var(--lgc-control-size);
  place-items: center;
  align-self: center;
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-primary);
  font-size: 1.5rem;
  background: var(--md-sys-color-surface-container-highest);
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
