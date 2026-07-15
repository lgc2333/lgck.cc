<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import {
  resolveCollectionItemHref,
  useCollections,
  useFrontmatter,
  useOutline,
} from 'valaxy'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    collection?: CollectionConfig
    currentIndex?: number
    show?: boolean
  }>(),
  {
    show: undefined,
  },
)

const route = useRoute()
const { t } = useI18n()
const { collections } = useCollections()
const frontmatter = useFrontmatter()
const { headers } = useOutline()
const open = ref(false)

const activeCollection = computed(() => props.collection || findRouteCollection())
const showAction = computed(
  () =>
    props.show ?? Boolean(activeCollection.value?.key || activeCollection.value?.items),
)
const showPostToc = computed(() => {
  return (
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})
const currentIndex = computed(() => {
  if (typeof props.currentIndex === 'number') return props.currentIndex

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
watch(showAction, (shown) => {
  if (!shown) open.value = false
})

function openDrawer() {
  open.value = true
}

function closeDrawer() {
  open.value = false
}

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

function findRouteCollection() {
  const path = stripTrailingSlash(route.path)
  return collections.value.find((item) => {
    if (!item.key) return false

    const collectionPath = stripTrailingSlash(item.path || `/collections/${item.key}/`)
    if (path === collectionPath) return true

    return (item.items || []).some((entry) => {
      const { href, isExternal } = resolveCollectionItemHref(item.key!, entry)
      return !isExternal && stripTrailingSlash(href) === path
    })
  })
}
</script>

<template>
  <LgcFloatingActionButton
    :show="showAction"
    aria-controls="lgc-collection-drawer"
    :aria-expanded="open"
    :label="t('collection.open')"
    mobile-only
    @click="openDrawer"
  >
    <span i-material-symbols-auto-stories-rounded aria-hidden="true" />
  </LgcFloatingActionButton>

  <LgcSideDrawer
    v-if="activeCollection"
    id="lgc-collection-drawer"
    :open="open"
    :title="t('collection.chapters')"
    :label="t('accessibility.collection_navigation')"
    :close-label="t('accessibility.close_collection')"
    @close="closeDrawer"
  >
    <LgcCollectionNav
      :collapsible="showPostToc"
      :collection="activeCollection"
      :current-index="currentIndex"
      :show-header="false"
      @navigate="closeDrawer"
    />
  </LgcSideDrawer>
</template>
