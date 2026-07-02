<script setup lang="ts">
import { useSiteConfig, useSiteStore } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
  const page = Number.parseInt(String(route.params.page || '1'))
  return Number.isFinite(page) && page > 0 ? page : 1
})
const totalPages = computed(() => Math.ceil(pagePosts.value.length / pageSize.value))
const surLen = computed(() =>
  curPage.value === 1 || curPage.value === totalPages.value ? 3 : 2,
)
const showPrev = computed(() => curPage.value > 1)
const showNext = computed(() => curPage.value < totalPages.value)
const prevTo = computed(() => getTo(curPage.value - 1))
const nextTo = computed(() => getTo(curPage.value + 1))
const paginationPages = computed(() => {
  const pages: number[] = []
  let ellipsisOpen = false

  for (let page = 1; page <= totalPages.value; page += 1) {
    if (showPage(page)) {
      pages.push(page)
      ellipsisOpen = false
    } else if (!ellipsisOpen) {
      pages.push(-page)
      ellipsisOpen = true
    }
  }

  return pages
})

const posts = computed(() => {
  if (!props.paginate) return pagePosts.value
  return pagePosts.value.slice(
    (curPage.value - 1) * pageSize.value,
    curPage.value * pageSize.value,
  )
})

function showPage(page: number) {
  if (page === 1) return true
  if (page === totalPages.value) return true
  return page > curPage.value - surLen.value && page < curPage.value + surLen.value
}

function getTo(page: number) {
  return `/page/${page}`
}
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
.lgc-post-feed {
  scroll-margin-top: 1rem;
}

.lgc-post-feed-inner {
  display: grid;
  width: 100%;
  max-width: var(--lgc-container-reading);
  box-sizing: border-box;
  gap: 1rem;
  padding: 0 1rem 2rem;
  margin-inline: auto;
}

.lgc-post-feed.is-flush .lgc-post-feed-inner {
  padding-inline: 0;
}

.lgc-post-feed-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.lgc-post-feed-label {
  margin: 0;
  color: var(--md-sys-color-primary);
  font-size: 0.875rem;
  font-weight: 800;
}

.lgc-post-feed-empty {
  padding: 1.5rem;
  margin: 0;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container);
}

@media (min-width: 640px) {
  .lgc-post-feed-inner {
    padding-block: 2.5rem;
    padding-inline: 1.5rem;
  }

  .lgc-post-feed.is-flush .lgc-post-feed-inner {
    padding-inline: 0;
  }
}
</style>
