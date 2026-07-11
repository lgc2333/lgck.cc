<script setup lang="ts">
import { useSiteConfig, useSiteStore } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import {
  buildPaginationPages,
  getPostFeedPagePath,
  parsePageParam,
  slicePageItems,
} from '../utils/pagination'

const props = withDefaults(
  defineProps<{
    flush?: boolean
    label?: string
    limit?: number
    paginate?: boolean
    title?: string
  }>(),
  {
    flush: false,
    label: 'Posts',
    limit: 6,
    paginate: false,
    title: '所有文章',
  },
)

const siteConfig = useSiteConfig()
const siteStore = useSiteStore()
const route = useRoute()

const pageSize = computed(() => Math.max(1, siteConfig.value.pageSize || 7))
const sourcePosts = computed(() => siteStore.postList)
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
</script>

<template>
  <section id="posts" scroll-mt="$lgc-space-lg" aria-label="Posts">
    <div
      grid
      box-border
      w="full"
      max-w="$lgc-container-reading"
      gap="$lgc-space-lg"
      class="mx-auto pb-$lgc-space-3xl sm:py-$lgc-space-4xl"
      :class="flush ? 'px-0' : 'px-$lgc-space-lg sm:px-$lgc-space-2xl'"
    >
      <div flex="~ items-end justify-between" mb="$lgc-space-sm" gap="$lgc-space-lg">
        <div>
          <p m="0" text="$md-sys-color-primary size-$lgc-body-small" font="800">
            {{ label }}
          </p>
          <h2 class="text-size-$lgc-headline-large leading-tight font-900 m-0">
            {{ title }}
          </h2>
        </div>
      </div>

      <template v-if="posts.length">
        <LgcPostFeedCard v-for="post in posts" :key="post.path" :post="post" />
      </template>
      <p
        v-else
        m="0"
        p="$lgc-space-2xl"
        rounded="$lgc-radius-large"
        text="$md-sys-color-on-surface-variant"
        bg="$md-sys-color-surface-container"
      >
        还没有公开文章。
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
    </div>
  </section>
</template>
