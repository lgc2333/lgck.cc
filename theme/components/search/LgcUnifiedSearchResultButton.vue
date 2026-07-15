<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'

import type { SearchItem, SearchTextSegment } from '../../types'

const props = defineProps<{
  item: SearchItem
  preview?: boolean
  selected?: boolean
}>()

const { t } = useI18n()
const titleSegments = computed(
  () => props.item.titleSegments || [{ text: props.item.title }],
)
const sectionSegments = computed(() => {
  if (!props.item.section) return undefined

  return props.item.sectionSegments || [{ text: props.item.section }]
})
const excerptSegments = computed(() => {
  if (!props.item.excerpt) return undefined

  return props.item.excerptSegments || [{ text: props.item.excerpt }]
})
const previewDetailSegments = computed<SearchTextSegment[] | undefined>(() => {
  return excerptSegments.value || sectionSegments.value
})
const scoreLabel = computed(() => {
  if (typeof props.item.score !== 'number' || !Number.isFinite(props.item.score))
    return ''

  if (props.item.provider === 'fuse')
    return t('search.difference', { score: (props.item.score * 100).toFixed(1) })

  return t('search.score', { score: props.item.score.toFixed(1) })
})

const SearchTextSegments = defineComponent({
  props: {
    segments: {
      type: Array as PropType<SearchTextSegment[]>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      props.segments.map((segment, index) =>
        h(
          segment.highlighted ? 'mark' : 'span',
          {
            key: index,
            class: segment.highlighted ? 'lgc-search-highlight' : undefined,
          },
          segment.text,
        ),
      )
  },
})
</script>

<template>
  <button
    class="lgc-search-result"
    :class="{ 'is-preview': preview, 'is-selected': selected }"
    type="button"
    :role="preview ? 'option' : undefined"
    :aria-selected="preview ? selected : undefined"
  >
    <span class="lgc-search-result-title">
      <SearchTextSegments :segments="titleSegments" />
    </span>
    <span v-if="item.section && !preview" class="lgc-search-result-section">
      <SearchTextSegments v-if="sectionSegments" :segments="sectionSegments" />
    </span>
    <span v-if="item.excerpt && !preview" class="lgc-search-result-excerpt">
      <SearchTextSegments v-if="excerptSegments" :segments="excerptSegments" />
    </span>
    <span v-if="preview && previewDetailSegments" class="lgc-search-result-excerpt">
      <SearchTextSegments :segments="previewDetailSegments" />
    </span>
    <span v-if="!preview" class="lgc-search-result-meta">
      {{ item.path }}<template v-if="scoreLabel"> · {{ scoreLabel }}</template>
    </span>
  </button>
</template>
