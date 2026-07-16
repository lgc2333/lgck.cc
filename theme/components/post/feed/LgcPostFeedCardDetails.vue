<script setup lang="ts">
import type { Post, PostCollectionInfo } from 'valaxy'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    collections?: PostCollectionInfo[]
    excerpt?: string
    excerptType?: string
    path: string
    tags: string[]
    title: string
    titleClass?: string
    /** Hide tag row below sm (plain card shows a separate mobile chips row). */
    tagsDesktopOnly?: boolean
    part?: 'all' | 'title' | 'body'
    /** Cover-card surface: title/excerpt layout owned here, not via parent :deep. */
    surface?: 'default' | 'cover'
    coverMask?: 'gradient' | 'card'
    coverAlign?: 'left' | 'right'
  }>(),
  {
    tagsDesktopOnly: false,
    part: 'all',
    surface: 'default',
    coverMask: 'gradient',
    coverAlign: 'left',
  },
)

const shouldRenderAsTemplate = computed(() => {
  if (!props.excerpt) return false
  if (props.excerptType === 'html') return true

  return /<[A-Z][\w.-]*(?:\s|\/?>)/.test(props.excerpt)
})

const rootClass = computed(() => {
  if (props.surface !== 'cover') return 'is-default'
  return ['is-cover', `is-mask-${props.coverMask}`, `is-align-${props.coverAlign}`]
})

const titleClass = computed(() => {
  return props.surface === 'cover' ? 'is-cover-title' : 'is-default-title'
})

// `markdown-body` unlocks css-i18n for `div[lang]`; type/rhythm reset lives in
// `styles/markdown.scss` (`.markdown-body.lgc-post-excerpt`).
const excerptClass = computed(() => {
  return props.surface === 'cover' ? 'is-cover-excerpt' : 'is-default-excerpt'
})

const tagsClass = computed(() => [props.tagsDesktopOnly ? 'is-desktop-only' : ''])

const hasTaxonomies = computed(
  () =>
    Boolean(props.categories) ||
    props.tags.length > 0 ||
    Boolean(props.collections?.length),
)
</script>

<template>
  <h3 v-if="part === 'title'" class="lgc-post-title font-900 max-sm:self-center">
    <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children -->
    <RouterLink
      class="lgc-post-title-link text-inherit no-underline focus-visible:text-$md-sys-color-primary hover:text-$md-sys-color-primary"
      :class="props.titleClass"
      :to="path"
    >
      {{ title }}
    </RouterLink>
  </h3>

  <div v-else-if="part === 'body'" min-w="0">
    <div
      v-if="excerpt && shouldRenderAsTemplate"
      class="lgc-post-excerpt markdown-body overflow-hidden"
    >
      <ValaxyDynamicComponent :template-str="excerpt" />
    </div>
    <div
      v-else-if="excerpt"
      class="lgc-post-excerpt markdown-body overflow-hidden"
      v-html="excerpt"
    />
    <div
      v-if="hasTaxonomies"
      class="lgc-post-tags"
      :class="tagsClass"
      flex="~ wrap"
      gap="$lgc-space-sm"
    >
      <LgcTaxonomyChips
        :categories="categories"
        :collections="collections"
        :tags="tags"
      />
    </div>
  </div>

  <div v-else class="lgc-post-card-details" min-w="0" self-center :class="rootClass">
    <h3 class="lgc-post-title font-900" :class="titleClass">
      <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children -->
      <RouterLink
        class="lgc-post-title-link text-inherit no-underline focus-visible:text-$md-sys-color-primary hover:text-$md-sys-color-primary"
        :class="props.titleClass"
        :to="path"
      >
        {{ title }}
      </RouterLink>
    </h3>
    <div
      v-if="excerpt && shouldRenderAsTemplate"
      class="lgc-post-excerpt markdown-body"
      :class="excerptClass"
    >
      <ValaxyDynamicComponent :template-str="excerpt" />
    </div>
    <div
      v-else-if="excerpt"
      class="lgc-post-excerpt markdown-body"
      :class="excerptClass"
      v-html="excerpt"
    />
    <div
      v-if="hasTaxonomies"
      class="lgc-post-tags"
      :class="tagsClass"
      flex="~ wrap"
      gap="$lgc-space-sm"
    >
      <LgcTaxonomyChips
        :categories="categories"
        :collections="collections"
        :tags="tags"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-card-details.is-default {
  @apply 'max-sm:contents';
}

.lgc-post-title.is-cover-title {
  @apply 'max-w-[704px] text-left';
}

.lgc-post-excerpt {
  @apply 'mt-$lgc-space-md overflow-hidden';
}

.lgc-post-excerpt.is-default-excerpt {
  @apply 'max-sm:col-span-full max-sm:mt-0';
}

.lgc-post-excerpt.is-cover-excerpt {
  @apply 'max-w-[672px] text-left font-600';
}

.lgc-post-tags {
  @apply 'mt-$lgc-space-md';
}

.lgc-post-tags.is-desktop-only {
  @apply 'max-sm:hidden sm:flex';
}

// Residual: cover-on-mask color/shadow tokens from LgcPostCoverFrame (parent cascade).
.lgc-post-card-details.is-mask-gradient .lgc-post-title {
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-post-card-details.is-mask-gradient .lgc-post-excerpt {
  color: var(--lgc-post-cover-on-mask-variant);
  text-shadow: 0 1px 4px
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
}

.lgc-post-card-details.is-mask-card .lgc-post-title {
  @apply 'text-$md-sys-color-on-surface';
}

.lgc-post-card-details.is-align-right .lgc-post-title,
.lgc-post-card-details.is-align-right .lgc-post-excerpt {
  @apply 'sm:text-right';
}

.lgc-post-card-details.is-align-right .lgc-post-tags {
  @apply 'sm:justify-end';
}
</style>
