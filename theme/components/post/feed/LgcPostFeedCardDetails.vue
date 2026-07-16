<script setup lang="ts">
import type { Post, PostCollectionInfo } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  categories?: Post['categories']
  collections?: PostCollectionInfo[]
  excerpt?: string
  excerptType?: string
  tags: string[]
  tagTone: 'default' | 'on-cover'
}>()

const shouldRenderAsTemplate = computed(() => {
  if (!props.excerpt) return false
  if (props.excerptType === 'html') return true

  return /<[A-Z][\w.-]*(?:\s|\/?>)/.test(props.excerpt)
})

// `markdown-body` unlocks css-i18n for `div[lang]`; type/rhythm reset lives in
// `styles/markdown.scss` (`.markdown-body.lgc-post-excerpt`).
const hasTaxonomies = computed(
  () =>
    Boolean(props.categories) ||
    props.tags.length > 0 ||
    Boolean(props.collections?.length),
)
const hasBody = computed(() => Boolean(props.excerpt) || hasTaxonomies.value)
</script>

<template>
  <div v-if="hasBody" class="lgc-post-card-details" grid gap="$lgc-space-md" min-w="0">
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
    <div v-if="hasTaxonomies" class="lgc-post-tags" flex="~ wrap" gap="$lgc-space-sm">
      <LgcTaxonomyChips
        :categories="categories"
        :collections="collections"
        :tags="tags"
        :tone="tagTone"
      />
    </div>
  </div>
</template>
