<script setup lang="ts">
import { useFrontmatter, useOutline } from 'valaxy'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const frontmatter = useFrontmatter()
const { t } = useI18n()
const { headers, handleClick } = useOutline()
const drawerOpen = ref(false)

const showAction = computed(() => {
  return (
    (route.meta.layout === 'post' || route.meta.layout === 'collection') &&
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})

watch(showAction, (shown) => {
  if (!shown) drawerOpen.value = false
})

function closeDrawer() {
  drawerOpen.value = false
}

function openDrawer() {
  drawerOpen.value = true
}

function onDrawerNavigate(event: MouseEvent) {
  handleClick(event)
  closeDrawer()
}
</script>

<template>
  <LgcFloatingActionButton
    :show="showAction"
    aria-controls="lgc-post-outline-drawer"
    :aria-expanded="drawerOpen"
    :label="t('accessibility.open_post_outline')"
    mobile-only
    @click="openDrawer"
  >
    <span i-material-symbols-format-list-bulleted-rounded aria-hidden="true" />
  </LgcFloatingActionButton>

  <LgcSideDrawer
    id="lgc-post-outline-drawer"
    :open="drawerOpen"
    :title="t('post.outline')"
    :label="t('accessibility.post_outline')"
    :close-label="t('accessibility.close_post_outline')"
    @close="closeDrawer"
  >
    <LgcPostOutline
      :headers="headers"
      :on-click="onDrawerNavigate"
      :show-title="false"
      track-active
      @navigate="closeDrawer"
    />
  </LgcSideDrawer>
</template>
