<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'

import type { PostDateParts } from '../utils/post'

const props = defineProps<{
  categories?: Post['categories']
  date: PostDateParts
  excerpt?: string
  excerptType?: string
  path: string
  tags: string[]
  title: string
}>()

const hasTaxonomies = computed(() => Boolean(props.categories) || props.tags.length > 0)
</script>

<template>
  <LgcPostDateBadge v-bind="date" />

  <LgcPostFeedCardDetails
    tags-desktop-only
    :categories="categories"
    :excerpt="excerpt"
    :excerpt-type="excerptType"
    :path="path"
    :tags="tags"
    :title="title"
  />

  <div
    v-if="hasTaxonomies"
    class="col-span-full"
    flex="~ wrap"
    gap="$lgc-space-sm"
    sm="hidden"
  >
    <LgcPostMetaChips only-taxonomies :categories="categories" :tags="tags" />
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
