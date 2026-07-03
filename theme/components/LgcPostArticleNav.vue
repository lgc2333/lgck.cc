<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{
  nextPost?: Post
  prevPost?: Post
}>()
</script>

<template>
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
</template>

<style scoped lang="scss">
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
  .lgc-article-nav.has-both {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
