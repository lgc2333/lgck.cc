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
  <RouterLink class="lgc-post-card" :to="post.path || ''">
    <time class="lgc-post-date" :datetime="date.datetime">
      <strong class="lgc-post-date-day">{{ date.day }}</strong>
      <span class="lgc-post-date-rest">{{ date.rest }}</span>
    </time>

    <div class="lgc-post-body">
      <h3 class="lgc-post-title">
        {{ post.title }}
      </h3>
      <div v-if="post.excerpt" class="lgc-post-excerpt" v-html="post.excerpt" />
      <div v-if="tags.length" class="lgc-post-tags">
        <span v-for="tag in tags" :key="tag" class="lgc-post-tag lgc-chip-tonal">
          {{ tag }}
        </span>
      </div>
    </div>

    <span class="lgc-post-arrow" aria-hidden="true">
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.lgc-post-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.25rem;
  overflow: hidden;
  border-radius: 1.75rem;
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  background: var(--md-sys-color-surface-container-low);
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover {
    border-radius: 22px;
    background: var(--md-sys-color-surface-container);
    transform: translateY(-2px);
  }
}

.lgc-post-date {
  display: flex;
  width: 5rem;
  height: 5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: start;
  border-radius: 1.75rem;
  color: var(--md-sys-color-on-primary-container);
  background-color: var(--md-sys-color-primary-container);
}

.lgc-post-date-day {
  font-size: 2.25rem;
  line-height: 1;
}

.lgc-post-date-rest {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lgc-post-body {
  min-width: 0;
}

.lgc-post-excerpt {
  display: -webkit-box;
  margin-top: 0.75rem;
  overflow: hidden;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.lgc-post-excerpt :deep(p) {
  margin: 0;
}

.lgc-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.lgc-post-tag {
  height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.lgc-post-arrow {
  display: none;
  width: 3rem;
  height: 3rem;
  align-self: center;
  place-items: center;
  border-radius: 1.5rem;
  color: var(--md-sys-color-primary);
  font-size: 1.5rem;
  background: var(--md-sys-color-surface-container-highest);
}

@media (min-width: 640px) {
  .lgc-post-card {
    grid-template-columns: 120px minmax(0, 1fr) auto;
    padding: 1.5rem;
  }

  .lgc-post-date {
    width: 6rem;
    height: 6rem;
    justify-self: center;
  }

  .lgc-post-arrow {
    display: inline-grid;
  }
}
</style>
