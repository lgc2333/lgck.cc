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
  <nav v-if="totalPages > 1" class="lgc-post-pagination" aria-label="Posts pagination">
    <RouterLink
      v-if="showPrev"
      class="lgc-pagination-control"
      :to="prevTo"
      aria-label="Previous page"
    >
      <span i-material-symbols-keyboard-arrow-left-rounded aria-hidden="true" />
    </RouterLink>

    <template v-for="page in pages" :key="`page-${page}`">
      <RouterLink
        v-if="page > 0"
        class="lgc-pagination-control"
        :class="{ 'is-active': currentPage === page }"
        :to="page === 1 ? '/posts' : `/page/${page}`"
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
      <span i-material-symbols-keyboard-arrow-right-rounded aria-hidden="true" />
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.lgc-post-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 1rem;
}
</style>
