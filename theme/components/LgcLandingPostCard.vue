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
  if (Array.isArray(raw)) return raw.slice(0, 3).map(String)
  return [String(raw)].filter(Boolean)
})
</script>

<template>
  <RouterLink
    class="lgc-post-card relative grid grid-cols-1 gap-6 overflow-hidden rounded-7 bg-md-surface-container-low p-5 text-md-on-surface no-underline hover:translate-y-[-2px] hover:rounded-[22px] hover:bg-md-surface-container sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:p-6"
    :to="post.path || ''"
  >
    <time
      class="lgc-post-date flex h-20 w-20 flex-col items-center justify-center justify-self-start rounded-7 bg-md-primary-container text-md-on-primary-container sm:h-24 sm:w-24 sm:justify-self-center"
      :datetime="date.datetime"
    >
      <strong class="text-4xl leading-none">{{ date.day }}</strong>
      <span class="mt-1 text-xs font-800 uppercase tracking-[0.08em]">{{
        date.rest
      }}</span>
    </time>

    <div class="min-w-0">
      <h3 class="m-0 text-lgc-title leading-tight">
        {{ post.title }}
      </h3>
      <div
        v-if="post.excerpt"
        class="lgc-post-excerpt mt-3 line-clamp-3 text-sm text-md-on-surface-variant leading-7"
        v-html="post.excerpt"
      />
      <div v-if="tags.length" class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="lgc-chip-tonal h-8 px-3 text-xs font-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <span
      class="hidden h-12 w-12 place-items-center self-center rounded-6 bg-md-surface-container-highest text-2xl text-md-primary sm:inline-grid"
      aria-hidden="true"
    >
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.lgc-post-card {
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-post-date {
  background-image: radial-gradient(
    circle at 76% 24%,
    color-mix(in srgb, var(--md-sys-color-tertiary) 34%, transparent) 0 16px,
    transparent 17px
  );
}

.lgc-post-excerpt :deep(p) {
  @apply m-0;
}
</style>
