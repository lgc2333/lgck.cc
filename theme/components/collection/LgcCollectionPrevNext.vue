<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import { resolveCollectionItemHref, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    collection?: CollectionConfig
    currentIndex?: number
  }>(),
  {
    currentIndex: -1,
  },
)

const { t } = useI18n()
const { $tO } = useValaxyI18n()

const prevItem = computed(() => {
  if (!props.collection?.items || props.currentIndex < 0) return undefined
  return props.collection.items[props.currentIndex - 1]
})
const nextItem = computed(() => {
  if (!props.collection?.items || props.currentIndex < 0) return undefined
  return props.collection.items[props.currentIndex + 1]
})

function resolveItem(item: NonNullable<CollectionConfig['items']>[number] | undefined) {
  if (!item || !props.collection?.key) return undefined
  const resolved = resolveCollectionItemHref(props.collection.key, item)
  return {
    external: resolved.isExternal,
    href: resolved.href,
    title: $tO(item.title || ''),
  }
}

const prev = computed(() => resolveItem(prevItem.value))
const next = computed(() => resolveItem(nextItem.value))
</script>

<template>
  <LgcPrevNextNav
    :prev="prev"
    :next="next"
    :label="t('accessibility.collection_navigation')"
  />
</template>
