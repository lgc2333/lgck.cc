<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  normalizeLocaleText,
  normalizePostCategoryPath,
  normalizePostListValue,
  shouldShowPostUpdated,
} from '../utils/post'

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
const category = computed(() => normalizePostCategoryPath(props.frontmatter.categories))
const hasMeta = computed(() =>
  Boolean(
    props.frontmatter.date ||
    shouldShowPostUpdated(props.frontmatter.date, props.frontmatter.updated) ||
    tags.value.length ||
    category.value,
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
    w="full"
    mb="$lgc-space-lg"
    rounded="$lgc-radius-large"
    :src="frontmatter.cover!"
    :alt="title"
    variant="article"
  >
    <header
      class="lgc-article-header-cover"
      relative
      z-0
      self-end
      grid
      justify-items="center"
      gap="$lgc-space-lg md:$lgc-space-xl"
      text-center
    >
      <h1
        v-if="title || icon"
        class="lgc-article-title"
        :class="frontmatter.pageTitleClass"
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
      <p v-if="description" class="lgc-article-description">
        {{ description }}
      </p>
      <div
        v-if="hasMeta"
        flex="~ wrap justify-center"
        gap="$lgc-space-sm"
        leading="[1.4]"
        aria-label="Post metadata"
      >
        <LgcPostMetaChips
          tone="on-cover"
          :category="category"
          :created="frontmatter.date"
          :tags="tags"
          :updated="frontmatter.updated"
        />
      </div>
    </header>
  </LgcPostCoverFrame>

  <header
    v-else-if="hasHeaderContent"
    grid
    justify-items="center"
    gap="$lgc-space-md"
    pt="$lgc-space-2xl md:$lgc-space-4xl"
    pb="$lgc-space-3xl"
    text-center
  >
    <h1
      v-if="title || icon"
      class="lgc-article-title"
      :class="frontmatter.pageTitleClass"
      :style="titleColorStyle"
    >
      <span v-if="icon" shrink-0 text="size-[0.9em]" :class="icon" aria-hidden="true" />
      <span v-if="title">{{ title }}</span>
    </h1>
    <p v-if="description" class="lgc-article-description">
      {{ description }}
    </p>
    <div
      v-if="hasMeta"
      flex="~ wrap justify-center"
      gap="$lgc-space-sm"
      leading="[1.4]"
      aria-label="Post metadata"
    >
      <LgcPostMetaChips
        :category="category"
        :created="frontmatter.date"
        :tags="tags"
        :updated="frontmatter.updated"
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

.lgc-article-title {
  @apply 'inline-flex items-center justify-center gap-$lgc-space-sm';
  @apply 'max-w-$lgc-measure-title m-0 text-$md-sys-color-on-surface';
  @apply 'text-size-$lgc-article-title font-900 tracking-normal leading-[1.15]';
}

.lgc-article-header-cover .lgc-article-title {
  @apply 'text-size-$lgc-article-title-on-cover-compact leading-[1.12]';
  @apply 'md:text-size-$lgc-article-title-on-cover-mid md:leading-[1.08]';
  @apply 'lg:text-size-$lgc-article-title-on-cover lg:leading-[1.05]';
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-article-description {
  @apply 'max-w-$lgc-measure-medium m-0 text-$md-sys-color-on-surface-variant';
  @apply 'text-size-$lgc-body-large leading-[1.75]';
}

.lgc-article-header-cover .lgc-article-description {
  @apply 'font-700';
  color: var(--lgc-post-cover-on-mask-variant);
  text-shadow: var(--lgc-post-cover-text-shadow);
}
</style>
