<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { normalizeLocaleText } from '../../utils/post'

const props = defineProps<{
  nextPost?: Post
  prevPost?: Post
}>()

const { t, locale } = useI18n()
const prevTitle = computed(() =>
  normalizeLocaleText(props.prevPost?.title, locale.value, t),
)
const nextTitle = computed(() =>
  normalizeLocaleText(props.nextPost?.title, locale.value, t),
)
const prev = computed(() => {
  if (!props.prevPost?.path) return undefined
  return {
    href: props.prevPost.path,
    title: prevTitle.value,
  }
})
const next = computed(() => {
  if (!props.nextPost?.path) return undefined
  return {
    href: props.nextPost.path,
    title: nextTitle.value,
  }
})
</script>

<template>
  <LgcPrevNextNav
    :prev="prev"
    :next="next"
    :label="t('accessibility.post_navigation')"
  />
</template>
