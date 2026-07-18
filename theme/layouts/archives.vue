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
  isDesc.value
    ? t('accessibility.archive.sort_oldest')
    : t('accessibility.archive.sort_newest'),
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
              i-material-symbols-list-arrow-rounded
              class="lgc-archive-order-icon"
              :class="{ 'is-ascending': !isDesc }"
              aria-hidden="true"
            />
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
  @apply 'h-$lgc-control-size-compact w-$lgc-control-size-compact rounded-$lgc-radius-control';
  @apply 'text-size-$lgc-icon-size text-$md-sys-color-on-surface cursor-pointer';
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

.lgc-archive-order-icon.is-ascending {
  transform: scaleY(-1);
}
</style>
