<script setup lang="ts">
import { useFrontmatter, useOutline } from 'valaxy'
import { computed } from 'vue'

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
  <aside
    v-if="showAside"
    class="lgc-post-aside hidden lg:block"
    sticky
    top="$post-aside-top"
    max-h="$post-aside-max-height"
    overflow-y-auto
    p="$lgc-space-lg"
    rounded="$lgc-radius-large"
    bg="$md-sys-color-surface-container"
    text="$md-sys-color-on-surface"
  >
    <LgcPostOutline :headers="headers" :on-click="handleClick" track-active />
  </aside>
</template>

<style scoped lang="scss">
// Residual: local calc owner for sticky bounds.
.lgc-post-aside {
  --post-aside-top: calc(var(--lgc-header-height) + var(--lgc-space-lg));
  --post-aside-max-height: calc(100vh - var(--post-aside-top) - var(--lgc-space-lg));
}
</style>
