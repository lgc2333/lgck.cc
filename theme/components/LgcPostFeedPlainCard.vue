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
    tags-desktop-only
    :category="category"
    :excerpt="excerpt"
    :excerpt-type="excerptType"
    :path="path"
    :tags="tags"
    :title="title"
  />

  <div
    v-if="category || tags.length"
    class="col-span-full"
    flex="~ wrap"
    gap="$lgc-space-sm"
    sm="hidden"
  >
    <LgcPostMetaChips :category="category" :tags="tags" />
  </div>

  <RouterLink
    class="lgc-post-arrow lgc-card-arrow max-sm:hidden"
    sm="inline-grid"
    :to="path"
    aria-label="Read post"
  >
    <span i-material-symbols-arrow-forward-rounded />
  </RouterLink>
</template>
