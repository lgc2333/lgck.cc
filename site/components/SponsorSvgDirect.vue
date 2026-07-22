<script setup lang="ts">
import directSvg from '../public/sponsors/direct.svg?raw'
import { prefixSponsorSvgClipPathIds } from '../utils/sponsor-svg'

const prefixedDirectSvg = prefixSponsorSvgClipPathIds(directSvg, 'direct')
</script>

<template>
  <div
    class="m-auto h-auto w-full [&>svg]:h-auto [&>svg]:max-w-full"
    v-html="prefixedDirectSvg"
  />
</template>
