<script setup lang="ts">
import type { Post } from 'valaxy'
import { dayjs } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  frontmatter: Post
}>()

const { t, locale } = useI18n()

const updated = computed(() => {
  const value = props.frontmatter.updated || props.frontmatter.date
  if (!value) return null

  const date = dayjs(value).locale(locale.value)
  return date.isValid() ? date : null
})

const ago = computed(() => updated.value?.fromNow() || '')

const showTimeWarning = computed(() => {
  if (!updated.value) return false

  const warning = props.frontmatter.time_warning
  if (typeof warning === 'number')
    return dayjs().valueOf() - updated.value.valueOf() > warning

  return Boolean(warning)
})
</script>

<template>
  <blockquote v-if="showTimeWarning">
    <p>
      {{ t('post.time_warning', { ago }) }}
    </p>
  </blockquote>
</template>
