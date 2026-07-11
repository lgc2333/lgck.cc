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
const valaxyLinkHtml = computed(
  () =>
    `<a href="${valaxyRepository.value}" target="_blank" rel="noopener">Valaxy</a> <span class="lgc-footer-version">v${pkg.version}</span>`,
)
const poweredHtml = computed(() => t('footer.powered', [valaxyLinkHtml.value]))
</script>

<template>
  <footer
    class="lgc-footer va-footer [&_.lgc-footer-version]:text-$md-sys-color-on-surface-variant [&_.lgc-footer-version]:opacity-72"
    flex-none
    relative
    px="$lgc-space-lg"
    pt="$lgc-space-4xl"
    pb="$lgc-space-3xl"
    text="$md-sys-color-on-surface-variant size-$lgc-body-small center"
    leading="[1.8]"
  >
    <div w="full" max-w="$lgc-container-reading" gap="1.5" mx-auto grid>
      <div
        v-if="beian?.enable && beian.icp"
        flex="~ wrap items-center justify-center"
        gap-x="2.5"
        gap-y="1.5"
      >
        <a
          :href="beian.icpLink || 'https://beian.miit.gov.cn/'"
          target="_blank"
          rel="noopener"
        >
          {{ beian.icp }}
        </a>

        <template v-if="beian.police && policeLink">
          <span text="$md-sys-color-on-surface-variant" opacity-72> / </span>
          <a :href="policeLink" target="_blank" rel="noreferrer">
            {{ beian.police }}
          </a>
        </template>
      </div>

      <div
        flex="~ wrap items-center justify-center"
        gap-x="2.5"
        gap-y="1.5"
        text="$md-sys-color-on-surface"
        font="800"
      >
        <span>
          &copy;
          {{ copyrightYears }}
        </span>

        <a
          v-if="showFooterIcon"
          class="lgc-footer-icon"
          inline-grid
          place-items="center"
          :class="{ 'is-animated': footerIcon?.animated }"
          :href="footerIconLink"
          target="_blank"
          rel="noopener"
          :title="footerIcon?.title"
          :style="{ color: footerIcon?.color }"
        >
          <!-- font-size on icon host; never text= on <a> (legacy .text prop) -->
          <span
            class="text-size-$lgc-body-large"
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
        gap-y="1.5"
        text="size-$lgc-label-medium"
      >
        <span v-html="poweredHtml" />
        <span text="$md-sys-color-on-surface-variant" opacity-72> / </span>
        <span>
          {{ t('footer.theme') }}
          <a
            :href="themeRepository"
            :title="themeConfig.pkg.name"
            target="_blank"
            rel="noopener"
          >
            {{ capitalize(config.theme) }}
          </a>
          <span
            class="lgc-footer-version"
            text="$md-sys-color-on-surface-variant"
            opacity-72
          >
            v{{ themeConfig.pkg.version }}
          </span>
        </span>
      </div>

      <slot />
    </div>
  </footer>
</template>

<style scoped lang="scss">
// Residual: multi-stop footer fade gradient + pulse keyframes.
.lgc-footer {
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

// Anchor hover cascade (multiple footer links) — multi-use @apply, not residual props.
.lgc-footer a {
  @apply 'text-inherit font-700 no-underline hover:text-$md-sys-color-primary';
}

.lgc-footer-icon.is-animated {
  animation: lgc-footer-pulse 1.8s var(--lgc-easing-standard) infinite;
}

@keyframes lgc-footer-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}
</style>
