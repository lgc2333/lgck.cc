<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    description?: string
    flush?: boolean
    heading?: 'h1' | 'h2' | 'h3'
    id?: string
    label?: string
    surface?: boolean
    title?: string
    titleId?: string
  }>(),
  {
    flush: false,
    heading: 'h1',
    surface: true,
  },
)

const slots = useSlots()
const resolvedTitleId = computed(() => {
  if (props.titleId) return props.titleId
  return props.id && (props.title || slots.title) ? `lgc-${props.id}-title` : undefined
})
const hasHeader = computed(
  () =>
    Boolean(props.label) ||
    Boolean(props.title) ||
    Boolean(props.description) ||
    Boolean(slots.label) ||
    Boolean(slots.title) ||
    Boolean(slots.description) ||
    Boolean(slots.actions),
)
</script>

<template>
  <section
    :id="id"
    :class="surface ? 'lgc-page-surface' : undefined"
    scroll-mt="$lgc-space-lg"
    :aria-labelledby="resolvedTitleId"
    :aria-label="resolvedTitleId ? undefined : ariaLabel"
  >
    <div
      grid
      box-border
      w="full"
      gap="$lgc-space-lg"
      class="mx-auto pb-$lgc-space-3xl max-w-$lgc-container-reading sm:pb-$lgc-space-4xl"
      :class="flush ? 'px-0' : 'px-$lgc-space-lg sm:px-$lgc-space-2xl'"
    >
      <header
        v-if="hasHeader"
        flex="~ wrap items-end justify-between"
        gap="$lgc-space-md"
      >
        <div grid gap="$lgc-space-xs" min-w="0">
          <p
            v-if="label || $slots.label"
            class="text-size-$lgc-body-small text-$md-sys-color-primary"
            m="0"
            font="800"
            aria-hidden="true"
          >
            <slot name="label">
              {{ label }}
            </slot>
          </p>

          <component
            :is="heading"
            v-if="title || $slots.title"
            :id="resolvedTitleId"
            m="0"
            text="$md-sys-color-on-surface size-$lgc-headline-large"
            font="900"
            leading-tight
            tracking-normal
          >
            <slot name="title">
              {{ title }}
            </slot>
          </component>

          <p
            v-if="description || $slots.description"
            m="0"
            text="$md-sys-color-on-surface-variant size-$lgc-body-small"
            leading-relaxed
          >
            <slot name="description">
              {{ description }}
            </slot>
          </p>
        </div>

        <div v-if="$slots.actions" inline-flex items-center gap="$lgc-space-sm">
          <slot name="actions" />
        </div>
      </header>

      <slot />
    </div>
  </section>
</template>
