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
  <footer class="lgc-footer va-footer">
    <div class="lgc-footer-inner">
      <div v-if="beian?.enable && beian.icp" class="lgc-footer-row lgc-footer-beian">
        <a
          :href="beian.icpLink || 'https://beian.miit.gov.cn/'"
          target="_blank"
          rel="noopener"
        >
          {{ beian.icp }}
        </a>

        <template v-if="beian.police && policeLink">
          <span class="lgc-footer-separator">/</span>
          <a :href="policeLink" target="_blank" rel="noreferrer">
            {{ beian.police }}
          </a>
        </template>
      </div>

      <div class="lgc-footer-row lgc-footer-copyright">
        <span>
          &copy;
          {{ copyrightYears }}
        </span>

        <a
          v-if="showFooterIcon"
          class="lgc-footer-icon"
          :class="{ 'is-animated': footerIcon?.animated }"
          :href="footerIconLink"
          target="_blank"
          rel="noopener"
          :title="footerIcon?.title"
          :style="{ color: footerIcon?.color }"
        >
          <span :class="footerIcon?.name" aria-hidden="true" />
        </a>

        <span>{{ $t(siteConfig.author.name) }}</span>
      </div>

      <div v-if="showPowered" class="lgc-footer-row lgc-footer-powered">
        <span v-html="poweredHtml" />
        <span class="lgc-footer-separator">/</span>
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
          <span class="lgc-footer-version">v{{ themeConfig.pkg.version }}</span>
        </span>
      </div>

      <slot />
    </div>
  </footer>
</template>

<style scoped lang="scss">
.lgc-footer {
  position: relative;
  flex: 0 0 auto;
  padding: var(--lgc-space-4xl) var(--lgc-space-lg) var(--lgc-space-3xl);
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--lgc-body-small);
  line-height: 1.8;
  text-align: center;
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

.lgc-footer-inner {
  display: grid;
  width: 100%;
  max-width: var(--lgc-container-reading);
  gap: 6px;
  margin-inline: auto;
}

.lgc-footer-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 10px;
}

.lgc-footer a {
  color: inherit;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: var(--md-sys-color-primary);
  }
}

.lgc-footer-copyright {
  color: var(--md-sys-color-on-surface);
  font-weight: 800;
}

.lgc-footer-icon {
  display: inline-grid;
  place-items: center;
  font-size: var(--lgc-body-large);

  &.is-animated {
    animation: lgc-footer-pulse 1.8s var(--lgc-easing-standard) infinite;
  }
}

.lgc-footer-powered {
  font-size: var(--lgc-label-medium);
}

.lgc-footer-separator,
:deep(.lgc-footer-version) {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.72;
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
