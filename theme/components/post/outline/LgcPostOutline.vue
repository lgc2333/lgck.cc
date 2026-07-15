<script setup lang="ts">
import type { MenuItem } from 'valaxy'
import type { Ref } from 'vue'
import { ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActiveOutline } from '../../../composables'

const props = withDefaults(
  defineProps<{
    headers: MenuItem[]
    onClick: (event: MouseEvent) => void
    showTitle?: boolean
    scrollable?: boolean
    scrollMaxHeight?: string
    title?: string
    trackActive?: boolean
  }>(),
  {
    showTitle: true,
    scrollable: false,
    scrollMaxHeight: 'none',
    title: '',
    trackActive: false,
  },
)

const emit = defineEmits<{
  navigate: [event: MouseEvent]
}>()

const { t } = useI18n()
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const markerRef = ref<HTMLElement>() as Ref<HTMLElement>

const { activeLink } = useActiveOutline(toRef(props, 'headers'), {
  containerRef,
  enabled: toRef(props, 'trackActive'),
  markerRef,
})
</script>

<template>
  <div
    class="lgc-post-outline"
    :class="{ 'is-scrollable': scrollable }"
    :style="
      scrollable ? { '--post-outline-scroll-max-height': scrollMaxHeight } : undefined
    "
    grid
    min-h="0"
    gap="$lgc-space-sm"
  >
    <div
      v-if="showTitle"
      flex="~ items-center"
      gap="$lgc-space-sm"
      h="[20px]"
      px="$lgc-space-sm"
      text="$md-sys-color-on-surface-variant size-$lgc-label-medium"
      font="900"
      leading="[20px]"
      tracking="[0.04em]"
      uppercase
    >
      <span i-material-symbols-toc-rounded aria-hidden="true" />
      <span min-w="0" whitespace-nowrap text-ellipsis overflow-hidden>
        {{ title || t('post.outline') }}
      </span>
    </div>

    <div
      ref="containerRef"
      class="lgc-post-outline-scroll"
      :class="{ 'is-scrollable': scrollable }"
      min-h="0"
      min-w="0"
      relative
      overflow-x-hidden
    >
      <div
        v-if="trackActive"
        ref="markerRef"
        class="lgc-post-outline-marker"
        aria-hidden="true"
      />

      <nav :aria-label="title || t('accessibility.post_outline')" min-w="0">
        <LgcPostOutlineItem
          class="css-i18n-toc"
          :active-link="activeLink"
          :headers="headers"
          :on-click="onClick"
          root
          @navigate="emit('navigate', $event)"
        />
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-outline.is-scrollable {
  @apply 'grid-rows-[auto_minmax(0,1fr)]';
}

.lgc-post-outline-scroll.is-scrollable {
  @apply 'overflow-y-auto';
  max-height: var(--post-outline-scroll-max-height);
}

// Residual: active marker is positioned by useActiveOutline.
.lgc-post-outline-marker {
  --post-outline-marker-height: 20px;
  --post-outline-marker-width: 4px;

  @apply 'pointer-events-none absolute left-0 top-0 z-2 w-[var(--post-outline-marker-width)] h-[var(--post-outline-marker-height)] opacity-0';
  @apply 'rounded-full bg-$md-sys-color-primary';
  transition:
    top var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}
</style>
