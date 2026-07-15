<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

type DrawerSide = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    closeLabel: string
    id: string
    label: string
    open: boolean
    side?: DrawerSide
    title: string
    width?: string
  }>(),
  {
    side: 'right',
    width: 'var(--lgc-post-drawer-width)',
  },
)

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement>()

watch(
  () => props.open,
  (open) => {
    if (open) void nextTick(() => panelRef.value?.focus())
  },
)
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="lgc-side-drawer">
        <div
          v-if="open"
          class="lgc-side-drawer-layer"
          inset-0
          fixed
          lg="hidden!"
          z="$lgc-layer-modal"
          @keydown.esc="emit('close')"
        >
          <button
            class="lgc-side-drawer-scrim"
            type="button"
            backdrop="blur-$lgc-mask-blur"
            border-0
            inset-0
            absolute
            :aria-label="closeLabel"
            @click="emit('close')"
          />

          <aside
            :id="id"
            ref="panelRef"
            class="lgc-side-drawer-panel"
            :class="`is-${side}`"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            grid
            h-full
            top-0
            absolute
            p="$lgc-space-lg"
            text="$md-sys-color-on-surface"
            bg="$md-sys-color-surface-container-low"
            :style="{ '--lgc-side-drawer-width-source': width }"
            :aria-label="label"
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
                {{ title }}
              </span>
              <button
                class="lgc-icon-button-base lgc-icon-button-hover"
                type="button"
                w="$lgc-control-size-compact"
                h="$lgc-control-size-compact"
                rounded="$lgc-radius-control"
                text="size-$lgc-icon-size"
                :aria-label="closeLabel"
                @click="emit('close')"
              >
                <span i-material-symbols-close-rounded aria-hidden="true" />
              </button>
            </div>

            <div
              class="lgc-side-drawer-scroll"
              min-h="0"
              min-w="0"
              overflow-x-hidden
              overflow-y-auto
            >
              <slot />
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
