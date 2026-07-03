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
</script>

<template>
  <div v-if="hasStatusIcons" class="lgc-post-status-icons" :title="title">
    <span
      v-if="post.draft"
      class="lgc-post-status-icon is-draft"
      i-ri-draft-line
      aria-hidden="true"
    />
    <span
      v-if="post.top"
      class="lgc-post-status-icon is-pinned"
      i-ic-round-push-pin
      aria-hidden="true"
    />
    <span
      v-if="post.hide === 'index'"
      class="lgc-post-status-icon is-hidden"
      i-material-symbols-visibility-off-rounded
      aria-hidden="true"
    />
    <span
      v-else-if="post.hide"
      class="lgc-post-status-icon is-hidden"
      i-material-symbols-visibility-rounded
      aria-hidden="true"
    />
    <span class="sr-only">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-status-icons {
  position: absolute;
  z-index: 1;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  flex-direction: column;
  gap: 0.375rem;
  filter: drop-shadow(0 0.0625rem 0.0625rem rgb(0 0 0 / 0.24))
    drop-shadow(0 0.125rem 0.125rem rgb(0 0 0 / 0.16));
}

.lgc-post-status-icon {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 999px;
  font-size: 1.125rem;
  background: var(--md-sys-color-tertiary-container);
}

.lgc-post-status-icon.is-pinned {
  background: var(--md-sys-color-secondary-container);
  transform: rotate(45deg);
}

.lgc-post-status-icon.is-draft {
  background: var(--md-sys-color-surface-container-highest);
}
</style>
