<script setup lang="ts">
import { isEmptyAddon } from 'valaxy'
import * as addonWaline from 'valaxy-addon-waline/client/index.ts'
import { computed } from 'vue'

if (isEmptyAddon(addonWaline)) throw new Error('Please install valaxy-addon-waline')

const addon = addonWaline.useAddonWaline()
const walineOptions = computed(
  () =>
    addon.value?.options || {
      serverURL: '',
    },
)
</script>

<template>
  <WalineClient w="full" :options="walineOptions" />
</template>
