<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    closeLabel: string
    drawerLabel?: string
    id: string
    label: string
    show?: boolean
    title: string
    width?: string
  }>(),
  {
    show: true,
  },
)

const open = ref(false)

watch(
  () => props.show,
  (shown) => {
    if (!shown) open.value = false
  },
)

function openDrawer() {
  open.value = true
}

function closeDrawer() {
  open.value = false
}
</script>

<template>
  <LgcFloatingActionButton
    :show="show"
    :aria-controls="id"
    :aria-expanded="open"
    :label="label"
    mobile-only
    @click="openDrawer"
  >
    <slot name="icon" />
    <template v-if="$slots.detail" #detail>
      <slot name="detail" />
    </template>
  </LgcFloatingActionButton>

  <LgcSideDrawer
    :id="id"
    :open="open"
    :title="title"
    :label="drawerLabel || label"
    :close-label="closeLabel"
    :width="width"
    @close="closeDrawer"
  >
    <slot :close="closeDrawer" />
  </LgcSideDrawer>
</template>
