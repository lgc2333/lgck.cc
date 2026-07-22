<script setup lang="ts">
import afdianSvg from '../public/sponsors/afdian.svg?raw'
import { prefixSponsorSvgClipPathIds } from '../utils/sponsor-svg'

const prefixedAfdianSvg = prefixSponsorSvgClipPathIds(afdianSvg, 'afdian')
</script>

<template>
  <div
    class="m-auto h-auto w-full [&>svg]:h-auto [&>svg]:max-w-full"
    v-html="prefixedAfdianSvg"
  />
</template>
