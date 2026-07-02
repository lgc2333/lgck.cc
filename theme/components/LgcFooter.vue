<script lang="ts" setup>
import { useSiteConfig, useValaxyConfig, useValaxyI18n } from 'valaxy'
import pkg from 'valaxy/package.json' with { type: 'json' }
import { capitalize, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../composables'

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

function normalizeRepositoryUrl(repository?: string | { url?: string }) {
  const url = typeof repository === 'string' ? repository : repository?.url

  return url?.replace(/^git\+/, '').replace(/\.git$/, '') || ''
}

onMounted(() => {
  year.value = new Date().getFullYear()
})

const isThisYear = computed(() => !since.value || year.value === since.value)

const valaxyRepository = computed(() => normalizeRepositoryUrl(pkg.repository))
const themeRepository = computed(() =>
  normalizeRepositoryUrl(themeConfig.value.pkg.repository),
)
const footerIconUrl = computed(() => footerIcon.value?.url || themeRepository.value)

const poweredHtml = computed(() =>
  t('footer.powered', [
    `<a href="${valaxyRepository.value}" target="_blank" rel="noopener">Valaxy</a> <span class="lgc-footer-version">v${pkg.version}</span>`,
  ]),
)

const policeCode = computed(() => {
  const police = beian.value?.police
  if (!police) return ''

  return police.match(/(\d+)/)?.[1] || ''
})
</script>

<template>
  <footer class="lgc-footer va-footer">
    <div class="lgc-footer-inner">
      <div v-if="beian?.enable && beian.icp" class="lgc-footer-row">
        <a
          :href="beian.icpLink || 'https://beian.miit.gov.cn/'"
          target="_blank"
          rel="noopener"
        >
          {{ beian.icp }}
        </a>

        <template v-if="beian.police && policeCode">
          <span class="lgc-footer-separator">/</span>
          <a
            :href="`https://beian.mps.gov.cn/#/query/webSearch?code=${policeCode}`"
            target="_blank"
            rel="noreferrer"
          >
            {{ beian.police }}
          </a>
        </template>
      </div>

      <div class="lgc-footer-row lgc-footer-copyright">
        <span>
          &copy;
          <template v-if="!isThisYear">{{ since }} - </template>
          {{ year }}
        </span>

        <a
          v-if="showFooterIcon"
          class="lgc-footer-icon"
          :class="{ 'is-animated': footerIcon?.animated }"
          :href="footerIconUrl"
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
  padding: 2.5rem 1rem 2rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.8;
  text-align: center;
  background: linear-gradient(180deg, var(--md-sys-color-surface));
}

.lgc-footer-inner {
  display: grid;
  width: 100%;
  max-width: 900px;
  gap: 0.375rem;
  margin-inline: auto;
}

.lgc-footer-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem 0.625rem;
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
  font-size: 1rem;

  &.is-animated {
    animation: lgc-footer-pulse 1.8s var(--lgc-easing-standard) infinite;
  }
}

.lgc-footer-powered {
  font-size: 0.8125rem;
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
