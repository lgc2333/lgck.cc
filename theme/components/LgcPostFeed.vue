<script setup lang="ts">
import { useSiteConfig, useSiteStore } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
    // Decorative eyebrow above the title — keep English, do not i18n.
    label: 'Posts',
    limit: 6,
    paginate: false,
  },
)

const { t } = useI18n()
const siteConfig = useSiteConfig()
const siteStore = useSiteStore()
const route = useRoute()

const feedLabel = computed(() => props.label)
const feedTitle = computed(() => props.title || t('post_feed.title'))

const pageSize = computed(() => Math.max(1, siteConfig.value.pageSize || 7))
// Valaxy keeps hide:index in postList; production feed must drop all hide:* (yun).
const sourcePosts = computed(() =>
  import.meta.env.DEV
    ? siteStore.postList
    : siteStore.postList.filter((post) => !post.hide),
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
</script>

<template>
  <section id="posts" scroll-mt="$lgc-space-lg" :aria-label="t('menu.posts')">
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
          <p
            m="0"
            text="$md-sys-color-primary size-$lgc-body-small"
            font="800"
            aria-hidden="true"
          >
            {{ feedLabel }}
          </p>
          <h2 class="text-size-$lgc-headline-large leading-tight font-900 m-0">
            {{ feedTitle }}
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
        {{ t('post_feed.empty') }}
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
