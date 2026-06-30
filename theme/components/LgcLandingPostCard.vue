<script setup lang="ts">
import type { Post } from 'valaxy'
import { formatDate } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  post: Post
}>()

const date = computed(() => {
  const formatted = formatDate(props.post.date || '')
  const parts = formatted.split('-')
  return {
    day: parts[2] || formatted,
    rest: parts.length >= 2 ? `${parts[0]}.${parts[1]}` : '',
    datetime: formatted,
  }
})

const tags = computed(() => {
  const raw = props.post.tags || props.post.categories || []
  if (Array.isArray(raw))
    return raw.slice(0, 3).map(String)
  return [String(raw)].filter(Boolean)
})
</script>

<template>
  <RouterLink class="lgc-post-card" :to="post.path || ''">
    <time class="lgc-post-date" :datetime="date.datetime">
      <strong>{{ date.day }}</strong>
      <span>{{ date.rest }}</span>
    </time>

    <div class="min-w-0">
      <h3 class="m-0 text-[var(--lgc-title-large)] leading-tight">
        {{ post.title }}
      </h3>
      <div
        v-if="post.excerpt"
        class="lgc-post-excerpt"
        v-html="post.excerpt"
      />
      <div v-if="tags.length" class="mt-3 flex flex-wrap gap-2">
        <span v-for="tag in tags" :key="tag" class="lgc-tag">{{ tag }}</span>
      </div>
    </div>

    <span class="lgc-post-arrow" aria-hidden="true">
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>
