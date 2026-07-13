<script setup lang="ts">
import type { MenuItem } from 'valaxy'
import type { Ref } from 'vue'
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActiveOutline } from '../composables'

const props = withDefaults(
  defineProps<{
    headers: MenuItem[]
    onClick: (event: MouseEvent) => void
    showTitle?: boolean
    title?: string
    trackActive?: boolean
  }>(),
  {
    showTitle: true,
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
const markerTopOffset = computed(() => (props.showTitle ? 34 : 6))

useActiveOutline(toRef(props, 'headers'), {
  containerRef,
  enabled: toRef(props, 'trackActive'),
  markerRef,
  markerTopOffset,
})
</script>

<template>
  <div ref="containerRef" class="lgc-post-outline" grid relative gap="$lgc-space-sm">
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
      v-if="trackActive"
      ref="markerRef"
      class="lgc-post-outline-marker"
      aria-hidden="true"
    />

    <nav :aria-label="title || t('accessibility.post_outline')">
      <LgcPostOutlineItem
        class="css-i18n-toc"
        :headers="headers"
        :on-click="onClick"
        root
        relative
        z="1"
        @navigate="emit('navigate', $event)"
      />
    </nav>
  </div>
</template>

<style scoped lang="scss">
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
