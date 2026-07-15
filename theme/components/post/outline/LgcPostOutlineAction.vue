<script setup lang="ts">
import { useFrontmatter, useOutline } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const frontmatter = useFrontmatter()
const { t } = useI18n()
const { headers, handleClick } = useOutline()

const showAction = computed(() => {
  return (
    (route.meta.layout === 'post' || route.meta.layout === 'collection') &&
    frontmatter.value.aside !== false &&
    frontmatter.value.toc !== false &&
    headers.value.length > 0
  )
})

function onDrawerNavigate(event: MouseEvent, close: () => void) {
  handleClick(event)
  close()
}
</script>

<template>
  <LgcFloatingDrawerAction
    id="lgc-post-outline-drawer"
    :show="showAction"
    :label="t('accessibility.open_post_outline')"
    :drawer-label="t('accessibility.post_outline')"
    :title="t('post.outline')"
    :close-label="t('accessibility.close_post_outline')"
  >
    <template #icon>
      <span i-material-symbols-format-list-bulleted-rounded aria-hidden="true" />
    </template>

    <template #default="{ close }">
      <LgcPostOutline
        :headers="headers"
        :on-click="(event) => onDrawerNavigate(event, close)"
        :show-title="false"
        track-active
        @navigate="close"
      />
    </template>
  </LgcFloatingDrawerAction>
</template>
