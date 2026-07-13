<script setup lang="ts">
import 'artalk/dist/Artalk.css'
import { getAddonModule, isEmptyAddon } from 'valaxy'
import * as addonArtalk from 'valaxy-addon-artalk/client/index.ts'

if (!isEmptyAddon(addonArtalk)) {
  getAddonModule<{ useArtalkWithOptions?: () => void }>(
    addonArtalk,
  ).useArtalkWithOptions?.()
}
</script>

<template>
  <div id="ArtalkComment" w="full" />
</template>
