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
  <section
    id="posts"
    class="lgc-post-feed"
    :class="{ 'is-flush': flush }"
    aria-label="Posts"
  >
    <div class="lgc-post-feed-inner">
      <div class="lgc-post-feed-header">
        <div>
          <p class="lgc-post-feed-label">{{ label }}</p>
          <h2 class="lgc-section-title">{{ title }}</h2>
        </div>
      </div>

      <template v-if="posts.length">
        <LgcPostFeedCard v-for="post in posts" :key="post.path" :post="post" />
      </template>
      <p v-else class="lgc-post-feed-empty">还没有公开文章。</p>

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

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-post-feed {
  scroll-margin-top: var(--lgc-space-lg);
}

.lgc-post-feed-inner {
  display: grid;
  width: 100%;
  max-width: var(--lgc-container-reading);
  box-sizing: border-box;
  gap: var(--lgc-space-lg);
  padding: 0 var(--lgc-space-lg) 2rem;
  margin-inline: auto;
}

.lgc-post-feed.is-flush .lgc-post-feed-inner {
  padding-inline: 0;
}

.lgc-post-feed-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--lgc-space-lg);
  margin-bottom: var(--lgc-space-sm);
}

.lgc-post-feed-label {
  margin: 0;
  color: var(--md-sys-color-primary);
  font-size: var(--lgc-body-small);
  font-weight: 800;
}

.lgc-post-feed-empty {
  padding: var(--lgc-space-2xl);
  margin: 0;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container);
}

@include compact-up {
  .lgc-post-feed-inner {
    padding-block: 2.5rem;
    padding-inline: var(--lgc-space-2xl);
  }

  .lgc-post-feed.is-flush .lgc-post-feed-inner {
    padding-inline: 0;
  }
}
</style>
