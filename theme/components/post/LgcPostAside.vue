<script setup lang="ts">
import { useFrontmatter, useOutline } from 'valaxy'
import { computed } from 'vue'

withDefaults(
  defineProps<{
    embedded?: boolean
  }>(),
  {
    embedded: false,
  },
)

const frontmatter = useFrontmatter()
const { headers, handleClick } = useOutline()

const showAside = computed(() => {
  return (
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})
</script>

<template>
  <Transition name="lgc-post-aside">
    <aside
      v-if="showAside"
      class="lgc-post-aside hidden lg:block"
      :class="{ 'is-embedded': embedded }"
      grid
      sticky
      top="$post-aside-top"
      max-h="$post-aside-max-height"
      min-h="0"
      overflow-hidden
      p="$lgc-space-lg"
      rounded="$lgc-radius-large"
      bg="$md-sys-color-surface-container"
      text="$md-sys-color-on-surface"
    >
      <LgcPostOutline
        :scrollable="!embedded"
        :scroll-max-height="embedded ? 'none' : 'var(--post-aside-content-max-height)'"
        :headers="headers"
        :on-click="handleClick"
        track-active
      />
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
// Residual: local calc owner for sticky bounds.
.lgc-post-aside {
  --post-aside-top: calc(var(--lgc-header-height) + var(--lgc-space-lg));
  --post-aside-max-height: calc(100vh - var(--post-aside-top) - var(--lgc-space-lg));
  --post-aside-max-height: calc(100dvh - var(--post-aside-top) - var(--lgc-space-lg));
  --post-aside-content-max-height: calc(
    var(--post-aside-max-height) - var(--lgc-space-lg) - var(--lgc-space-lg)
  );
}

.lgc-post-aside-enter-active,
.lgc-post-aside-leave-active {
  transition:
    opacity var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-post-aside-enter-from,
.lgc-post-aside-leave-to {
  opacity: 0;
  transform: translateY(var(--lgc-space-md));
}

.lgc-post-aside.is-embedded {
  @apply 'static';
  max-height: none;
}

@media (prefers-reduced-motion: reduce) {
  .lgc-post-aside-enter-active,
  .lgc-post-aside-leave-active {
    transition: none;
  }

  .lgc-post-aside-enter-from,
  .lgc-post-aside-leave-to {
    transform: none;
  }
}
</style>
