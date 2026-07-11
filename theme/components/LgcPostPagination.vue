<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  currentPage: number
  nextTo: string
  pages: number[]
  prevTo: string
  showNext: boolean
  showPrev: boolean
  totalPages: number
}>()

const { t } = useI18n()
</script>

<template>
  <nav
    v-if="totalPages > 1"
    flex="~ wrap justify-center"
    gap="[2px]"
    pt="$lgc-space-lg"
    :aria-label="t('accessibility.posts_pagination')"
  >
    <RouterLink
      v-if="showPrev"
      class="lgc-pagination-control"
      :to="prevTo"
      :aria-label="t('accessibility.prev_page')"
    >
      <span i-material-symbols-arrow-back-ios-new-rounded aria-hidden="true" />
    </RouterLink>

    <template v-for="page in pages" :key="`page-${page}`">
      <span
        v-if="page > 0 && currentPage === page"
        class="lgc-pagination-control is-active"
        aria-current="page"
      >
        {{ page }}
      </span>
      <RouterLink
        v-else-if="page > 0"
        class="lgc-pagination-control"
        :to="`/page/${page}`"
      >
        {{ page }}
      </RouterLink>
      <span v-else class="lgc-pagination-ellipsis" aria-hidden="true">...</span>
    </template>

    <RouterLink
      v-if="showNext"
      class="lgc-pagination-control"
      :to="nextTo"
      :aria-label="t('accessibility.next_page')"
    >
      <span i-material-symbols-arrow-forward-ios-rounded aria-hidden="true" />
    </RouterLink>
  </nav>
</template>
