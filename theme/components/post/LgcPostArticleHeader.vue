<script setup lang="ts">
import type { Post } from 'valaxy'
import { usePostCollections, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import {
  isPostMetaLayout,
  normalizeLocaleText,
  shouldShowPostUpdated,
} from '../../utils/post'

const props = defineProps<{
  frontmatter: Post
}>()

const route = useRoute()
const siteConfig = useSiteConfig()
const { t, locale } = useI18n()

const title = computed(() =>
  normalizeLocaleText(props.frontmatter.title, locale.value, t),
)
const description = computed(() =>
  normalizeLocaleText(props.frontmatter.description, locale.value, t),
)
const icon = computed(() => props.frontmatter.icon)
const titleColorStyle = computed(() =>
  props.frontmatter.color ? { color: props.frontmatter.color } : undefined,
)

/** Yun: article meta only on post / collection layouts. */
const showPostMeta = computed(() => isPostMetaLayout(route.meta.layout))
const postPath = computed(() => props.frontmatter.path || route.path)
const postCollections = usePostCollections(postPath)

const hasMeta = computed(() => {
  if (!showPostMeta.value) return false
  const fm = props.frontmatter
  const stats =
    Boolean(siteConfig.value.statistics?.enable) &&
    (Boolean(fm.wordCount) || Boolean(fm.readingTime))
  return Boolean(
    fm.date ||
    shouldShowPostUpdated(fm.date, fm.updated) ||
    fm.categories ||
    postCollections.value.length > 0 ||
    (fm.tags && (Array.isArray(fm.tags) ? fm.tags.length : true)) ||
    stats,
  )
})

const hasHeaderContent = computed(() =>
  Boolean(title.value || description.value || icon.value || hasMeta.value),
)
const hasCover = computed(() => Boolean(props.frontmatter.cover))
</script>

<template>
  <LgcPostCoverFrame
    v-if="hasCover && hasHeaderContent"
    w="full"
    mb="$lgc-space-lg"
    rounded="$lgc-radius-large"
    :src="frontmatter.cover!"
    :alt="title"
    variant="article"
  >
    <header
      class="lgc-article-header-cover"
      justify-items="center"
      gap="$lgc-space-lg md:$lgc-space-xl"
      text-center
      grid
      self-end
      relative
      z-0
    >
      <h1
        v-if="title || icon"
        class="lgc-article-title"
        :class="frontmatter.pageTitleClass"
        gap="$lgc-space-sm"
        max-w="$lgc-measure-title"
        m="0"
        text="$md-sys-color-on-surface size-$lgc-article-title"
        font="900"
        tracking-normal
        inline-flex
        items-center
        justify-center
        leading="[1.15]"
        :style="titleColorStyle"
      >
        <span
          v-if="icon"
          shrink-0
          text="size-[0.9em]"
          :class="icon"
          aria-hidden="true"
        />
        <span v-if="title">{{ title }}</span>
      </h1>
      <p
        v-if="description"
        class="lgc-article-description"
        max-w="$lgc-measure-medium"
        m="0"
        text="$md-sys-color-on-surface-variant size-$lgc-body-large"
        leading="[1.75]"
      >
        {{ description }}
      </p>
      <div v-if="hasMeta" :aria-label="t('accessibility.post_metadata')">
        <LgcPostMetaRow
          align="center"
          tone="on-cover"
          :categories="frontmatter.categories"
          :collections="postCollections"
          :created="frontmatter.date"
          :reading-time="frontmatter.readingTime"
          :tags="frontmatter.tags"
          :updated="frontmatter.updated"
          :word-count="frontmatter.wordCount"
        />
      </div>
    </header>
  </LgcPostCoverFrame>

  <header
    v-else-if="hasHeaderContent"
    justify-items="center"
    gap="$lgc-space-md"
    pt="$lgc-space-2xl lg:$lgc-space-4xl"
    pb="$lgc-space-3xl"
    text-center
    grid
    relative
  >
    <h1
      v-if="title || icon"
      class="lgc-article-title"
      :class="frontmatter.pageTitleClass"
      gap="$lgc-space-sm"
      max-w="$lgc-measure-title"
      m="0"
      text="$md-sys-color-on-surface size-$lgc-article-title"
      font="900"
      tracking-normal
      inline-flex
      items-center
      justify-center
      leading="[1.15]"
      :style="titleColorStyle"
    >
      <span v-if="icon" shrink-0 text="size-[0.9em]" :class="icon" aria-hidden="true" />
      <span v-if="title">{{ title }}</span>
    </h1>
    <p
      v-if="description"
      class="lgc-article-description"
      max-w="$lgc-measure-medium"
      m="0"
      text="$md-sys-color-on-surface-variant size-$lgc-body-large"
      leading="[1.75]"
    >
      {{ description }}
    </p>
    <div v-if="hasMeta" :aria-label="t('accessibility.post_metadata')">
      <LgcPostMetaRow
        align="center"
        :categories="frontmatter.categories"
        :collections="postCollections"
        :created="frontmatter.date"
        :reading-time="frontmatter.readingTime"
        :tags="frontmatter.tags"
        :updated="frontmatter.updated"
        :word-count="frontmatter.wordCount"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
// Residual: cover bleed insets (bare px layout chrome) + gradient scrim + on-mask tokens.
.lgc-article-header-cover {
  --article-cover-pad-block-start: var(--lgc-space-5xl);
  --article-cover-pad-block-end: var(--lgc-space-2xl);
  --article-cover-pad-inline: var(--lgc-space-xl);
  --article-cover-pull: -36px;

  margin-top: var(--article-cover-pull);
  padding: var(--article-cover-pad-block-start) var(--article-cover-pad-inline)
    var(--article-cover-pad-block-end);
  color: var(--lgc-post-cover-on-mask);
}

@screen sm {
  .lgc-article-header-cover {
    --article-cover-pull: -44px;
    --article-cover-pad-block-start: 56px;
    --article-cover-pad-block-end: 28px;
  }
}

@screen md {
  .lgc-article-header-cover {
    --article-cover-pull: -64px;
    --article-cover-pad-block-start: 80px;
    --article-cover-pad-block-end: var(--lgc-space-4xl);
    --article-cover-pad-inline: var(--lgc-space-3xl);
  }
}

.lgc-article-header-cover::before {
  @apply 'absolute -z-1 inset-0';
  content: '';
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
}

// Cover title/description: responsive type + on-mask color/shadow (parent cascade).
.lgc-article-header-cover .lgc-article-title {
  @apply 'text-size-$lgc-article-title-on-cover-compact leading-[1.12]';
  @apply 'md:text-size-$lgc-article-title-on-cover-mid md:leading-[1.08]';
  @apply 'lg:text-size-$lgc-article-title-on-cover lg:leading-[1.05]';
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-header-cover .lgc-article-description {
  @apply 'font-700';
  color: var(--lgc-post-cover-on-mask-variant);
  text-shadow: var(--lgc-post-cover-text-shadow);
}
</style>
