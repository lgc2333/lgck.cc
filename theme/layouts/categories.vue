<script setup lang="ts">
import { useCategories, useFrontmatter, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { CATEGORY_ROUTE_PATH, readCategoryRouteQuery } from '../utils/taxonomy'

const route = useRoute()
const fm = useFrontmatter()
const categories = useCategories()
const { t } = useI18n()
const { $tO } = useValaxyI18n()

const curCategory = computed(() => readCategoryRouteQuery(route.query.category))
const pageTitle = computed(() => $tO(fm.value.title) || t('menu.categories'))
const rootCategoryCount = computed(() => Array.from(categories.value.children).length)
</script>

<template>
  <LgcSiteShell>
    <LgcPageSurface>
      <LgcIndexSection
        id="categories"
        container="reading"
        flush
        label="Categories"
        :title="pageTitle"
        :description="t('counter.categories', rootCategoryCount)"
      >
        <template v-if="curCategory" #actions>
          <RouterLink
            class="lgc-category-clear"
            :to="CATEGORY_ROUTE_PATH"
            :aria-label="t('accessibility.category.clear')"
            :title="t('accessibility.category.clear')"
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </RouterLink>
        </template>

        <LgcCategoryTree
          class="lgc-main-panel lgc-category-panel"
          :active-category="curCategory"
          :categories="categories.children"
        />
      </LgcIndexSection>
    </LgcPageSurface>
  </LgcSiteShell>
</template>

<style scoped lang="scss">
.lgc-category-panel {
  @apply 'p-$lgc-space-lg md:p-$lgc-space-xl lg:p-$lgc-space-2xl';
}

.lgc-category-clear {
  @apply 'inline-flex items-center justify-center border-0 bg-transparent p-0';
  @apply 'h-$lgc-control-size-compact w-$lgc-control-size-compact rounded-$lgc-radius-control';
  @apply 'text-size-$lgc-icon-size text-$md-sys-color-on-surface no-underline cursor-pointer';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: background-color, border-radius, color, transform;
}

.lgc-category-clear:hover,
.lgc-category-clear:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-highest';
}

.lgc-category-clear:active {
  transform: scale(var(--lgc-control-press-scale));
}
</style>
