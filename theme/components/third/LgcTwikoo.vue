<script setup lang="ts">
import { getAddonModule, isEmptyAddon } from 'valaxy'
import * as addonTwikoo from 'valaxy-addon-twikoo/client/index.ts'
import 'valaxy-addon-twikoo/client/styles/index.scss'

if (!isEmptyAddon(addonTwikoo)) {
  getAddonModule<{ useTwikooWithOptions: () => void }>(
    addonTwikoo,
  ).useTwikooWithOptions()
}
</script>

<template>
  <div>
    <div id="tcomment" w="full" />
  </div>
</template>
