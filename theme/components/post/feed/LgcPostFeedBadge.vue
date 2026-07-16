<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'div' | 'time'
  }>(),
  {
    as: 'div',
  },
)
</script>

<template>
  <component
    :is="as"
    class="lgc-post-date-badge"
    flex="~ col items-center justify-center"
    w="[84px] sm:[96px]"
    h="[84px] sm:[96px]"
    justify-self="start"
    rounded="$lgc-radius-large"
    text="$md-sys-color-on-primary-container"
    bg="$md-sys-color-primary-container"
  >
    <span text="size-$lgc-date-badge-day" leading-none>
      <slot />
    </span>
    <span
      mt="$lgc-space-xs"
      text="size-$lgc-label-small"
      font="800"
      tracking="[0.08em]"
      uppercase
    >
      <slot name="label" />
    </span>
  </component>
</template>
