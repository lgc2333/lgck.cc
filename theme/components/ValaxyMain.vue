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
  <main class="lgc-main">
    <div class="lgc-main-shell">
      <slot name="main">
        <slot name="main-header">
          <LgcPostArticleHeader :frontmatter="frontmatter" />
        </slot>
        <slot name="main-header-after" />

        <div class="lgc-main-reading">
          <div class="lgc-main-content-card">
            <div class="lgc-main-content">
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

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-main {
  position: relative;
  width: 100%;
  isolation: isolate;
  color: var(--md-sys-color-on-surface);
}

.lgc-main-shell {
  display: grid;
  width: 100%;
  gap: var(--lgc-space-lg);
  padding-bottom: var(--lgc-space-6xl);
}

.lgc-main-reading {
  display: grid;
  width: 100%;
  max-width: var(--lgc-container-reading);
  gap: var(--lgc-space-lg);
  margin-inline: auto;
}

.lgc-main-content {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
}

.lgc-main-content-card {
  @include reading-panel;

  overflow: hidden;

  :deep(.lgc-markdown) {
    max-width: none;
    min-width: 0;
    overflow: hidden;
    padding-bottom: 0;
  }

  :deep(.lgc-markdown > *) {
    max-width: 100%;
  }

  :deep(.markdown-body > :first-child) {
    margin-top: 0;
  }

  :deep(.markdown-body > :last-child) {
    margin-bottom: 0;
  }
}
</style>
