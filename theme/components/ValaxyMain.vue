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

        <div
          class="lgc-post-shell"
          w="full"
          max-w="$lgc-container-reading"
          justify-items="stretch"
          gap="$lgc-space-lg"
          mx-auto
          grid
        >
          <div
            class="lgc-main-reading"
            w="full"
            max-w="$lgc-container-reading"
            min-w="0"
            gap="$lgc-space-lg"
            grid
          >
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
                      <ClientOnly>
                        <LgcPostTimeWarning :frontmatter="frontmatter" />
                      </ClientOnly>
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

          <slot name="aside" />
        </div>
      </slot>
    </div>
  </main>
</template>

<style lang="scss">
@screen lg {
  .lgc-post-shell:has(> .lgc-post-aside) {
    max-width: var(--lgc-container-wide);
    grid-template-columns:
      minmax(0, calc(100% - var(--lgc-post-aside-width) - var(--lgc-space-lg)))
      var(--lgc-post-aside-width);
  }

  .lgc-post-aside-stack {
    --post-aside-stack-top: calc(var(--lgc-header-height) + var(--lgc-space-lg));
    --post-aside-stack-max-height: calc(
      100vh - var(--post-aside-stack-top) - var(--lgc-space-lg)
    );
    grid-template-rows: minmax(0, 1fr);
  }

  .lgc-post-aside-stack.has-post-toc {
    grid-template-rows: minmax(0, 1fr) minmax(0, 2fr);
  }

  .lgc-post-aside-stack.has-post-toc:has(
      > .lgc-collection-aside .lgc-collection-nav:not(.is-expanded)
    ) {
    grid-template-rows: auto minmax(0, 1fr);
  }

  .lgc-post-aside-stack > .lgc-collection-aside,
  .lgc-post-aside-stack > .lgc-post-aside {
    min-block-size: 0;
    max-block-size: 100%;
  }

  .lgc-post-aside-stack > .lgc-collection-aside,
  .lgc-post-aside-stack > .lgc-post-aside {
    block-size: 100%;
  }

  .lgc-post-aside-stack > .lgc-collection-aside .lgc-collection-aside-scroll,
  .lgc-post-aside-stack > .lgc-post-aside .lgc-post-outline-scroll {
    min-block-size: 0;
    max-block-size: none;
  }

  .lgc-post-aside-stack
    > .lgc-collection-aside:has(.lgc-collection-nav.is-expanded)
    .lgc-collection-aside-scroll,
  .lgc-post-aside-stack > .lgc-post-aside .lgc-post-outline-scroll {
    block-size: 100%;
  }
}

@screen xl {
  .lgc-post-shell:has(> .lgc-post-aside) {
    max-width: var(--lgc-container-reading);
    grid-template-columns: minmax(0, var(--lgc-container-reading));
  }

  .lgc-post-shell:has(> .lgc-post-aside) > .lgc-main-reading {
    grid-area: 1 / 1;
  }

  .lgc-post-shell:has(> .lgc-post-aside) > .lgc-post-aside {
    grid-area: 1 / 1;
    align-self: start;
    justify-self: start;
    inline-size: var(--lgc-post-aside-width);
    margin-inline-start: calc(100% + var(--lgc-space-lg));
  }

  .lgc-post-shell:has(> .lgc-collection-post-aside) > .lgc-collection-post-aside {
    grid-area: 1 / 1;
    align-self: start;
    justify-self: end;
    inline-size: var(--lgc-post-aside-width);
    margin-inline-end: calc(100% + var(--lgc-space-lg));
    margin-inline-start: 0;
  }

  .lgc-post-shell:has(> .lgc-collection-post-aside) > .lgc-post-toc-aside {
    grid-area: 1 / 1;
    align-self: start;
    justify-self: start;
    inline-size: var(--lgc-post-aside-width);
    margin-inline-start: calc(100% + var(--lgc-space-lg));
    margin-inline-end: 0;
  }
}
</style>
