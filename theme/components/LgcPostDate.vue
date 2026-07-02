<script lang="ts" setup>
import { formatDate } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  date?: Date | number | string
}>()

const datetime = computed(() => formatDate(props.date || ''))
</script>

<template>
  <time class="lgc-date" :datetime="datetime">{{ datetime }}</time>
</template>

<style scoped lang="scss">
.lgc-date {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
}
</style>
