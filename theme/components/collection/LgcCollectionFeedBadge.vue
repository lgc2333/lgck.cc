<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div
    class="lgc-post-date-badge text-$md-sys-color-on-primary-container"
    flex="~ col items-center justify-center"
    w="[84px] sm:[96px]"
    h="[84px] sm:[96px]"
    justify-self="start"
    rounded="$lgc-radius-large"
    bg="$md-sys-color-primary-container"
    role="img"
    :aria-label="t('collection.badge')"
  >
    <span
      class="text-size-$lgc-date-badge-day"
      i-material-symbols-auto-stories-rounded
      leading-none
      aria-hidden="true"
    />
    <span
      class="text-size-$lgc-label-small"
      mt="$lgc-space-xs"
      font="800"
      tracking="[0.08em]"
      uppercase
    >
      {{ t('collection.badge') }}
    </span>
  </div>
</template>
