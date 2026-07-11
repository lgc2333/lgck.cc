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
  <main relative w="full" isolate text="$md-sys-color-on-surface">
    <div grid w="full" gap="$lgc-space-lg" pb="$lgc-space-6xl">
      <slot name="main">
        <slot name="main-header">
          <LgcPostArticleHeader :frontmatter="frontmatter" />
        </slot>
        <slot name="main-header-after" />

        <div w="full" max-w="$lgc-container-reading" gap="$lgc-space-lg" mx-auto grid>
          <div class="lgc-reading-panel" overflow-hidden>
            <div flex="~ col" w="full" min-w="0">
              <slot name="main-content">
                <div
                  class="markdown-body"
                  max-w="none"
                  min-w="0"
                  overflow-hidden
                  pb="0"
                >
                  <ValaxyMd :frontmatter="frontmatter">
                    <slot name="main-content-md" />
                    <slot />
                  </ValaxyMd>
                </div>
                <slot name="main-content-after" />
              </slot>
            </div>
          </div>

          <slot name="main-nav-before" />

          <slot name="main-nav" />

          <slot name="main-nav-after" />

          <slot
            v-if="siteConfig.comment.enable && frontmatter.comment !== false"
            name="comment"
          >
            <LgcComment />
          </slot>

          <slot name="footer" />
        </div>
      </slot>
    </div>

    <slot name="aside" />
  </main>
</template>
