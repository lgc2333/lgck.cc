import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFixedBg } from './fixedBg'

export function useFixedBgPresenter() {
  const { t } = useI18n()
  const { canSwitchImage, isSwitching, switchNow, visibleImage } = useFixedBg()

  const actionHref = computed(() => {
    const image = visibleImage.value
    return image?.sourceUrl || image?.url || ''
  })
  const title = computed(() => visibleImage.value?.title || t('fixed_bg.unknown_title'))
  const author = computed(() => visibleImage.value?.author)
  const description = computed(() => visibleImage.value?.description)
  const switchLabel = computed(() =>
    isSwitching.value ? t('fixed_bg.loading') : t('fixed_bg.refresh'),
  )

  function refresh() {
    if (isSwitching.value) return

    void switchNow()
  }

  return {
    actionHref,
    author,
    canSwitchImage,
    description,
    isSwitching,
    refresh,
    switchLabel,
    title,
    visibleImage,
  }
}
