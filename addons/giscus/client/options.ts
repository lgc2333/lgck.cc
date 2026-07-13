import { useAddonConfig } from 'valaxy'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import type { GiscusOptions } from '../types'

export function useAddonGiscus() {
  return useAddonConfig<GiscusOptions>('valaxy-addon-giscus')
}

export function useAddonGiscusOptions(
  overrides?: MaybeRefOrGetter<Partial<GiscusOptions> | undefined>,
) {
  const addon = useAddonGiscus()

  return computed<GiscusOptions | undefined>(() => {
    const options = addon.value?.options
    if (!options) return

    return {
      ...options,
      ...toValue(overrides),
    }
  })
}
