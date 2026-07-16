<script setup lang="ts">
import type { Post } from 'valaxy'
import { usePostCollections } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../../../composables'
import type { CoverContentMask, CoverContentPosition } from '../../../types'
import {
  formatPostDateParts,
  normalizeLocaleText,
  normalizePostListValue,
} from '../../../utils/post'

const props = defineProps<{
  post: Post
}>()

const themeConfig = useThemeConfig()
const { t, locale } = useI18n()

const date = computed(() => formatPostDateParts(props.post.date))
const tags = computed(() => normalizePostListValue(props.post.tags))
const title = computed(() => normalizeLocaleText(props.post.title, locale.value, t))
const postPath = computed(() => props.post.path || '')
const postCollections = usePostCollections(postPath)
const postTitleClass = computed(() => props.post.postTitleClass || '')
const postUrl = computed(() => props.post.url || '')
const collection = computed(() => props.post._collection)
const collectionPath = computed(() => {
  const item = collection.value
  if (!item) return postPath.value
  if (item.path) return item.path
  if (item.key) return `/collections/${item.key}/`
  return postPath.value
})
const collectionTitle = computed(() =>
  normalizeLocaleText(collection.value?.title || props.post.title, locale.value, t),
)
const collectionDescription = computed(() =>
  normalizeLocaleText(collection.value?.description || '', locale.value, t),
)
const cover = computed(() => collection.value?.cover || props.post.cover || '')
const cardVariant = computed<'cover' | 'plain'>(() => (cover.value ? 'cover' : 'plain'))
const coverContentMask = computed<CoverContentMask>(() => {
  const mask =
    props.post.coverContentMask ?? themeConfig.value.postFeed?.coverContentMask
  return mask === 'card' ? 'card' : 'gradient'
})
const coverContentPosition = computed<CoverContentPosition>(() => {
  const position =
    props.post.coverContentPosition ?? themeConfig.value.postFeed?.coverContentPosition
  return position === 'right' ? 'right' : 'left'
})
</script>

<template>
  <LgcPostFeedCardFrame
    :cover="cover"
    :mask="coverContentMask"
    :position="coverContentPosition"
    :title="collection ? collectionTitle : title"
    :title-class="collection ? '' : postTitleClass"
    :title-kind="collection ? 'collection' : 'post'"
    :title-to="collection ? collectionPath : postPath"
    :variant="cardVariant"
  >
    <template #status>
      <LgcPostStatusIcons v-if="!collection" :post="post" />
    </template>

    <template #corner>
      <LgcPostFeedBadge
        v-if="collection"
        role="img"
        :aria-label="t('collection.badge')"
      >
        <div i-material-symbols-auto-stories-rounded aria-hidden="true" />
        <template #label>
          {{ t('collection.badge') }}
        </template>
      </LgcPostFeedBadge>
      <LgcPostFeedBadge v-else as="time" :datetime="date.datetime">
        <strong>{{ date.day }}</strong>
        <template #label>
          {{ date.rest }}
        </template>
      </LgcPostFeedBadge>
    </template>

    <template #content>
      <LgcCollectionFeedContent
        v-if="collection"
        :collection="collection"
        :description="collectionDescription"
      />
      <LgcPostFeedCardDetails
        v-else
        :categories="post.categories"
        :collections="postCollections"
        :excerpt="post.excerpt"
        :excerpt-type="post.excerpt_type"
        :tags="tags"
        :tag-tone="cover ? 'on-cover' : 'default'"
      />
    </template>

    <template #action>
      <AppLink
        class="lgc-post-arrow max-sm:hidden"
        place-items="center"
        self-center
        sm="inline-grid"
        :to="collection ? collectionPath : postUrl || postPath"
        :aria-label="collection ? t('collection.open') : t('post.read_more')"
      >
        <span v-if="!collection && postUrl" i-material-symbols-open-in-new-rounded />
        <span v-else i-material-symbols-arrow-forward-rounded />
      </AppLink>
    </template>
  </LgcPostFeedCardFrame>
</template>
