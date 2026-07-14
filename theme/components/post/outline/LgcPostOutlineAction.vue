<script setup lang="ts">
import { useFrontmatter, useOutline } from 'valaxy'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useActiveOutline } from '../../../composables'

const route = useRoute()
const frontmatter = useFrontmatter()
const { t } = useI18n()
const { headers, handleClick } = useOutline()
const drawerOpen = ref(false)

const showAction = computed(() => {
  return (
    route.meta.layout === 'post' &&
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})
const { activeTitle } = useActiveOutline(headers, { enabled: showAction })
const activeOutlineTitle = computed(() => activeTitle.value || t('post.outline'))

watch(showAction, (shown) => {
  if (!shown) drawerOpen.value = false
})

function closeDrawer() {
  drawerOpen.value = false
}

function openDrawer() {
  drawerOpen.value = true
}

function onDrawerNavigate(event: MouseEvent) {
  handleClick(event)
  closeDrawer()
}
</script>

<template>
  <LgcFloatingActionButton
    :show="showAction"
    aria-controls="lgc-post-outline-drawer"
    :aria-expanded="drawerOpen"
    button-class="lg:hidden!"
    interactive-detail
    :label="t('accessibility.open_post_outline')"
    @click="openDrawer"
  >
    <span i-material-symbols-format-list-bulleted-rounded aria-hidden="true" />

    <template #detail>
      <span
        block
        font="900"
        text="$md-sys-color-on-surface"
        whitespace="pre-wrap"
        wrap="anywhere"
      >
        {{ activeOutlineTitle }}
      </span>
    </template>
  </LgcFloatingActionButton>

  <ClientOnly>
    <Teleport to="body">
      <Transition name="lgc-post-outline-drawer">
        <div
          v-if="drawerOpen"
          class="lgc-post-outline-layer lg:hidden!"
          inset-0
          fixed
          z="$lgc-layer-modal"
          @keydown.esc="closeDrawer"
        >
          <button
            class="lgc-post-outline-scrim"
            type="button"
            border-0
            inset-0
            absolute
            :aria-label="t('accessibility.close_post_outline')"
            @click="closeDrawer"
          />

          <aside
            id="lgc-post-outline-drawer"
            class="lgc-post-outline-drawer"
            grid
            h-full
            right-0
            top-0
            absolute
            p="$lgc-space-lg"
            text="$md-sys-color-on-surface"
            bg="$md-sys-color-surface-container-low"
            tabindex="-1"
            :aria-label="t('accessibility.post_outline')"
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
                {{ t('post.outline') }}
              </span>
              <button
                class="lgc-icon-button-base lgc-icon-button-hover"
                type="button"
                w="$lgc-control-size-compact"
                h="$lgc-control-size-compact"
                rounded="$lgc-radius-control"
                text="size-$lgc-icon-size"
                :aria-label="t('accessibility.close_post_outline')"
                @click="closeDrawer"
              >
                <span i-material-symbols-close-rounded aria-hidden="true" />
              </button>
            </div>

            <div
              class="lgc-post-outline-scroll"
              min-h="0"
              min-w="0"
              overflow-x-hidden
              overflow-y-auto
            >
              <LgcPostOutline
                :headers="headers"
                :on-click="onDrawerNavigate"
                :show-title="false"
                track-active
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
.lgc-post-outline-scrim {
  background: color-mix(in srgb, var(--md-sys-color-scrim, #000) 40%, transparent);
}

.lgc-post-outline-drawer {
  --post-outline-drawer-width: min(
    var(--lgc-post-drawer-width),
    calc(100vw - var(--lgc-space-3xl))
  );
  width: var(--post-outline-drawer-width);
  grid-template-rows: auto minmax(0, 1fr);
  backdrop-filter: blur(var(--lgc-elevate-blur));
  border-radius: var(--lgc-radius-large) 0 0 var(--lgc-radius-large);
}

.lgc-post-outline-drawer-enter-active,
.lgc-post-outline-drawer-leave-active {
  @apply 'transition-opacity duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-post-outline-drawer-enter-active .lgc-post-outline-scrim,
.lgc-post-outline-drawer-leave-active .lgc-post-outline-scrim {
  @apply 'transition-opacity duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-post-outline-drawer-enter-active .lgc-post-outline-drawer,
.lgc-post-outline-drawer-leave-active .lgc-post-outline-drawer {
  @apply 'transition-transform duration-$lgc-motion-medium ease-$lgc-easing-standard';
}

.lgc-post-outline-drawer-enter-from .lgc-post-outline-scrim,
.lgc-post-outline-drawer-leave-to .lgc-post-outline-scrim {
  @apply opacity-0;
}

.lgc-post-outline-drawer-enter-from .lgc-post-outline-drawer,
.lgc-post-outline-drawer-leave-to .lgc-post-outline-drawer {
  @apply translate-x-full;
}

@media (prefers-reduced-motion: reduce) {
  .lgc-post-outline-drawer-enter-active,
  .lgc-post-outline-drawer-leave-active,
  .lgc-post-outline-drawer {
    transition-duration: 1ms;
  }
}
</style>
