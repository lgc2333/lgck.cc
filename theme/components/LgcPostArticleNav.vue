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
    :class="{ 'md:grid-cols-2': nextPost?.path && prevPost?.path }"
    aria-label="Post navigation"
  >
    <RouterLink
      v-if="prevPost?.path"
      class="lgc-article-nav-item lgc-panel-link is-previous"
      grid
      min-w="0"
      items-center
      gap="$lgc-space-sm"
      overflow-hidden
      :to="prevPost.path"
    >
      <span
        class="lgc-article-nav-icon"
        
         flex-none inline-grid 
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        text="$md-sys-color-primary size-$lgc-icon-size"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span i-material-symbols-arrow-back-rounded />
      </span>
      <span class="lgc-article-nav-copy" grid min-w="0" gap="$lgc-space-xs">
        <span
          text="$md-sys-color-on-surface-variant size-$lgc-label-small"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          Previous
        </span>
        <strong class="lgc-article-nav-title">{{ prevPost.title }}</strong>
      </span>
    </RouterLink>
    <RouterLink
      v-if="nextPost?.path"
      class="lgc-article-nav-item lgc-panel-link is-next"
      
      min-w="0"
      
      gap="$lgc-space-sm"
      
       text-right grid items-center overflow-hidden 
      :to="nextPost.path"
    >
      <span class="lgc-article-nav-copy" grid min-w="0" gap="$lgc-space-xs">
        <span
          text="$md-sys-color-on-surface-variant size-$lgc-label-small"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          Next
        </span>
        <strong class="lgc-article-nav-title">{{ nextPost.title }}</strong>
      </span>
      <span
        class="lgc-article-nav-icon"
        
         flex-none inline-grid 
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        text="$md-sys-color-primary size-$lgc-icon-size"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span i-material-symbols-arrow-forward-rounded />
      </span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
// Residual: asymmetric grid tracks (icon | copy vs copy | icon).
.lgc-article-nav-item {
  grid-template-columns: auto minmax(0, 1fr);
}

.lgc-article-nav-item.is-next {
  grid-template-columns: minmax(0, 1fr) auto;
}

// Residual: multi-line clamp needs -webkit-box (line-clamp alone is incomplete here).
.lgc-article-nav-title {
  display: -webkit-box;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  @apply 'overflow-hidden text-size-$lgc-body-medium leading-[1.45] line-clamp-2';
}
</style>
