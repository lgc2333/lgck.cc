<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    categories?: Post['categories']
    excerpt?: string
    excerptType?: string
    path: string
    tags: string[]
    title: string
    /** Hide tag row below sm (plain card shows a separate mobile chips row). */
    tagsDesktopOnly?: boolean
    /** Cover-card surface: title/excerpt layout owned here, not via parent :deep. */
    surface?: 'default' | 'cover'
    coverMask?: 'gradient' | 'card'
    coverAlign?: 'left' | 'right'
  }>(),
  {
    tagsDesktopOnly: false,
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
  if (props.surface !== 'cover') return 'min-w-0 self-center max-sm:contents'
  return [
    'lgc-post-body-cover min-w-0 self-center',
    `is-mask-${props.coverMask}`,
    `is-align-${props.coverAlign}`,
  ]
})

const titleClass = computed(() => {
  const base = 'lgc-post-title font-900'
  if (props.surface !== 'cover') return `${base} max-sm:self-center`
  return `${base} is-cover-title max-w-[704px] text-left`
})

// `markdown-body` unlocks css-i18n for `div[lang]`; type/rhythm reset lives in
// `styles/markdown.scss` (`.markdown-body.lgc-post-excerpt`).
const excerptClass = computed(() => {
  const base = 'lgc-post-excerpt markdown-body mt-$lgc-space-md overflow-hidden'
  if (props.surface !== 'cover') return `${base} max-sm:col-span-full max-sm:mt-0`
  return `${base} is-cover-excerpt max-w-[672px] font-600 text-left`
})

const tagsClass = computed(() => [
  'lgc-post-tags mt-$lgc-space-md',
  props.tagsDesktopOnly ? 'max-sm:hidden sm:flex' : '',
])

const hasTaxonomies = computed(() => Boolean(props.categories) || props.tags.length > 0)
</script>

<template>
  <div :class="rootClass">
    <h3 :class="titleClass">
      <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children -->
      <RouterLink
        class="lgc-post-title-link text-inherit no-underline focus-visible:text-$md-sys-color-primary hover:text-$md-sys-color-primary"
        :to="path"
      >
        {{ title }}
      </RouterLink>
    </h3>
    <div v-if="excerpt && shouldRenderAsTemplate" :class="excerptClass">
      <ValaxyDynamicComponent :template-str="excerpt" />
    </div>
    <div v-else-if="excerpt" :class="excerptClass" v-html="excerpt" />
    <div v-if="hasTaxonomies" :class="tagsClass" flex="~ wrap" gap="$lgc-space-sm">
      <LgcPostMetaChips only-taxonomies :categories="categories" :tags="tags" />
    </div>
  </div>
</template>

<style scoped lang="scss">
// Residual: cover-on-mask color/shadow tokens from LgcPostCoverFrame (parent cascade).
.lgc-post-body-cover.is-mask-gradient .lgc-post-title {
  color: var(--lgc-post-cover-on-mask);
  text-shadow: var(--lgc-post-cover-text-shadow);
}

.lgc-post-body-cover.is-mask-gradient .lgc-post-excerpt {
  color: var(--lgc-post-cover-on-mask-variant);
  text-shadow: 0 1px 4px
    color-mix(in srgb, var(--md-sys-color-surface) 24%, transparent);
}

.lgc-post-body-cover.is-mask-card .lgc-post-title {
  @apply 'text-$md-sys-color-on-surface';
}

.lgc-post-body-cover.is-align-right .lgc-post-title,
.lgc-post-body-cover.is-align-right .lgc-post-excerpt {
  @apply 'sm:text-right';
}

.lgc-post-body-cover.is-align-right .lgc-post-tags {
  @apply 'sm:justify-end';
}
</style>
