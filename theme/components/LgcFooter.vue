<script lang="ts" setup>
import { useSiteConfig, useValaxyConfig, useValaxyI18n } from 'valaxy'
import pkg from 'valaxy/package.json' with { type: 'json' }
import { capitalize, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../composables'
import { normalizeRepositoryUrl } from '../utils/repository'

const { t } = useI18n()
const { $t } = useValaxyI18n()
const config = useValaxyConfig()
const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()

/** Slug `lgcuwukii` is not title-case-friendly. */
const themeDisplayName = computed(() =>
  config.value.theme === 'lgcuwukii' ? 'LgCuwukii' : capitalize(config.value.theme),
)

const footer = computed(() => themeConfig.value.footer || {})
const since = computed(() => footer.value.since)
const footerIcon = computed(() => footer.value.icon)
const showFooterIcon = computed(
  () => footerIcon.value?.enable === true && footerIcon.value.name,
)
const showPowered = computed(() => footer.value.powered === true)
const beian = computed(() => footer.value.beian)
const year = ref(new Date().getFullYear())

onMounted(() => {
  year.value = new Date().getFullYear()
})

const isThisYear = computed(() => !since.value || year.value === since.value)
const valaxyRepository = computed(() => normalizeRepositoryUrl(pkg.repository))
const themeRepository = computed(() =>
  normalizeRepositoryUrl(themeConfig.value.pkg.repository),
)
const policeCode = computed(() => {
  const police = beian.value?.police
  if (!police) return ''

  return police.match(/(\d+)/)?.[1] || ''
})
const policeLink = computed(() =>
  policeCode.value
    ? `https://beian.mps.gov.cn/#/query/webSearch?code=${policeCode.value}`
    : '',
)

const copyrightYears = computed(() => {
  if (isThisYear.value) return String(year.value)
  return `${since.value} - ${year.value}`
})
const footerIconLink = computed(() => footerIcon.value?.url || themeRepository.value)
</script>

<template>
  <footer
    class="lgc-footer va-footer"
    flex="~ col"
    flex-none
    items-center
    justify-center
    relative
    px="$lgc-space-lg"
    py="$lgc-space-lg"
    min-h="$lgc-footer-min-h"
    text="$md-sys-color-on-surface-variant size-$lgc-body-small center"
    leading="[1.8]"
  >
    <div w="full" max-w="$lgc-container-reading" gap="0" mx-auto shrink-0 grid>
      <div
        v-if="beian?.enable && beian.icp"
        flex="~ wrap items-center justify-center"
        gap-x="2.5"
        gap-y="0"
      >
        <a
          :href="beian.icpLink || 'https://beian.miit.gov.cn/'"
          target="_blank"
          rel="noopener"
        >
          {{ beian.icp }}
        </a>

        <template v-if="beian.police && policeLink">
          <span>/</span>
          <a
            :href="policeLink"
            target="_blank"
            rel="noreferrer"
            inline-flex
            items-center
            gap="1"
          >
            <img
              src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png"
              alt=""
              w="4"
              h="4"
              inline-block
              aria-hidden="true"
            />
            {{ beian.police }}
          </a>
        </template>
      </div>

      <div flex="~ wrap items-center justify-center" gap-x="2.5" gap-y="0">
        <span>&copy; {{ copyrightYears }}</span>

        <a
          v-if="showFooterIcon"
          inline-grid
          place-items="center"
          :href="footerIconLink"
          target="_blank"
          rel="noopener"
          :title="footerIcon?.title"
          :style="{ color: footerIcon?.color }"
        >
          <!-- size on icon host; never text= on <a> (legacy .text prop) -->
          <span
            class="text-size-$lgc-body-small"
            :class="footerIcon?.name"
            aria-hidden="true"
          />
        </a>

        <span>{{ $t(siteConfig.author.name) }}</span>
      </div>

      <div
        v-if="showPowered"
        flex="~ wrap items-center justify-center"
        gap-x="2.5"
        gap-y="0"
      >
        <i18n-t keypath="footer.powered" tag="span">
          <span>
            <a :href="valaxyRepository" target="_blank" rel="noopener"> Valaxy </a>
            <span> v{{ pkg.version }}</span>
          </span>
        </i18n-t>
        <span>/</span>
        <span>
          {{ t('footer.theme') }}
          <a
            :href="themeRepository"
            :title="themeConfig.pkg.name"
            target="_blank"
            rel="noopener"
          >
            {{ themeDisplayName }}
          </a>
          <span> v{{ themeConfig.pkg.version }}</span>
        </span>
      </div>

      <slot />
    </div>
  </footer>
</template>

<style scoped lang="scss">
// Residual: multi-stop footer fade gradient + min-h calc
// (one-line height = former pt 4xl + pb 3xl + 1lh).
.lgc-footer {
  --lgc-footer-min-h: calc(var(--lgc-space-4xl) + var(--lgc-space-3xl) + 1lh);

  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--md-sys-color-surface-container) 0%, transparent) 0%,
    color-mix(in srgb, var(--md-sys-color-surface-container) 4%, transparent) 18%,
    color-mix(in srgb, var(--md-sys-color-surface-container) 14%, transparent) 38%,
    color-mix(in srgb, var(--md-sys-color-surface-container) 34%, transparent) 58%,
    color-mix(in srgb, var(--md-sys-color-surface-container) 62%, transparent) 78%,
    color-mix(in srgb, var(--md-sys-color-surface-container) 86%, transparent) 92%,
    var(--md-sys-color-surface-container) 100%
  );
}

// Anchor hover/focus cascade (multiple footer links) — multi-use @apply.
.lgc-footer a {
  @apply 'text-inherit font-inherit no-underline';
}

.lgc-footer a:hover,
.lgc-footer a:focus-visible {
  @apply 'text-$md-sys-color-primary underline';
}
</style>
