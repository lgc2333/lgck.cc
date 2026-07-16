<script setup lang="ts">
import { useFrontmatter, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { $tO } = useValaxyI18n()
const fm = useFrontmatter()

const collectionKeys = computed(() => {
  const keys = fm.value.collections as unknown
  return Array.isArray(keys) ? keys.map(String) : undefined
})
const pageTitle = computed(() => $tO(fm.value.title) || t('collection.all'))
</script>

<template>
  <LgcSiteShell>
    <LgcPageSurface>
      <LgcPostFeed
        flush
        source="collections"
        :collection-keys="collectionKeys"
        label="Collections"
        :limit="0"
        :title="pageTitle"
      />
    </LgcPageSurface>
  </LgcSiteShell>
</template>
