<script lang="ts" setup>
import LgcFooterOriginal from 'valaxy-theme-lgcuwukii/components/LgcFooter.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <LgcFooterOriginal>
    <VCLiveTime start-time="2024-04-09 19:25" class="[&>[mx-1]]:mr-0!">
      <template #live-time-before>
        <span>{{ t('footer.from_first_commit_start') }}</span>
      </template>
      <template #live-time-after>
        <span ml-1>{{ t('footer.from_first_commit_end') }}</span>
      </template>
    </VCLiveTime>

    <VCLiveTime start-time="2026-06-30 21:08" class="[&>[mx-1]]:mr-0!">
      <template #live-time-before>
        <span>{{ t('footer.from_theme_refactor_start') }}</span>
      </template>
      <template #live-time-after>
        <span ml-1>{{ t('footer.from_theme_refactor_end') }}</span>
      </template>
    </VCLiveTime>
  </LgcFooterOriginal>
</template>
