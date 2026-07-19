<script setup lang="ts">
import { useFrontmatter, useSiteStore, useTags, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { normalizePostListValue } from '../utils/post'
import { TAG_ROUTE_PATH, readTagRouteQuery } from '../utils/taxonomy'

type TagTone = 'high' | 'low' | 'medium'

const route = useRoute()
const fm = useFrontmatter()
const site = useSiteStore()
const tags = useTags()
const { locale, t } = useI18n()
const { $tO, $tTag } = useValaxyI18n()

const curTag = computed(() => readTagRouteQuery(route.query.tag))
const pageTitle = computed(() => $tO(fm.value.title) || t('menu.tags'))
const tagEntries = computed(() => {
  const entries = Array.from(tags.value, ([name, tag]) => ({
    count: tag.count,
    label: $tTag(name),
    name,
  }))
  const counts = entries.map((entry) => entry.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)

  return entries
    .map((entry) => ({
      ...entry,
      tone: getTagTone(entry.count, min, max),
    }))
    .sort((a, b) => {
      const countOrder = b.count - a.count
      if (countOrder !== 0) return countOrder
      return a.label.localeCompare(b.label, locale.value)
    })
})
const timelinePosts = computed(() =>
  site.postList.filter((post) =>
    normalizePostListValue(post.tags).includes(curTag.value),
  ),
)
const selectedTagLabel = computed(() => (curTag.value ? $tTag(curTag.value) : ''))
const pageDescription = computed(() =>
  curTag.value
    ? t('tag.selected', { name: selectedTagLabel.value })
    : t('counter.tags', tagEntries.value.length),
)
const timelineEmptyText = computed(() =>
  t('tag.empty', { name: selectedTagLabel.value }),
)

function getTagTone(count: number, min: number, max: number): TagTone {
  const range = max - min
  if (range <= 0) return 'low'

  const ratio = (count - min) / range
  if (ratio >= 0.67) return 'high'
  if (ratio >= 0.34) return 'medium'
  return 'low'
}
</script>

<template>
  <LgcSiteShell>
    <LgcPageSurface>
      <LgcIndexSection
        id="tags"
        container="reading"
        flush
        label="Tags"
        :title="pageTitle"
        :description="pageDescription"
      >
        <template v-if="curTag" #actions>
          <RouterLink
            class="lgc-tag-clear"
            :to="TAG_ROUTE_PATH"
            :aria-label="t('accessibility.tag.clear')"
            :title="t('accessibility.tag.clear')"
            h="$lgc-control-size-compact"
            w="$lgc-control-size-compact"
            border="0"
            rounded="$lgc-radius-control"
            bg="transparent"
            p="0"
            text-size="$lgc-icon-size"
            no-underline
            inline-flex
            cursor-pointer
            items-center
            justify-center
          >
            <span i-material-symbols-close-rounded aria-hidden="true" />
          </RouterLink>
        </template>

        <div grid gap="$lgc-space-lg">
          <LgcTagChips
            v-if="tagEntries.length"
            class="lgc-main-panel lgc-reading-panel"
            :active-tag="curTag"
            :aria-label="t('accessibility.tag.list')"
            :tags="tagEntries"
          />

          <Transition name="lgc-tag-timeline-surface" mode="out-in" appear>
            <LgcPostTimeline
              v-if="curTag"
              :key="curTag"
              :posts="timelinePosts"
              :empty-text="timelineEmptyText"
            />
          </Transition>
        </div>
      </LgcIndexSection>
    </LgcPageSurface>
  </LgcSiteShell>
</template>

<style scoped lang="scss">
.lgc-tag-clear {
  @apply 'text-$md-sys-color-on-surface';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: background-color, border-radius, color, transform;
}

.lgc-tag-clear:hover,
.lgc-tag-clear:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-highest';
}

.lgc-tag-clear:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-tag-timeline-surface-enter-active,
.lgc-tag-timeline-surface-leave-active {
  transition-property: opacity, transform;
  transition-duration: var(--lgc-motion-medium);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-tag-timeline-surface-enter-from,
.lgc-tag-timeline-surface-leave-to {
  opacity: 0;
  transform: translateY(var(--lgc-space-md));
}

@media (prefers-reduced-motion: reduce) {
  .lgc-tag-timeline-surface-enter-active,
  .lgc-tag-timeline-surface-leave-active {
    transition: none;
  }

  .lgc-tag-timeline-surface-enter-from,
  .lgc-tag-timeline-surface-leave-to {
    transform: none;
  }

  .lgc-tag-clear:active {
    transform: none;
  }
}
</style>
