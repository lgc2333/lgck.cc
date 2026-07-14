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

    <section v-if="showCopyright">
      <ValaxyCopyright
        class="lgc-post-copyright"
        :url="url"
        relative
        overflow-hidden
        rounded="$lgc-radius-large"
        bg="$md-sys-color-surface-container-low"
        text="$md-sys-color-on-surface"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
// Residual: core ValaxyCopyright owns internal markup; theme overrides its root.
.lgc-post-content-after {
  @apply 'mt-$lgc-space-3xl';
}

.lgc-post-copyright {
  @apply 'm-0 border-0 list-none p-$lgc-space-xl';
  @apply 'rounded-$lgc-radius-large bg-$md-sys-color-surface-container-low';
  @apply 'text-size-$lgc-body-small leading-relaxed';
  @apply 'text-$md-sys-color-on-surface-variant';
  word-break: break-word;
}

.lgc-post-copyright::after {
  width: 11.5rem;
  height: 11.5rem;
  top: 50%;
  right: -2.125rem;
  transform: translateY(-50%);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
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
