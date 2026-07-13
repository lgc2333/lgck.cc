<script setup lang="ts">
import { isEmptyAddon } from 'valaxy'
import * as addonWaline from 'valaxy-addon-waline/client/index.ts'

if (isEmptyAddon(addonWaline)) throw new Error('Please install valaxy-addon-waline')

const addon = addonWaline.useAddonWaline()
</script>

<template>
  <WalineClient
    w="full"
    :options="
      addon?.options || {
        serverURL: '',
      }
    "
  />
</template>
