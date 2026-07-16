<script setup lang="ts">
import type { CollectionConfig, Post } from 'valaxy'
import { useCollections, usePostListWithCollections, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import {
  buildPaginationPages,
  getPostFeedPagePath,
  parsePageParam,
  slicePageItems,
} from '../../../utils/pagination'

const props = withDefaults(
  defineProps<{
    collectionKeys?: string[]
    flush?: boolean
    label?: string
    limit?: number
    paginate?: boolean
    source?: 'posts' | 'collections'
    title?: string
  }>(),
  {
    flush: false,
    // Decorative eyebrow above the title — keep English, do not i18n.
    label: 'Posts',
    limit: 6,
    paginate: false,
    source: 'posts',
  },
)

const { t } = useI18n()
const siteConfig = useSiteConfig()
const postListWithCollections = usePostListWithCollections()
const { collections } = useCollections()
const route = useRoute()

const feedLabel = computed(() => props.label)
const feedTitle = computed(() => props.title || t('post_feed.title'))
const emptyText = computed(() =>
  props.source === 'collections' ? t('collection.empty_all') : t('post_feed.empty'),
)

const pageSize = computed(() => Math.max(1, siteConfig.value.pageSize || 7))
const collectionPosts = computed(() => {
  const keys = props.collectionKeys
  const byKey = new Map(
    collections.value.map((collection) => [collection.key, collection]),
  )
  const sourceCollections =
    keys && keys.length
      ? keys
          .map((key) => byKey.get(key))
          .filter((collection): collection is CollectionConfig => Boolean(collection))
      : collections.value

  return sourceCollections.map(collectionToPost)
})
// Valaxy keeps hide:index in postList; production feed must drop all hide:* (yun).
const sourcePosts = computed(() =>
  props.source === 'collections'
    ? collectionPosts.value
    : import.meta.env.DEV
      ? postListWithCollections.value
      : postListWithCollections.value.filter((post) => !post.hide),
)
const pagePosts = computed(() => {
  if (props.paginate) return sourcePosts.value
  if (props.limit <= 0) return sourcePosts.value
  return sourcePosts.value.slice(0, props.limit)
})

const curPage = computed(() => {
  const rawPage = 'page' in route.params ? route.params.page : undefined
  return parsePageParam(rawPage)
})
const totalPages = computed(() => Math.ceil(pagePosts.value.length / pageSize.value))
const showPrev = computed(() => curPage.value > 1)
const showNext = computed(() => curPage.value < totalPages.value)
const prevTo = computed(() => getPostFeedPagePath(curPage.value - 1))
const nextTo = computed(() => getPostFeedPagePath(curPage.value + 1))
const paginationPages = computed(() =>
  buildPaginationPages(curPage.value, totalPages.value),
)

const posts = computed(() => {
  if (!props.paginate) return pagePosts.value
  return slicePageItems(pagePosts.value, curPage.value, pageSize.value)
})

function collectionToPost(collection: CollectionConfig): Post {
  const path =
    collection.path || (collection.key ? `/collections/${collection.key}/` : '')
  return {
    title: collection.title || collection.name || collection.key || path,
    path,
    cover: collection.cover,
    categories: collection.categories,
    tags: collection.tags,
    _collection: collection,
  } as Post
}
</script>

<template>
  <LgcIndexSection
    id="posts"
    :aria-label="
      source === 'collections' ? t('accessibility.collections') : t('menu.posts')
    "
    :flush="flush"
    heading="h2"
    :label="feedLabel"
    :title="feedTitle"
  >
    <template v-if="posts.length">
      <LgcPostFeedCard v-for="post in posts" :key="post.path" :post="post" />
    </template>
    <p
      v-else
      class="text-$md-sys-color-on-surface-variant"
      m="0"
      p="$lgc-space-2xl"
      rounded="$lgc-radius-large"
      bg="$md-sys-color-surface-container"
    >
      {{ emptyText }}
    </p>

    <LgcPostPagination
      v-if="paginate && totalPages > 1"
      :current-page="curPage"
      :next-to="nextTo"
      :pages="paginationPages"
      :prev-to="prevTo"
      :show-next="showNext"
      :show-prev="showPrev"
      :total-pages="totalPages"
    />
  </LgcIndexSection>
</template>
