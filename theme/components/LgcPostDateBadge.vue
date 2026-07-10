<script setup lang="ts">
defineProps<{
  day: string
  rest: string
  datetime: string
}>()
</script>

<template>
  <time
    flex="~ col items-center justify-center"
    w="[84px] sm:[96px]"
    h="[84px] sm:[96px]"
    justify-self="start"
    rounded="$lgc-radius-large"
    text="$md-sys-color-on-primary-container"
    bg="$md-sys-color-primary-container"
    :datetime="datetime"
  >
    <strong text="size-$lgc-date-badge-day" leading-none>{{ day }}</strong>
    <span
      mt="$lgc-space-xs"
      text="size-$lgc-label-small"
      font="800"
      tracking="[0.08em]"
      uppercase
    >
      {{ rest }}
    </span>
  </time>
</template>
