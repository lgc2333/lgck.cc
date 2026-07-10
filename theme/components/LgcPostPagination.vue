<script setup lang="ts">
defineProps<{
  currentPage: number
  nextTo: string
  pages: number[]
  prevTo: string
  showNext: boolean
  showPrev: boolean
  totalPages: number
}>()
</script>

<template>
  <nav
    v-if="totalPages > 1"
    flex="~ wrap justify-center"
    gap="[2px]"
    pt="$lgc-space-lg"
    aria-label="Posts pagination"
  >
    <RouterLink
      v-if="showPrev"
      class="lgc-pagination-control"
      :to="prevTo"
      aria-label="Previous page"
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
      aria-label="Next page"
    >
      <span i-material-symbols-arrow-forward-ios-rounded aria-hidden="true" />
    </RouterLink>
  </nav>
</template>
