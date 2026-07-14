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
  return {
    ...resolveCollectionItemHref(props.collection.key, item),
    title: $tO(item.title || ''),
  }
}

const prev = computed(() => resolveItem(prevItem.value))
const next = computed(() => resolveItem(nextItem.value))
</script>

<template>
  <nav
    v-if="prev || next"
    class="lgc-article-nav"
    grid
    gap="$lgc-space-md"
    :class="{ 'md:grid-cols-2': prev && next }"
    :aria-label="t('accessibility.collection_navigation')"
  >
    <component
      :is="prev?.isExternal ? 'a' : 'RouterLink'"
      v-if="prev"
      class="lgc-article-nav-item lgc-panel-link is-previous"
      grid
      min-w="0"
      items-center
      gap="$lgc-space-sm"
      overflow-hidden
      v-bind="
        prev.isExternal
          ? { href: prev.href, target: '_blank', rel: 'noopener noreferrer' }
          : { to: prev.href }
      "
    >
      <span
        class="lgc-article-nav-icon text-size-$lgc-icon-size text-$md-sys-color-primary"
        flex-none
        inline-grid
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span i-material-symbols-arrow-back-rounded />
      </span>
      <span class="lgc-article-nav-copy" grid min-w="0" gap="$lgc-space-xs">
        <span
          class="text-size-$lgc-label-small text-$md-sys-color-on-surface-variant"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          {{ t('post.previous') }}
        </span>
        <strong class="lgc-article-nav-title">{{ prev.title }}</strong>
      </span>
    </component>

    <component
      :is="next?.isExternal ? 'a' : 'RouterLink'"
      v-if="next"
      class="lgc-article-nav-item lgc-panel-link is-next"
      min-w="0"
      gap="$lgc-space-sm"
      text-right
      grid
      items-center
      overflow-hidden
      v-bind="
        next.isExternal
          ? { href: next.href, target: '_blank', rel: 'noopener noreferrer' }
          : { to: next.href }
      "
    >
      <span class="lgc-article-nav-copy" grid min-w="0" gap="$lgc-space-xs">
        <span
          class="text-size-$lgc-label-small text-$md-sys-color-on-surface-variant"
          font="900"
          tracking="[0.04em]"
          uppercase
        >
          {{ t('post.next') }}
        </span>
        <strong class="lgc-article-nav-title">{{ next.title }}</strong>
      </span>
      <span
        class="lgc-article-nav-icon text-size-$lgc-icon-size text-$md-sys-color-primary"
        flex-none
        inline-grid
        place-items="center"
        w="$lgc-control-size-compact"
        h="$lgc-control-size-compact"
        rounded="$lgc-radius-control-active"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span
          :class="
            next.isExternal
              ? 'i-material-symbols-open-in-new-rounded'
              : 'i-material-symbols-arrow-forward-rounded'
          "
        />
      </span>
    </component>
  </nav>
</template>

<style scoped lang="scss">
// Residual: asymmetric grid tracks (icon | copy vs copy | icon).
.lgc-article-nav-item {
  grid-template-columns: auto minmax(0, 1fr);
}

.lgc-article-nav-item.is-next {
  grid-template-columns: minmax(0, 1fr) auto;
}

// Residual: multi-line clamp needs -webkit-box (line-clamp alone is incomplete here).
.lgc-article-nav-title {
  display: -webkit-box;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  @apply 'overflow-hidden text-size-$lgc-body-medium leading-[1.45] line-clamp-2';
}
</style>
