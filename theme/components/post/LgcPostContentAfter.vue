<script setup lang="ts">
import { useFrontmatter, useFullUrl, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

import { useThemeConfig } from '../../composables'

const siteConfig = useSiteConfig()
const frontmatter = useFrontmatter()
const themeConfig = useThemeConfig()
const url = useFullUrl()

const showSponsorByFrontmatter = computed(() => {
  if (typeof frontmatter.value.sponsor === 'boolean') return frontmatter.value.sponsor

  return siteConfig.value.sponsor.enable
})

const sponsorLink = computed(
  () => themeConfig.value.postFooter?.sponsor?.link?.trim() || '',
)

const sponsorMethods = computed(() =>
  (siteConfig.value.sponsor.methods || []).filter((method) => Boolean(method.url)),
)

const sponsorVariant = computed<'link' | 'methods' | ''>(() => {
  if (!showSponsorByFrontmatter.value) return ''
  if (sponsorLink.value) return 'link'
  if (sponsorMethods.value.length) return 'methods'
  return ''
})

const showCopyright = computed(() => {
  return (
    frontmatter.value.copyright ||
    (frontmatter.value.copyright !== false && siteConfig.value.license.enabled)
  )
})

const hasContent = computed(() => Boolean(sponsorVariant.value || showCopyright.value))
</script>

<template>
  <div v-if="hasContent" class="lgc-post-content-after" grid gap="$lgc-space-lg">
    <LgcPostSponsor
      v-if="sponsorVariant"
      :description="siteConfig.sponsor.description"
      :link="sponsorLink"
      :methods="sponsorMethods"
      :title="siteConfig.sponsor.title"
      :variant="sponsorVariant"
    />

    <section
      v-if="showCopyright"
      class="lgc-post-copyright-panel"
      grid
      gap="$lgc-space-md"
      relative
      overflow-hidden
      p="$lgc-space-xl"
      rounded="$lgc-radius-large"
      bg="$md-sys-color-surface-container-low"
      text="$md-sys-color-on-surface"
    >
      <ValaxyCopyright class="lgc-post-copyright" :url="url" />
    </section>
  </div>
</template>

<style scoped lang="scss">
// Residual: core ValaxyCopyright owns internal markup; theme overrides its root.
.lgc-post-content-after {
  @apply 'mt-$lgc-space-3xl';
}

.lgc-post-copyright {
  @apply 'relative z-1 m-0 p-0 border-0 list-none bg-transparent';
  @apply 'text-size-$lgc-body-small leading-relaxed';
  @apply 'text-$md-sys-color-on-surface-variant';
  word-break: break-word;
}

// Decorative Creative Commons watermark, matching Valaxy/Yun's right-side mark.
.lgc-post-copyright-panel::after {
  @apply 'pointer-events-none absolute bg-$md-sys-color-primary op-10';
  content: '';
  inline-size: 11.5rem;
  block-size: 11.5rem;
  inset-block-start: 50%;
  inset-inline-end: -2.125rem;
  transform: translateY(-50%);
  mask: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath fill='black' d='M245.8 214.9l-33.2 17.3c-9.4-19.6-25.2-20-27.4-20-22.2 0-33.3 14.6-33.3 43.9 0 23.5 9.2 43.8 33.3 43.8 14.4 0 24.6-7 30.5-21.3l30.6 15.5a73.2 73.2 0 01-65.1 39c-22.6 0-74-10.3-74-77 0-58.7 43-77 72.6-77 30.8-.1 52.7 11.9 66 35.8zm143 0l-32.7 17.3c-9.5-19.8-25.7-20-27.9-20-22.1 0-33.2 14.6-33.2 43.9 0 23.5 9.2 43.8 33.2 43.8 14.5 0 24.7-7 30.5-21.3l31 15.5c-2 3.8-21.3 39-65 39-22.7 0-74-9.9-74-77 0-58.7 43-77 72.6-77C354 179 376 191 389 214.8zM247.7 8C104.7 8 0 123 0 256c0 138.4 113.6 248 247.6 248C377.5 504 496 403 496 256 496 118 389.4 8 247.6 8zm.8 450.8c-112.5 0-203.7-93-203.7-202.8 0-105.5 85.5-203.3 203.8-203.3A201.7 201.7 0 01451.3 256c0 121.7-99.7 202.9-202.9 202.9z'/%3E%3C/svg%3E")
    center / contain no-repeat;
  -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath fill='black' d='M245.8 214.9l-33.2 17.3c-9.4-19.6-25.2-20-27.4-20-22.2 0-33.3 14.6-33.3 43.9 0 23.5 9.2 43.8 33.3 43.8 14.4 0 24.6-7 30.5-21.3l30.6 15.5a73.2 73.2 0 01-65.1 39c-22.6 0-74-10.3-74-77 0-58.7 43-77 72.6-77 30.8-.1 52.7 11.9 66 35.8zm143 0l-32.7 17.3c-9.5-19.8-25.7-20-27.9-20-22.1 0-33.2 14.6-33.2 43.9 0 23.5 9.2 43.8 33.2 43.8 14.5 0 24.7-7 30.5-21.3l31 15.5c-2 3.8-21.3 39-65 39-22.7 0-74-9.9-74-77 0-58.7 43-77 72.6-77C354 179 376 191 389 214.8zM247.7 8C104.7 8 0 123 0 256c0 138.4 113.6 248 247.6 248C377.5 504 496 403 496 256 496 118 389.4 8 247.6 8zm.8 450.8c-112.5 0-203.7-93-203.7-202.8 0-105.5 85.5-203.3 203.8-203.3A201.7 201.7 0 01451.3 256c0 121.7-99.7 202.9-202.9 202.9z'/%3E%3C/svg%3E")
    center / contain no-repeat;
}

.lgc-post-copyright::after {
  display: none;
}

.lgc-post-copyright :deep(li) {
  @apply 'my-$lgc-space-xs';
}

.lgc-post-copyright :deep(strong) {
  @apply 'text-$md-sys-color-on-surface font-900';
}

.lgc-post-copyright :deep(a) {
  @apply 'text-$md-sys-color-primary underline underline-offset-3';
}
</style>
