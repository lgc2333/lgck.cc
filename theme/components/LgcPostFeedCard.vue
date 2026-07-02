<script setup lang="ts">
import type { Post } from 'valaxy'
import { formatDate } from 'valaxy'
import { computed } from 'vue'

import { normalizePostListValue } from '../utils/post'

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

const categories = computed(() =>
  normalizePostListValue(props.post.categories).slice(0, 2),
)
const tags = computed(() => {
  return normalizePostListValue(props.post.tags).slice(0, 3)
})
const hasMetaChips = computed(() => categories.value.length || tags.value.length)
</script>

<template>
  <RouterLink class="lgc-post-card lgc-card-link" :to="post.path || ''">
    <LgcPostStatusIcons :post="post" />

    <time class="lgc-post-date" :datetime="date.datetime">
      <strong class="lgc-post-date-day">{{ date.day }}</strong>
      <span class="lgc-post-date-rest">{{ date.rest }}</span>
    </time>

    <div class="lgc-post-body">
      <h3 class="lgc-post-title">
        {{ post.title }}
      </h3>
      <div v-if="post.excerpt" class="lgc-post-excerpt" v-html="post.excerpt" />
      <div v-if="hasMetaChips" class="lgc-post-tags lgc-post-tags-inline">
        <span
          v-for="category in categories"
          :key="`category-${category}`"
          class="lgc-post-tag lgc-chip-tonal"
        >
          <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
          {{ category }}
        </span>
        <span v-for="tag in tags" :key="tag" class="lgc-post-tag lgc-chip-tonal">
          <span i-material-symbols-tag-rounded aria-hidden="true" />
          {{ tag }}
        </span>
      </div>
    </div>

    <div v-if="hasMetaChips" class="lgc-post-tags lgc-post-tags-mobile">
      <span
        v-for="category in categories"
        :key="`mobile-category-${category}`"
        class="lgc-post-tag lgc-chip-tonal"
      >
        <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
        {{ category }}
      </span>
      <span v-for="tag in tags" :key="tag" class="lgc-post-tag lgc-chip-tonal">
        <span i-material-symbols-tag-rounded aria-hidden="true" />
        {{ tag }}
      </span>
    </div>

    <span class="lgc-post-arrow lgc-card-arrow" aria-hidden="true">
      <span i-material-symbols-arrow-forward-rounded />
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.lgc-post-card {
  display: grid;
  grid-template-columns: 5.25rem minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  padding: 1.25rem;
}

.lgc-post-date {
  display: flex;
  width: 5.25rem;
  height: 5.25rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: start;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-primary-container);
  background-color: var(--md-sys-color-primary-container);
}

.lgc-post-date-day {
  font-size: 2rem;
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
  align-self: center;
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
}

.lgc-post-tags-inline {
  display: none;
  margin-top: 0.75rem;
}

.lgc-post-tags-mobile {
  grid-column: 1 / -1;
}

.lgc-post-tag {
  gap: 0.125rem;
  height: 2rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.lgc-post-arrow {
  display: none;
}

@media (min-width: 640px) {
  .lgc-post-card {
    grid-template-columns: 120px minmax(0, 1fr) auto;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-date {
    width: 6rem;
    height: 6rem;
    justify-self: center;
  }

  .lgc-post-tags {
    grid-column: auto;
  }

  .lgc-post-tags-inline {
    display: flex;
  }

  .lgc-post-tags-mobile {
    display: none;
  }

  .lgc-post-arrow {
    grid-column: 3;
    display: inline-grid;
  }
}
</style>
