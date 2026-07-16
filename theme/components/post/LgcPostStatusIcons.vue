<script setup lang="ts">
import type { Post } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    post: Post
    variant?: 'overlay' | 'chip'
    tone?: 'default' | 'on-cover'
  }>(),
  {
    variant: 'overlay',
    tone: 'default',
  },
)

const { t } = useI18n()

const draftTitle = computed(() => (props.post.draft ? t('post.status_draft') : ''))
const draftDesc = computed(() => (props.post.draft ? t('post.status_draft_desc') : ''))

const hideMode = computed(() => {
  if (!props.post.hide) return ''
  return props.post.hide === 'index' ? 'index' : 'all'
})
const hideTitle = computed(() => {
  if (hideMode.value === 'index') return t('post.status_hide_index_desc')
  if (hideMode.value === 'all') return t('post.status_hide_all_desc')
  return ''
})

const pinnedTitle = computed(() => {
  const top = Number(props.post.top || 0)
  if (!top) return ''
  return t('post.status_pinned', { n: top })
})
const pinnedDesc = computed(() =>
  Number(props.post.top || 0) ? t('post.status_pinned_desc') : '',
)

const hasDraftStatus = computed(() => Boolean(props.post.draft))
const hasHideStatus = computed(() => Boolean(props.post.hide))
const hasPinnedStatus = computed(() => Boolean(Number(props.post.top || 0)))
const title = computed(() =>
  [draftTitle.value, pinnedTitle.value, hideTitle.value].filter(Boolean).join(', '),
)

const hasStatusIcons = computed(
  () => hasDraftStatus.value || hasPinnedStatus.value || hasHideStatus.value,
)
const chipClass = computed(() => [
  'lgc-post-meta-chip',
  props.tone === 'on-cover' ? 'is-on-cover' : '',
])

/** Yun: hide:index uses a softer eye icon than full hide. */
const hideIconClass = computed(() =>
  props.post.hide === 'index'
    ? 'i-ic-round-disabled-visible'
    : 'i-material-symbols-visibility-off-rounded',
)
</script>

<template>
  <template v-if="hasStatusIcons && variant === 'chip'">
    <span
      v-if="hasDraftStatus"
      class="is-status"
      :class="chipClass"
      :title="draftTitle"
      :aria-label="draftTitle"
      role="img"
    >
      <span i-material-symbols-contract-edit-rounded aria-hidden="true" />
      <span>{{ draftDesc }}</span>
    </span>
    <span
      v-if="hasPinnedStatus"
      class="is-status"
      :class="chipClass"
      :title="pinnedTitle"
      :aria-label="pinnedTitle"
      role="img"
    >
      <span i-ic-round-push-pin rotate-45 aria-hidden="true" />
      <span>{{ pinnedDesc }}</span>
    </span>
    <span
      v-if="hasHideStatus"
      class="is-status"
      :class="chipClass"
      :title="hideTitle"
      :aria-label="hideTitle"
      role="img"
    >
      <span :class="[hideIconClass]" aria-hidden="true" />
      <span>{{ hideTitle }}</span>
    </span>
  </template>
  <div
    v-else-if="hasStatusIcons"
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
      v-if="hasDraftStatus"
      class="lgc-post-status-icon is-draft bg-$md-sys-color-on-secondary-container"
      i-material-symbols-contract-edit-rounded
      aria-hidden="true"
    />
    <span
      v-if="hasPinnedStatus"
      class="lgc-post-status-icon is-pinned bg-$md-sys-color-primary-container rotate-45 dark:bg-$md-sys-color-primary"
      i-ic-round-push-pin
      aria-hidden="true"
    />
    <span
      v-if="hasHideStatus"
      class="lgc-post-status-icon is-hidden bg-$md-sys-color-on-tertiary dark:bg-$md-sys-color-tertiary"
      :class="[hideIconClass]"
      aria-hidden="true"
    />
    <span class="sr-only">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
// Residual: multi-layer drop-shadow not expressible cleanly as utilities.
.lgc-post-status-icons {
  filter: drop-shadow(
      0 1px 1px color-mix(in srgb, var(--md-sys-color-scrim, #000) 24%, transparent)
    )
    drop-shadow(
      0 2px 2px color-mix(in srgb, var(--md-sys-color-scrim, #000) 16%, transparent)
    );
}

.lgc-post-status-icon {
  @apply 'inline-grid w-$lgc-control-size-sm h-$lgc-control-size-sm place-items-center text-size-$lgc-title-medium';
}
</style>
