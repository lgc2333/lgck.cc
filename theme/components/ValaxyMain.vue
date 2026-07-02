<script lang="ts" setup>
import type { PageData, Post } from 'valaxy'
import { useSiteConfig } from 'valaxy'

defineProps<{
  frontmatter: Post
  data?: PageData
}>()
const siteConfig = useSiteConfig()
</script>

<template>
  <main>
    <div class="lgc-main-shell">
      <slot name="main">
        <div class="lgc-main-content">
          <slot name="main-header" />
          <slot name="main-header-after" />

          <slot name="main-content">
            <div class="markdown-body lgc-markdown">
              <ValaxyMd :frontmatter="frontmatter">
                <slot name="main-content-md" />
                <slot />
              </ValaxyMd>
            </div>
            <slot name="main-content-after" />
          </slot>
        </div>

        <slot name="main-nav-before" />

        <slot name="main-nav" />

        <slot name="main-nav-after" />

        <slot
          v-if="siteConfig.comment.enable && frontmatter.comment !== false"
          name="comment"
        />

        <slot name="footer" />
      </slot>
    </div>

    <slot name="aside" />
  </main>
</template>

<style scoped lang="scss">
.lgc-main-shell {
  display: flex;
  width: 100%;
}

.lgc-main-content {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
}

.lgc-markdown {
  max-width: none;
  padding-bottom: 2rem;
}
</style>
