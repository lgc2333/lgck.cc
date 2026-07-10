<script setup lang="ts">
import type { PostDateParts } from '../utils/post'

defineProps<{
  category?: string
  date: PostDateParts
  excerpt?: string
  excerptType?: string
  path: string
  tags: string[]
  title: string
}>()
</script>

<template>
  <LgcPostDateBadge v-bind="date" />

  <LgcPostFeedCardDetails
    class="lgc-post-body-plain"
    :category="category"
    :excerpt="excerpt"
    :excerpt-type="excerptType"
    :path="path"
    :tags="tags"
    :title="title"
  />

  <div v-if="category || tags.length" class="lgc-post-tags-mobile">
    <LgcPostMetaChips :category="category" :tags="tags" />
  </div>

  <RouterLink class="lgc-post-arrow lgc-card-arrow" :to="path" aria-label="Read post">
    <span i-material-symbols-arrow-forward-rounded />
  </RouterLink>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-post-body-plain :deep(.lgc-post-tags) {
  display: none;
}

.lgc-post-tags-mobile {
  display: flex;
  grid-column: 1 / -1;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lgc-post-arrow {
  display: none;
}

@include compact-up {
  .lgc-post-body-plain :deep(.lgc-post-tags) {
    display: flex;
  }

  .lgc-post-tags-mobile {
    display: none;
  }

  .lgc-post-arrow {
    display: inline-grid;
  }
}
</style>
