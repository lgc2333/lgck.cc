<script setup lang="ts">
import {
  useCollection,
  useFrontmatter,
  useOutline,
  usePostCollections,
  usePostList,
} from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useCollectionPrevNextItems, usePostPrevNextItems } from '../composables'

const props = withDefaults(
  defineProps<{
    collection?: boolean
  }>(),
  {
    collection: false,
  },
)

const route = useRoute()
const { t } = useI18n()
const frontmatter = useFrontmatter()
const posts = usePostList()
const { collection: routeCollection } = useCollection()
const { headers } = useOutline()

const showArticleNav = computed(() => frontmatter.value.nav !== false)
const showPostToc = computed(() => {
  return (
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})
const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])
const { next: postNext, prev: postPrev } = usePostPrevNextItems(prevPost, nextPost)
const routePath = computed(() => route.path)
const postCollections = usePostCollections(routePath)
const routeCollectionInfo = computed(() => {
  const collectionKey = routeCollection.value?.key
  if (collectionKey) {
    return postCollections.value.find((item) => item.collection.key === collectionKey)
  }

  return postCollections.value[0]
})
const activeCollection = computed(() => {
  if (props.collection) return routeCollection.value
  return routeCollectionInfo.value?.collection
})
const hasCollectionContext = computed(() => Boolean(activeCollection.value))
const currentCollectionItemIndex = computed(() => {
  if (routeCollectionInfo.value) return routeCollectionInfo.value.itemIndex

  const items = activeCollection.value?.items
  if (!items?.length) return -1

  const path = stripTrailingSlash(route.path)
  const slug = path.split('/').pop()
  return items.findIndex((item) => {
    if (item.key && item.key === slug) return true
    if (item.link && !/^https?:\/\//.test(item.link))
      return stripTrailingSlash(item.link) === path
    return false
  })
})
const { next: collectionNext, prev: collectionPrev } = useCollectionPrevNextItems(
  activeCollection,
  currentCollectionItemIndex,
)

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}
</script>

<template>
  <LgcSiteShell>
    <LgcPageSurface>
      <RouterView v-slot="{ Component }">
        <component :is="Component">
          <template #main-header-after>
            <LgcCollectionHintCard
              v-if="hasCollectionContext"
              :collection="activeCollection"
            />
          </template>

          <template #main-content-after>
            <LgcPostContentAfter />
          </template>

          <template #main-nav>
            <LgcPrevNextNav
              v-if="
                hasCollectionContext &&
                showArticleNav &&
                currentCollectionItemIndex >= 0
              "
              :next="collectionNext"
              :prev="collectionPrev"
              :label="t('accessibility.collection.navigation')"
            />
            <LgcPrevNextNav
              v-else-if="showArticleNav"
              :next="postNext"
              :prev="postPrev"
              :label="t('accessibility.post.navigation')"
            />
          </template>

          <template #aside>
            <template v-if="hasCollectionContext">
              <div
                class="lgc-post-aside lgc-post-aside-stack hidden! lg:grid! xl:hidden!"
                :class="{ 'has-post-toc': showPostToc }"
                sticky
                top="$post-aside-stack-top"
                max-h="$post-aside-stack-max-height"
                gap="$lgc-space-lg"
                overflow-hidden
              >
                <LgcCollectionAside
                  embedded
                  :collapsible="showPostToc"
                  :collection="activeCollection"
                  :current-index="currentCollectionItemIndex"
                />
                <LgcPostAside v-if="showPostToc" embedded />
              </div>

              <LgcCollectionAside
                class="lgc-post-aside lgc-collection-post-aside hidden! xl:block!"
                :collection="activeCollection"
                :current-index="currentCollectionItemIndex"
              />
              <LgcPostAside
                v-if="showPostToc"
                class="lgc-post-aside lgc-post-toc-aside hidden! xl:block!"
              />
            </template>

            <LgcPostAside v-else class="lgc-post-aside lgc-post-toc-aside" />
          </template>
        </component>
      </RouterView>
    </LgcPageSurface>
  </LgcSiteShell>
</template>
