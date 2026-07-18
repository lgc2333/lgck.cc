<script setup lang="ts">
import { useRuntimeConfig } from 'valaxy'
import { computed, ref, useSlots, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const slots = useSlots()

const supportCommentAddons = [
  {
    addon: 'valaxy-addon-waline',
    name: 'waline',
  },
  {
    addon: 'valaxy-addon-twikoo',
    name: 'twikoo',
  },
  {
    addon: 'valaxy-addon-artalk',
    name: 'artalk',
  },
  {
    addon: 'valaxy-addon-giscus',
    name: 'giscus',
  },
] as const

type CommentProvider = (typeof supportCommentAddons)[number]['name']

const commentSystems = computed(() => {
  return supportCommentAddons.filter(({ addon }) => runtimeConfig.value.addons[addon])
})
const activeComment = ref<CommentProvider>()
const hasContent = computed(
  () => Boolean(slots.default) || commentSystems.value.length > 0,
)

watchEffect(() => {
  if (!commentSystems.value.some(({ name }) => name === activeComment.value))
    activeComment.value = commentSystems.value[0]?.name
})
</script>

<template>
  <section
    v-if="hasContent"
    class="lgc-main-panel lgc-reading-panel"
    :aria-label="t('accessibility.comments')"
  >
    <ClientOnly>
      <div
        v-if="commentSystems.length > 1"
        flex="~ wrap"
        justify="end"
        gap="$lgc-space-xs"
        m-b="$lgc-space-lg"
        role="group"
        :aria-label="t('accessibility.comment_provider')"
      >
        <button
          v-for="comment in commentSystems"
          :key="comment.name"
          type="button"
          class="lgc-comment-provider"
          :class="{ 'is-active': activeComment === comment.name }"
          :aria-pressed="activeComment === comment.name"
          @click="activeComment = comment.name"
        >
          <span>{{ comment.name }}</span>
        </button>
      </div>

      <LgcWaline v-if="activeComment === 'waline'" />
      <LgcTwikoo v-if="activeComment === 'twikoo'" />
      <LgcArtalk v-if="activeComment === 'artalk'" />
      <LgcGiscus v-if="activeComment === 'giscus'" />
      <slot />
    </ClientOnly>
  </section>
</template>

<style lang="scss">
.lgc-comment-provider {
  @apply 'inline-flex min-h-$lgc-control-size-sm items-center gap-$lgc-space-xs';
  @apply 'rounded-$lgc-radius-control px-$lgc-space-md';
  @apply 'text-size-$lgc-label-medium text-$md-sys-color-on-surface-variant';
  @apply 'bg-$md-sys-color-surface-container-high';
  @apply 'transition-[background-color,border-radius,color,transform]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  @apply 'hover:rounded-$lgc-radius-control-active hover:text-$md-sys-color-primary';
  @apply 'hover:bg-$md-sys-color-primary-container';
  @apply 'focus-visible:rounded-$lgc-radius-control-active';
  @apply 'focus-visible:text-$md-sys-color-primary';
  @apply 'focus-visible:bg-$md-sys-color-primary-container';
}

.lgc-comment-provider:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-comment-provider.is-active {
  @apply 'text-$md-sys-color-on-primary bg-$md-sys-color-primary';
}
</style>
