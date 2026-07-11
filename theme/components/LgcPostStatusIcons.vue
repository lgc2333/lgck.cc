<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  post: Post
}>()

const draftTitle = computed(() => (props.post.draft ? 'draft' : ''))

const hideTitle = computed(() => {
  if (!props.post.hide) return ''
  return `hide:${props.post.hide === true ? 'all' : props.post.hide}`
})

const pinnedTitle = computed(() => {
  const top = Number(props.post.top || 0)
  if (!top) return ''
  return `pinned:${top}`
})

const title = computed(() =>
  [draftTitle.value, pinnedTitle.value, hideTitle.value].filter(Boolean).join(', '),
)

const hasStatusIcons = computed(() => Boolean(title.value))

/** Yun: hide:index uses a softer eye icon than full hide. */
const hideIconClass = computed(() =>
  props.post.hide === 'index'
    ? 'i-material-symbols-visibility-rounded'
    : 'i-material-symbols-visibility-off-rounded',
)

const iconClass =
  'lgc-post-status-icon inline-grid w-$lgc-control-size-sm h-$lgc-control-size-sm place-items-center rounded-$lgc-radius-full text-size-$lgc-title-medium'
</script>

<template>
  <div
    v-if="hasStatusIcons"
    class="lgc-post-status-icons"
    flex="~ col"
    absolute
    z-1
    top="$lgc-space-md"
    left="$lgc-space-md"
    gap="[6px]"
    :title="title"
  >
    <span
      v-if="post.draft"
      class="is-draft bg-$md-sys-color-secondary-container"
      :class="iconClass"
      i-material-symbols-contract-edit-rounded
      aria-hidden="true"
    />
    <span
      v-if="post.top"
      class="is-pinned bg-$md-sys-color-primary-container rotate-45"
      :class="iconClass"
      i-ic-round-push-pin
      aria-hidden="true"
    />
    <span
      v-if="post.hide"
      class="is-hidden bg-$md-sys-color-tertiary-container"
      :class="[iconClass, hideIconClass]"
      aria-hidden="true"
    />
    <span class="sr-only">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
// Residual: multi-layer drop-shadow not expressible cleanly as utilities.
.lgc-post-status-icons {
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.24))
    drop-shadow(0 2px 2px rgb(0 0 0 / 0.16));
}
</style>
