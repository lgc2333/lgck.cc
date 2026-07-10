<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    category?: string
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
  if (props.surface !== 'cover') return 'min-w-0 self-center'
  return [
    'lgc-post-body-cover min-w-0 self-center',
    `is-mask-${props.coverMask}`,
    `is-align-${props.coverAlign}`,
  ]
})

const titleClass = computed(() =>
  props.surface === 'cover'
    ? 'lgc-post-title is-cover-title font-900'
    : 'lgc-post-title font-900',
)

const excerptClass = computed(() => [
  'lgc-post-excerpt',
  props.surface === 'cover' ? 'is-cover-excerpt' : '',
])

const tagsClass = computed(() => [
  'lgc-post-tags mt-$lgc-space-md',
  props.tagsDesktopOnly ? 'max-sm:hidden sm:flex' : '',
])
</script>

<template>
  <div :class="rootClass">
    <h3 :class="titleClass">
      <!-- No text= on RouterLink: HTMLAnchorElement.text replaces children -->
      <RouterLink class="lgc-post-title-link" :to="path">
        {{ title }}
      </RouterLink>
    </h3>
    <div v-if="excerpt && shouldRenderAsTemplate" :class="excerptClass">
      <ValaxyDynamicComponent :template-str="excerpt" />
    </div>
    <div v-else-if="excerpt" :class="excerptClass" v-html="excerpt" />
    <div
      v-if="category || tags.length"
      :class="tagsClass"
      flex="~ wrap"
      gap="$lgc-space-sm"
    >
      <LgcPostMetaChips :category="category" :tags="tags" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-title-link {
  @apply 'text-inherit no-underline';
}

.lgc-post-title-link:hover,
.lgc-post-title-link:focus-visible {
  @apply 'text-$md-sys-color-primary';
}

.lgc-post-excerpt {
  @apply 'mt-$lgc-space-md overflow-hidden text-size-$lgc-body-small';
  @apply 'leading-[1.75] text-$md-sys-color-on-surface-variant [&_p]:m-0';
}

.lgc-post-title.is-cover-title {
  @apply 'max-w-[704px] text-left';
}

.lgc-post-excerpt.is-cover-excerpt {
  @apply 'max-w-[672px] font-600 text-left';
}

// Residual: cover-on-mask color/shadow tokens from LgcPostCoverFrame.
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
