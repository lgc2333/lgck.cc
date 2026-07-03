<script setup lang="ts">
import type { Post } from 'valaxy'
import { formatDate } from 'valaxy'
import { computed } from 'vue'

import { useThemeConfig } from '../composables'
import type { CoverContentMask, CoverContentPosition } from '../types'
import { normalizePostCategoryPath, normalizePostListValue } from '../utils/post'

type LgcPost = Post & {
  /**
   * Mask style used by the post feed cover content.
   * @default themeConfig.postFeed.coverContentMask
   */
  coverContentMask?: CoverContentMask

  /**
   * Position of the cover card content on non-narrow screens.
   * @default themeConfig.postFeed.coverContentPosition
   */
  coverContentPosition?: CoverContentPosition
}

const props = defineProps<{
  post: LgcPost
}>()

const themeConfig = useThemeConfig()

const date = computed(() => {
  const formatted = formatDate(props.post.date || '')
  const parts = formatted.split('-')
  return {
    day: parts[2] || formatted,
    rest: parts.length >= 2 ? `${parts[0]}.${parts[1]}` : '',
    datetime: formatted,
  }
})

const category = computed(() => normalizePostCategoryPath(props.post.categories))
const tags = computed(() => {
  return normalizePostListValue(props.post.tags).slice(0, 3)
})
const hasMetaChips = computed(() => Boolean(category.value) || tags.value.length)
const hasCover = computed(() => Boolean(props.post.cover))
const coverContentMask = computed<CoverContentMask>(() => {
  const mask =
    props.post.coverContentMask ?? themeConfig.value.postFeed?.coverContentMask
  return mask === 'gradient' ? 'gradient' : 'card'
})
const coverContentPosition = computed<CoverContentPosition>(() => {
  const position =
    props.post.coverContentPosition ?? themeConfig.value.postFeed?.coverContentPosition
  return position === 'right' ? 'right' : 'left'
})
</script>

<template>
  <RouterLink
    class="lgc-post-card lgc-card-link"
    :class="[
      { 'has-cover': hasCover },
      hasCover ? `cover-mask-${coverContentMask}` : '',
      hasCover ? `cover-content-${coverContentPosition}` : '',
    ]"
    :to="post.path || ''"
  >
    <LgcPostStatusIcons :post="post" />

    <LgcPostCoverFrame
      v-if="post.cover"
      class="lgc-post-cover-card"
      :src="post.cover"
      :alt="post.title || ''"
      variant="feed"
    >
      <div class="lgc-post-cover-layout">
        <time class="lgc-post-date lgc-post-date-cover" :datetime="date.datetime">
          <strong class="lgc-post-date-day">{{ date.day }}</strong>
          <span class="lgc-post-date-rest">{{ date.rest }}</span>
        </time>

        <div class="lgc-post-body lgc-post-body-cover">
          <h3 class="lgc-post-title">
            {{ post.title }}
          </h3>
          <div v-if="post.excerpt" class="lgc-post-excerpt" v-html="post.excerpt" />
          <div v-if="hasMetaChips" class="lgc-post-tags">
            <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
              <span i-material-symbols-folder-outline-rounded aria-hidden="true" />
              {{ category }}
            </span>
            <span
              v-for="tag in tags"
              :key="`cover-tag-${tag}`"
              class="lgc-post-tag lgc-chip-tonal"
            >
              <span i-material-symbols-tag-rounded aria-hidden="true" />
              {{ tag }}
            </span>
          </div>
        </div>

        <span class="lgc-post-arrow lgc-card-arrow" aria-hidden="true">
          <span i-material-symbols-arrow-forward-rounded />
        </span>
      </div>
    </LgcPostCoverFrame>

    <template v-else>
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
          <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
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
        <span v-if="category" class="lgc-post-tag lgc-chip-tonal">
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
    </template>
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

.lgc-post-card.has-cover {
  display: block;
  padding: 0;
  color: var(--lgc-post-cover-on-mask);
  background: var(--md-sys-color-surface-container);
}

.lgc-post-cover-card {
  border-radius: inherit;
}

.lgc-post-cover-layout {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100%;
  grid-template-rows: auto minmax(min-content, 1fr);
  grid-template-columns: minmax(0, 1fr);
  align-content: space-between;
  align-items: stretch;
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

.lgc-post-date-cover {
  position: relative;
  z-index: 1;
  grid-row: 1;
  grid-column: 1;
  align-self: start;
  justify-self: start;
  color: var(--md-sys-color-on-primary-container);
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 50%,
    transparent
  );
  backdrop-filter: blur(8px);
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

.lgc-post-body-cover {
  position: relative;
  z-index: 1;
  grid-row: 2;
  grid-column: 1;
  align-self: end;
  justify-self: start;
  width: fit-content;
  max-width: min(42rem, calc(100% - var(--lgc-control-size) - 1rem));
  margin-block-end: -1.25rem;
  margin-inline-start: -1.25rem;
  padding: 1.25rem;
  border-top-left-radius: var(--lgc-radius-large);
  border-top-right-radius: calc(var(--lgc-radius-large) * 2.5);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: calc(var(--lgc-radius-large) * 0.5);
  color: var(--md-sys-color-on-surface);
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
}

.lgc-post-card.has-cover.cover-mask-gradient .lgc-post-body-cover {
  --lgc-post-cover-gradient-padding-block-end: 1.25rem;
  z-index: 0;
  justify-self: stretch;
  width: calc(100% + 2.5rem);
  max-width: none;
  margin-block-end: -1.25rem;
  margin-inline: -1.25rem;
  padding-block-start: var(--lgc-post-cover-gradient-padding-block-end);
  padding-block-end: var(--lgc-post-cover-gradient-padding-block-end);
  padding-inline-start: 1.25rem;
  padding-inline-end: calc(var(--lgc-control-size) + 1rem);
  border-radius: 0;
  color: var(--lgc-post-cover-on-mask);
  background: transparent;
}

.lgc-post-card.has-cover.cover-mask-gradient .lgc-post-body-cover::before {
  --lgc-post-cover-gradient-color: var(--md-sys-color-surface-container-lowest);

  position: absolute;
  z-index: -1;
  inset-block-start: calc(var(--lgc-post-cover-gradient-padding-block-end) * -2);
  inset-inline: 0;
  inset-block-end: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 76%, transparent) 0%,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 46%, transparent) 52%,
    transparent 100%
  );
  content: '';
}

.lgc-post-card.has-cover .lgc-post-title {
  max-width: 44rem;
  color: var(--md-sys-color-on-surface);
  text-align: left;
}

.lgc-post-card.has-cover.cover-mask-gradient .lgc-post-title {
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-post-excerpt {
  // display: -webkit-box;
  margin-top: 0.75rem;
  overflow: hidden;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.75;
  // -webkit-box-orient: vertical;
  // line-clamp: 3;
  // -webkit-line-clamp: 3;
}

.lgc-post-card.has-cover .lgc-post-excerpt {
  max-width: 42rem;
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 600;
  text-align: left;
}

.lgc-post-card.has-cover.cover-mask-gradient .lgc-post-excerpt {
  text-shadow: 0 0.0625rem 0.25rem
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
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

.lgc-post-body-cover .lgc-post-tags {
  margin-top: 0.625rem;
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

.lgc-post-card.has-cover .lgc-post-arrow {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  align-self: center;
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 50%,
    transparent
  );
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
}

@media (min-width: 640px) {
  .lgc-post-card {
    grid-template-columns: 120px minmax(0, 1fr) auto;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-card.has-cover {
    padding: 0;
  }

  .lgc-post-cover-layout {
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-body-cover {
    margin-block-end: -1.5rem;
    margin-inline-start: -1.5rem;
    padding: 1.5rem;
  }

  .lgc-post-card.has-cover .lgc-post-arrow {
    right: 1.5rem;
  }

  .lgc-post-card.has-cover.cover-content-right .lgc-post-body-cover {
    display: grid;
    justify-self: end;
    justify-items: end;
    margin-inline-start: 0;
    margin-inline-end: -1.5rem;
    border-top-left-radius: calc(var(--lgc-radius-large) * 2.5);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: calc(var(--lgc-radius-large) * 0.5);
    border-bottom-right-radius: 0;
  }

  .lgc-post-card.has-cover.cover-content-right .lgc-post-title,
  .lgc-post-card.has-cover.cover-content-right .lgc-post-excerpt {
    text-align: right;
  }

  .lgc-post-card.has-cover.cover-content-right .lgc-post-tags {
    justify-content: flex-end;
  }

  .lgc-post-card.has-cover.cover-content-right .lgc-post-arrow {
    top: 1.5rem;
    transform: none;
  }

  .lgc-post-card.has-cover.cover-mask-gradient .lgc-post-body-cover {
    --lgc-post-cover-gradient-padding-block-end: 1.5rem;
    width: calc(100% + 3rem);
    margin-block-end: -1.5rem;
    margin-inline: -1.5rem;
    padding-inline-start: 1.5rem;
  }

  .lgc-post-card.has-cover.cover-mask-gradient.cover-content-right
    .lgc-post-body-cover {
    justify-self: stretch;
    justify-items: end;
    margin-inline: -1.5rem;
    padding-inline-start: 1.5rem;
    padding-inline-end: 1.5rem;
    border-radius: 0;
  }

  .lgc-post-date {
    width: 6rem;
    height: 6rem;
    justify-self: start;
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
    display: inline-grid;
  }
}

@media (max-width: 639px) {
  .lgc-post-card.has-cover .lgc-post-arrow {
    display: none;
  }

  .lgc-post-body-cover {
    grid-column: 1 / -1;
    justify-self: stretch;
    width: auto;
    max-width: none;
    margin-block-end: -1.25rem;
    margin-inline: -1.25rem;
    border-top-left-radius: var(--lgc-radius-large);
    border-top-right-radius: var(--lgc-radius-large);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .lgc-post-card.has-cover.cover-mask-gradient .lgc-post-body-cover {
    width: calc(100% + 2.5rem);
    padding-inline: 1.25rem;
  }
}

@media (min-width: 640px) and (max-width: 719px) {
  .lgc-post-cover-layout {
    align-items: stretch;
  }
}
</style>
