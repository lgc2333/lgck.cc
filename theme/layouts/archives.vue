<script setup lang="ts">
import { useFrontmatter, usePostListWithCollections, useValaxyI18n } from 'valaxy'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { $tO } = useValaxyI18n()
const fm = useFrontmatter()
const posts = usePostListWithCollections()
const isDesc = ref(true)

const pageTitle = computed(() => $tO(fm.value.title) || t('menu.archives'))
const archivePostCount = computed(
  () =>
    posts.value.filter((post) => post.date && (!post.hide || post.hide === 'index'))
      .length,
)
const archiveOrder = computed(() => (isDesc.value ? 'desc' : 'asc'))
const orderActionLabel = computed(() =>
  isDesc.value ? t('archive.sort_oldest') : t('archive.sort_newest'),
)
</script>

<template>
  <LgcSiteShell>
    <LgcPageSurface>
      <LgcIndexSection
        id="archives"
        container="reading"
        flush
        label="Archives"
        :title="pageTitle"
        :description="t('counter.archives', archivePostCount)"
      >
        <template #actions>
          <button
            v-if="archivePostCount > 1"
            class="lgc-archive-order"
            type="button"
            :aria-label="orderActionLabel"
            :title="orderActionLabel"
            @click="isDesc = !isDesc"
          >
            <span
              v-if="isDesc"
              i-material-symbols-arrow-downward-rounded
              aria-hidden="true"
            />
            <span v-else i-material-symbols-arrow-upward-rounded aria-hidden="true" />
          </button>
        </template>

        <LgcPostTimeline :posts="posts" :order="archiveOrder" />
      </LgcIndexSection>
    </LgcPageSurface>
  </LgcSiteShell>
</template>

<style scoped lang="scss">
.lgc-archive-order {
  @apply 'inline-flex items-center justify-center border-0 bg-transparent p-0';
  @apply 'min-h-$lgc-control-size-sm w-$lgc-control-size-sm rounded-$lgc-radius-control';
  @apply 'text-size-$lgc-icon-size text-$md-sys-color-on-surface-variant cursor-pointer';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: background-color, border-radius, color, transform;
}

.lgc-archive-order:hover,
.lgc-archive-order:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-highest';
}

.lgc-archive-order:active {
  transform: scale(var(--lgc-control-press-scale));
}
</style>
