<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import { resolveCollectionItemHref, useValaxyI18n } from 'valaxy'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    collapsible?: boolean
    collection?: CollectionConfig
    currentIndex?: number
    showHeader?: boolean
  }>(),
  {
    collapsible: false,
    currentIndex: -1,
    showHeader: true,
  },
)

const emit = defineEmits<{
  navigate: [event: MouseEvent]
}>()

const { t } = useI18n()
const { $tO } = useValaxyI18n()
const route = useRoute()
const expanded = ref(true)

const collectionPath = computed(() => {
  if (props.collection?.path) return props.collection.path
  if (props.collection?.key) return `/collections/${props.collection.key}/`
  return '/collections/'
})
const title = computed(() => $tO(props.collection?.title || ''))
const resolvedItems = computed(() => {
  if (!props.collection?.key) return []

  return [
    {
      key: '__collection-index',
      href: collectionPath.value,
      link: undefined,
      isExternal: false,
      active:
        stripTrailingSlash(route.path) === stripTrailingSlash(collectionPath.value),
      title: t('collection.index'),
    },
    ...(props.collection.items || []).map((item, index) => ({
      ...item,
      ...resolveCollectionItemHref(props.collection!.key!, item),
      index,
      active: index === props.currentIndex,
      title: $tO(item.title || ''),
    })),
  ]
})

function onNavigate(event: MouseEvent) {
  emit('navigate', event)
}

function toggleExpanded() {
  expanded.value = !expanded.value
}

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}
</script>

<template>
  <section
    v-if="collection"
    class="lgc-collection-nav"
    :class="{ 'is-expanded': expanded }"
    grid
    gap="$lgc-space-sm"
    min-w="0"
    :aria-label="t('accessibility.collection_navigation')"
  >
    <header
      v-if="showHeader"
      flex="~ items-center justify-between"
      gap="$lgc-space-sm"
      min-w="0"
    >
      <span
        class="lgc-collection-nav-title"
        flex="~ items-center"
        gap="$lgc-space-sm"
        h="[20px]"
        min-w="0"
        px="$lgc-space-sm"
        leading="[20px]"
        tracking="[0.04em]"
        uppercase
      >
        <span i-material-symbols-auto-stories-rounded flex-none aria-hidden="true" />
        <strong min-w="0" whitespace-nowrap text-ellipsis overflow-hidden>
          {{ t('collection.title', { name: title || t('collection.badge') }) }}
        </strong>
      </span>

      <button
        v-if="collapsible && resolvedItems.length"
        class="lgc-collection-nav-toggle lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        w="$lgc-control-size-sm"
        h="$lgc-control-size-sm"
        rounded="$lgc-radius-control"
        text="size-$lgc-icon-size-sm"
        flex-none
        :aria-expanded="expanded"
        :aria-label="expanded ? t('collection.collapse') : t('collection.expand')"
        @click="toggleExpanded"
      >
        <span
          v-if="expanded"
          i-material-symbols-keyboard-arrow-up-rounded
          aria-hidden="true"
        />
        <span
          v-else
          i-material-symbols-keyboard-arrow-down-rounded
          aria-hidden="true"
        />
      </button>
    </header>

    <nav v-if="resolvedItems.length && expanded" min-w="0" overflow-x-hidden>
      <ul class="lgc-collection-nav-list">
        <li
          v-for="item in resolvedItems"
          :key="item.key || item.link || item.title"
          class="lgc-collection-nav-item"
        >
          <a
            v-if="item.isExternal"
            class="lgc-collection-nav-link"
            :class="{ 'is-active': item.active }"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="onNavigate"
          >
            <span min-w="0" block whitespace-normal wrap="anywhere">
              {{ item.title }}
            </span>
            <span
              class="text-size-$lgc-icon-size-sm"
              i-material-symbols-open-in-new-rounded
              flex-none
              aria-hidden="true"
            />
          </a>

          <RouterLink
            v-else
            class="lgc-collection-nav-link"
            :class="{ 'is-active': item.active }"
            :to="item.href || collectionPath"
            :aria-current="item.active ? 'page' : undefined"
            @click="onNavigate"
          >
            <span min-w="0" block whitespace-normal wrap="anywhere">
              {{ item.title }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <p
      v-else-if="!resolvedItems.length"
      class="text-size-$lgc-body-small text-$md-sys-color-on-surface-variant"
      m="0"
      p="$lgc-space-lg"
      rounded="$lgc-radius-large"
      bg="$md-sys-color-surface-container-high"
    >
      {{ t('collection.empty') }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.lgc-collection-nav-title {
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-label-medium font-900';
}

.lgc-collection-nav-list {
  @apply 'm-0 min-w-0 max-w-full list-none overflow-x-hidden p-0';
}

.lgc-collection-nav-link {
  @apply 'grid min-h-[32px] min-w-0 max-w-full items-center';
  @apply 'rounded-$lgc-radius-sm px-$lgc-space-sm no-underline';
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-label-medium';
  @apply 'font-800 leading-snug py-$lgc-space-xs';
  @apply 'transition-[background-color,color]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  grid-template-columns: minmax(0, 1fr) auto;
}

.lgc-collection-nav-link:hover,
.lgc-collection-nav-link:focus-visible {
  @apply 'text-$md-sys-color-primary';
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.lgc-collection-nav-link.is-active {
  @apply 'bg-$md-sys-color-primary-container text-$md-sys-color-on-primary-container';
}
</style>
