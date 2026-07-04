<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  autofocus?: boolean
  focusKey?: number
  hasIcon?: boolean
  open?: boolean
  placeholder: string
}>()

const emit = defineEmits<{
  keydown: [event: KeyboardEvent]
}>()
const model = defineModel<string>({ required: true })

const inputRef = ref<HTMLInputElement>()

watch(
  () => [props.autofocus, props.focusKey] as const,
  async ([autofocus]) => {
    if (autofocus) await focus()
  },
  { immediate: true },
)

async function focus() {
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

defineExpose({ focus })
</script>

<template>
  <label class="lgc-search-field" :class="{ 'has-icon': hasIcon, 'is-open': open }">
    <span v-if="hasIcon" i-material-symbols-search-rounded aria-hidden="true" />
    <input
      ref="inputRef"
      v-model="model"
      type="search"
      :placeholder="placeholder"
      aria-label="Search"
      @keydown.stop="emit('keydown', $event)"
    />
  </label>
</template>
