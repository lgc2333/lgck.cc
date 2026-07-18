<script setup lang="ts">
import type { Post } from 'valaxy'
import { formatDate, orderByMeta, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    emptyText?: string
    order?: 'asc' | 'desc'
    posts: Post[]
  }>(),
  {
    order: 'desc',
  },
)

const { t } = useI18n()
const siteConfig = useSiteConfig()
const isDesc = computed(() => props.order !== 'asc')

const visiblePosts = computed(() =>
  props.posts.filter((post) => post.date && (!post.hide || post.hide === 'index')),
)
const timelineGroups = computed(() => {
  const byYear = new Map<number, Post[]>()

  visiblePosts.value.forEach((post) => {
    const year = Number(formatDate(post.date, { template: 'YYYY' }))
    if (!Number.isFinite(year)) return

    const posts = byYear.get(year)
    if (posts) posts.push(post)
    else byYear.set(year, [post])
  })

  return Array.from(byYear.keys())
    .sort((a, b) => (isDesc.value ? b - a : a - b))
    .map((year) => ({
      posts: orderByMeta(
        [...(byYear.get(year) || [])],
        siteConfig.value.orderBy,
        isDesc.value,
      ),
      year,
    }))
})
const emptyText = computed(() => props.emptyText || t('archive.empty'))
</script>

<template>
  <div class="lgc-post-timeline-surface lgc-main-panel lgc-reading-panel">
    <Transition
      v-if="timelineGroups.length"
      name="lgc-post-timeline-year"
      mode="out-in"
    >
      <div :key="order" grid gap="$lgc-space-xl">
        <section
          v-for="group in timelineGroups"
          :key="group.year"
          grid
          gap="$lgc-space-xs"
          :aria-labelledby="`lgc-post-timeline-year-${group.year}`"
        >
          <h2
            :id="`lgc-post-timeline-year-${group.year}`"
            m="0"
            text="$md-sys-color-primary size-$lgc-title-large"
            font="900"
            leading-tight
            tracking-normal
          >
            {{ group.year }}
          </h2>

          <ol class="lgc-post-timeline-list" m="0" p="0" list-none grid>
            <li v-for="(post, index) in group.posts" :key="post.path || index">
              <LgcPostTimelineItem
                :post="post"
                :first="index === 0"
                :last="index === group.posts.length - 1"
              />
            </li>
          </ol>
        </section>
      </div>
    </Transition>

    <p
      v-else
      m="0"
      p="$lgc-space-2xl"
      rounded="$lgc-radius-large"
      bg="$md-sys-color-surface-container"
      text="$md-sys-color-on-surface-variant"
    >
      {{ emptyText }}
    </p>
  </div>
</template>

<style scoped lang="scss">
// Residual: timeline item stems use pseudo-elements anchored to the date/dot grid.
.lgc-post-timeline-list {
  --lgc-post-timeline-date-column: 2.75rem;
  --lgc-post-timeline-dot-size: 0.75rem;
  --lgc-post-timeline-column-gap: var(--lgc-space-sm);
  --lgc-post-timeline-row-height: calc(
    var(--lgc-control-size-sm) + var(--lgc-space-lg)
  );
  --lgc-post-timeline-stem-width: 2px;
  --lgc-post-timeline-stem-inline: calc(
    var(--lgc-post-timeline-date-column) + var(--lgc-post-timeline-column-gap) +
      var(--lgc-post-timeline-dot-size) / 2 - var(--lgc-post-timeline-stem-width) / 2
  );
}

// Residual: route-level order changes fade the whole timeline block.
.lgc-post-timeline-year-enter-active,
.lgc-post-timeline-year-leave-active {
  transition: opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-post-timeline-year-enter-from,
.lgc-post-timeline-year-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lgc-post-timeline-year-enter-active,
  .lgc-post-timeline-year-leave-active {
    transition: none;
  }
}
</style>
