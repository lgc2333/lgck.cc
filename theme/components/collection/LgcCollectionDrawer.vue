<script setup lang="ts">
import type { CollectionConfig } from 'valaxy'
import {
  resolveCollectionItemHref,
  useCollections,
  useFrontmatter,
  useOutline,
} from 'valaxy'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    collection?: CollectionConfig
    currentIndex?: number
    show?: boolean
  }>(),
  {
    show: undefined,
  },
)

const route = useRoute()
const { t } = useI18n()
const { collections } = useCollections()
const frontmatter = useFrontmatter()
const { headers } = useOutline()
const open = ref(false)
const panelRef = ref<HTMLElement>()

const activeCollection = computed(() => props.collection || findRouteCollection())
const showAction = computed(
  () =>
    props.show ?? Boolean(activeCollection.value?.key || activeCollection.value?.items),
)
const showPostToc = computed(() => {
  return (
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})
const currentIndex = computed(() => {
  if (typeof props.currentIndex === 'number') return props.currentIndex

  const items = activeCollection.value?.items
  if (!items?.length) return -1

  const path = stripTrailingSlash(route.path)
  const slug = path.split('/').pop()
  return items.findIndex((item) => {
    if (item.key && item.key === slug) return true
    if (item.link && !/^https?:\/\//.test(item.link))
      return stripTrailingSlash(item.link) === path
    return false
  })
})
watch(showAction, (shown) => {
  if (!shown) open.value = false
})

function openDrawer() {
  open.value = true
  void nextTick(() => panelRef.value?.focus())
}

function closeDrawer() {
  open.value = false
}

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

function findRouteCollection() {
  const path = stripTrailingSlash(route.path)
  return collections.value.find((item) => {
    if (!item.key) return false

    const collectionPath = stripTrailingSlash(item.path || `/collections/${item.key}/`)
    if (path === collectionPath) return true

    return (item.items || []).some((entry) => {
      const { href, isExternal } = resolveCollectionItemHref(item.key!, entry)
      return !isExternal && stripTrailingSlash(href) === path
    })
  })
}
</script>

<template>
  <LgcFloatingActionButton
    :show="showAction"
    aria-controls="lgc-collection-drawer"
    :aria-expanded="open"
    button-class="lg:hidden!"
    :label="t('collection.open')"
    @click="openDrawer"
  >
    <span i-material-symbols-auto-stories-rounded aria-hidden="true" />
  </LgcFloatingActionButton>

  <ClientOnly>
    <Teleport to="body">
      <Transition name="lgc-collection-drawer">
        <div
          v-if="open && activeCollection"
          class="lgc-collection-drawer-layer lg:hidden!"
          inset-0
          fixed
          z="$lgc-layer-modal"
          @keydown.esc="closeDrawer"
        >
          <button
            class="lgc-collection-drawer-scrim"
            type="button"
            backdrop="blur-$lgc-mask-blur"
            border-0
            inset-0
            absolute
            :aria-label="t('accessibility.close_collection')"
            @click="closeDrawer"
          />

          <aside
            id="lgc-collection-drawer"
            ref="panelRef"
            class="lgc-collection-drawer-panel"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            grid
            h-full
            right-0
            top-0
            absolute
            p="$lgc-space-lg"
            text="$md-sys-color-on-surface"
            bg="$md-sys-color-surface-container-low"
            :aria-label="t('accessibility.collection_navigation')"
          >
            <div
              flex="~ items-center justify-between"
              gap="$lgc-space-lg"
              mb="$lgc-space-md"
              min-h="$lgc-control-size"
            >
              <span
                min-w="0"
                text="$md-sys-color-on-surface-variant size-$lgc-label-medium"
                font="900"
                tracking="[0.04em]"
                whitespace-nowrap
                text-ellipsis
                uppercase
                overflow-hidden
              >
                {{ t('collection.chapters') }}
              </span>
              <button
                class="lgc-icon-button-base lgc-icon-button-hover"
                type="button"
                w="$lgc-control-size-compact"
                h="$lgc-control-size-compact"
                rounded="$lgc-radius-control"
                text="size-$lgc-icon-size"
                :aria-label="t('accessibility.close_collection')"
                @click="closeDrawer"
              >
                <span i-material-symbols-close-rounded aria-hidden="true" />
              </button>
            </div>

            <div
              class="lgc-collection-drawer-scroll"
              min-h="0"
              min-w="0"
              overflow-x-hidden
              overflow-y-auto
            >
              <LgcCollectionNav
                :collapsible="showPostToc"
                :collection="activeCollection"
                :current-index="currentIndex"
                :show-header="false"
                @navigate="closeDrawer"
              />
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped lang="scss">
.lgc-collection-drawer-scrim {
  background: color-mix(in srgb, var(--md-sys-color-scrim, #000) 40%, transparent);
}

.lgc-collection-drawer-panel {
  --collection-drawer-width: min(
    var(--lgc-post-drawer-width),
    calc(100vw - var(--lgc-space-3xl))
  );

  width: var(--collection-drawer-width);
  grid-template-rows: auto minmax(0, 1fr);
  border-radius: var(--lgc-radius-large) 0 0 var(--lgc-radius-large);
}

.lgc-collection-drawer-enter-active,
.lgc-collection-drawer-leave-active {
  @apply 'transition-opacity duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-collection-drawer-enter-active .lgc-collection-drawer-scrim,
.lgc-collection-drawer-leave-active .lgc-collection-drawer-scrim {
  @apply 'transition-opacity duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-collection-drawer-enter-active .lgc-collection-drawer-panel,
.lgc-collection-drawer-leave-active .lgc-collection-drawer-panel {
  @apply 'transition-transform duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-collection-drawer-enter-from .lgc-collection-drawer-scrim,
.lgc-collection-drawer-leave-to .lgc-collection-drawer-scrim {
  @apply opacity-0;
}

.lgc-collection-drawer-enter-from .lgc-collection-drawer-panel,
.lgc-collection-drawer-leave-to .lgc-collection-drawer-panel {
  @apply translate-x-full;
}

@media (prefers-reduced-motion: reduce) {
  .lgc-collection-drawer-enter-active,
  .lgc-collection-drawer-leave-active,
  .lgc-collection-drawer-panel {
    transition-duration: 1ms;
  }
}
</style>
