<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { normalizeLocaleText, normalizePostListValue } from '../utils/post'

const props = defineProps<{
  frontmatter: Post
}>()

const { locale } = useI18n()
const title = computed(() => normalizeLocaleText(props.frontmatter.title, locale.value))
const description = computed(() =>
  normalizeLocaleText(props.frontmatter.description, locale.value),
)
const icon = computed(() => props.frontmatter.icon)
const titleColorStyle = computed(() =>
  props.frontmatter.color ? { color: props.frontmatter.color } : undefined,
)
const tags = computed(() => normalizePostListValue(props.frontmatter.tags))
const categories = computed(() => normalizePostListValue(props.frontmatter.categories))
const hasMeta = computed(() =>
  Boolean(
    props.frontmatter.date ||
    props.frontmatter.updated ||
    tags.value.length ||
    categories.value.length,
  ),
)
const hasHeaderContent = computed(() =>
  Boolean(title.value || description.value || icon.value || hasMeta.value),
)
const hasCover = computed(() => Boolean(props.frontmatter.cover))
</script>

<template>
  <LgcPostCoverFrame
    v-if="hasCover && hasHeaderContent"
    class="lgc-article-cover"
    :src="frontmatter.cover!"
    :alt="title"
    variant="article"
  >
    <header class="lgc-article-header lgc-article-header-cover">
      <h1
        v-if="title || icon"
        class="lgc-article-title"
        :class="frontmatter.pageTitleClass"
        :style="titleColorStyle"
      >
        <span
          v-if="icon"
          class="lgc-article-title-icon"
          :class="icon"
          aria-hidden="true"
        />
        <span v-if="title">{{ title }}</span>
      </h1>
      <p v-if="description" class="lgc-article-description">
        {{ description }}
      </p>
      <LgcPostArticleMeta
        v-if="hasMeta"
        :categories="categories"
        :created="frontmatter.date"
        :tags="tags"
        :updated="frontmatter.updated"
      />
    </header>
  </LgcPostCoverFrame>

  <header v-else-if="hasHeaderContent" class="lgc-article-header">
    <h1
      v-if="title || icon"
      class="lgc-article-title"
      :class="frontmatter.pageTitleClass"
      :style="titleColorStyle"
    >
      <span
        v-if="icon"
        class="lgc-article-title-icon"
        :class="icon"
        aria-hidden="true"
      />
      <span v-if="title">{{ title }}</span>
    </h1>
    <p v-if="description" class="lgc-article-description">
      {{ description }}
    </p>
    <LgcPostArticleMeta
      v-if="hasMeta"
      :categories="categories"
      :created="frontmatter.date"
      :tags="tags"
      :updated="frontmatter.updated"
    />
  </header>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-article-header {
  display: grid;
  justify-items: center;
  gap: var(--lgc-space-md);
  padding: var(--lgc-space-2xl) 0 2rem;
  text-align: center;
}

.lgc-article-cover {
  width: 100%;
  margin-bottom: var(--lgc-space-lg);
  border-radius: var(--lgc-radius-large);
}

.lgc-article-header-cover {
  position: relative;
  z-index: 0;
  align-self: end;
  gap: var(--lgc-space-lg);
  margin-top: -3rem;
  padding: 4rem var(--lgc-space-xl) 2rem;
  color: var(--lgc-post-cover-on-mask);
}

.lgc-article-header-cover::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 76%, transparent) 0%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 68%, transparent)
      24%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 50%, transparent)
      46%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 28%, transparent)
      70%,
    color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 10%, transparent)
      92%,
    transparent 100%
  );
  content: '';
}

.lgc-article-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--lgc-space-sm);
  max-width: var(--lgc-measure-title);
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: 0;
}

.lgc-article-title-icon {
  flex: 0 0 auto;
  font-size: 0.9em;
}

.lgc-article-header-cover .lgc-article-title {
  color: var(--lgc-post-cover-on-mask);
  font-size: clamp(2.75rem, 7vw, 4.25rem);
  line-height: 1.05;
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-description {
  max-width: var(--lgc-measure-medium);
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--lgc-body-large);
  line-height: 1.75;
}

.lgc-article-header-cover .lgc-article-description {
  color: var(--lgc-post-cover-on-mask-variant);
  font-weight: 700;
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-header-cover :deep(.lgc-post-tag) {
  color: color-mix(in srgb, var(--md-sys-color-on-secondary-container) 88%, white);
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 78%,
    transparent
  );
}

@include nav-up {
  .lgc-article-header {
    padding-top: 2.5rem;
  }

  .lgc-article-header-cover {
    gap: 1.125rem;
    margin-top: -4rem;
    padding: 5rem 2rem 2.5rem;
  }
}

@include between-nav-wide {
  .lgc-article-header-cover .lgc-article-title {
    font-size: clamp(2.125rem, 4.5vw, 3rem);
    line-height: 1.08;
  }
}

@include nav-down {
  .lgc-article-header-cover {
    margin-top: -2.25rem;
    padding-top: 3rem;
    padding-bottom: var(--lgc-space-2xl);
  }

  .lgc-article-header-cover .lgc-article-title {
    font-size: clamp(1.875rem, 8vw, 2.5rem);
    line-height: 1.12;
  }
}

@include between-compact-nav {
  .lgc-article-header-cover {
    margin-top: -2.75rem;
    padding-top: 3.5rem;
    padding-bottom: 1.75rem;
  }
}
</style>
