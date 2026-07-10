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
    grid
    gap="$lgc-space-md"
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
.lgc-article-nav.has-both {
  @apply 'md:grid-cols-2';
}

.lgc-article-nav-item {
  @apply 'grid min-w-0 items-center gap-$lgc-space-sm overflow-hidden';
  grid-template-columns: auto minmax(0, 1fr);
}

.lgc-article-nav-item.is-next {
  grid-template-columns: minmax(0, 1fr) auto;
  @apply 'text-right';
}

.lgc-article-nav-copy {
  @apply 'grid min-w-0 gap-$lgc-space-xs';
}

.lgc-article-nav-copy span {
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-label-small';
  @apply 'font-900 tracking-[0.04em] uppercase';
}

.lgc-article-nav-copy strong {
  // Residual: multi-line clamp needs -webkit-box.
  display: -webkit-box;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  @apply 'overflow-hidden text-size-$lgc-body-medium leading-[1.45] line-clamp-2';
}

.lgc-article-nav-icon {
  @apply 'inline-grid flex-none place-items-center';
  @apply 'w-$lgc-control-size-compact h-$lgc-control-size-compact';
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary';
  @apply 'text-size-$lgc-icon-size bg-$md-sys-color-surface-container-highest';
}
</style>
