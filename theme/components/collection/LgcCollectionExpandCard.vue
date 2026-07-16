<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import { useCollection, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  collection?: CollectionConfig
}>()

const { t } = useI18n()
const { $tO } = useValaxyI18n()
const { collection: routeCollection } = useCollection()

const activeCollection = computed(() => props.collection || routeCollection.value)
const collectionTitle = computed(
  () => $tO(activeCollection.value?.title || '') || t('collection.badge'),
)
</script>

<template>
  <aside
    class="lgc-collection-expand-card text-$md-sys-color-on-surface lg:hidden!"
    w="full"
    max-w="$lgc-container-reading"
    grid-cols="[auto_minmax(0,1fr)]"
    mx-auto
    grid
    items-center
    box-border
    gap="$lgc-space-md"
    rounded="$lgc-radius-large"
    bg="$md-sys-color-surface-container"
    p="$lgc-space-lg"
    role="note"
  >
    <span
      class="text-size-$lgc-icon-size text-$md-sys-color-on-primary-container"
      h="$lgc-control-size-compact"
      w="$lgc-control-size-compact"
      flex-none
      inline-grid
      place-items="center"
      rounded="$lgc-radius-control-active"
      bg="$md-sys-color-primary-container"
      aria-hidden="true"
    >
      <span i-material-symbols-auto-stories-rounded />
    </span>

    <span grid min-w="0" gap="$lgc-space-xs">
      <strong class="text-size-$lgc-title-small">
        {{ t('collection.article_hint_title', { name: collectionTitle }) }}
      </strong>
      <span
        class="text-size-$lgc-body-medium text-$md-sys-color-on-surface-variant"
        leading="[1.65]"
      >
        {{ t('collection.article_hint_desc_before') }}
        <span
          class="text-$md-sys-color-primary"
          w="[1.4em]"
          h="[1.4em]"
          mx="[0.1em]"
          place-items="center"
          align-middle
          inline-grid
          aria-hidden="true"
        >
          <span i-material-symbols-auto-stories-rounded />
        </span>
        {{ t('collection.article_hint_desc_after') }}
      </span>
    </span>
  </aside>
</template>
