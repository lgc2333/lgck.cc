<script setup lang="ts">
import type { Categories, CategoryList, Post } from 'valaxy'
import { isCategoryList, useValaxyI18n } from 'valaxy'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { normalizeLocaleText } from '../../utils/post'
import { categoryRouteLocation } from '../../utils/taxonomy'

interface CategoryTreeRow {
  depth: number
  hasChildren: boolean
  isActive: boolean
  isExpanded: boolean
  isInActivePath: boolean
  key: string
  kind: 'category'
  label: string
  path: string
  total: number
}

interface PostTreeRow {
  depth: number
  key: string
  kind: 'post'
  label: string
  path: string
}

type TreeRow = CategoryTreeRow | PostTreeRow

const props = defineProps<{
  activeCategory?: string
  categories: Categories
}>()

const { t, locale } = useI18n()
const { $tCategory } = useValaxyI18n()

const expandedPaths = ref(new Set<string>())
const curCategory = computed(() => props.activeCategory || '')
const treeRows = computed(() =>
  flattenCategories(props.categories, '', 0, expandedPaths.value),
)

watch(
  curCategory,
  (value) => {
    if (!value) return

    const next = new Set(expandedPaths.value)
    const segments = value.split('/').filter(Boolean)
    segments.forEach((_, index) => {
      next.add(segments.slice(0, index + 1).join('/'))
    })
    expandedPaths.value = next
  },
  { immediate: true },
)

function flattenCategories(
  items: Categories,
  parentPath: string,
  depth: number,
  expanded: Set<string>,
): TreeRow[] {
  const rows: TreeRow[] = []
  const categoryItems: CategoryList[] = []
  const postItems: Post[] = []

  items.forEach((item) => {
    if (isCategoryList(item)) categoryItems.push(item)
    else postItems.push(item)
  })

  categoryItems.forEach((item) => {
    const path = parentPath ? `${parentPath}/${item.name}` : item.name
    const isActive = curCategory.value === path
    const isInActivePath = isCategoryInActivePath(path)
    const isExpanded = expanded.has(path) || isInActivePath

    rows.push({
      depth,
      hasChildren: item.children.size > 0,
      isActive,
      isExpanded,
      isInActivePath,
      key: `category:${path}`,
      kind: 'category',
      label: translateCategoryName(item.name),
      path,
      total: item.total,
    })

    if (isExpanded)
      rows.push(...flattenCategories(item.children, path, depth + 1, expanded))
  })

  postItems.forEach((post) => {
    const path = post.path || ''
    rows.push({
      depth,
      key: `post:${path || post.title || rows.length}`,
      kind: 'post',
      label: normalizeLocaleText(post.title, locale.value, t) || path,
      path,
    })
  })

  return rows
}

function isCategoryInActivePath(path: string) {
  const activeSegments = curCategory.value.split('/').filter(Boolean)
  const pathSegments = path.split('/').filter(Boolean)
  if (pathSegments.length >= activeSegments.length) return false
  return activeSegments.slice(0, pathSegments.length).join('/') === path
}

function rowStyle(depth: number, kind: TreeRow['kind']) {
  return {
    '--category-depth': String(kind === 'post' ? Math.max(depth - 1, 0) : depth),
  }
}

function toggleCategory(path: string) {
  const next = new Set(expandedPaths.value)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  expandedPaths.value = next
}

function handleCategoryClick(row: TreeRow, event: MouseEvent) {
  if (row.kind !== 'category' || !row.hasChildren || !row.isActive) return
  event.preventDefault()
  toggleCategory(row.path)
}

function translateCategoryName(name: string) {
  return name === 'Uncategorized' ? t('category.uncategorized') : $tCategory(name)
}
</script>

<template>
  <nav :aria-label="t('accessibility.category_tree')">
    <TransitionGroup
      tag="ul"
      name="lgc-category-branch"
      class="lgc-category-tree"
      role="tree"
      :aria-label="t('menu.categories')"
    >
      <li v-for="row in treeRows" :key="row.key" role="none">
        <div
          class="lgc-category-tree-row"
          :class="{
            'is-active': row.kind === 'category' && row.isActive,
            'is-in-active-path': row.kind === 'category' && row.isInActivePath,
            'is-post': row.kind === 'post',
          }"
          :style="rowStyle(row.depth, row.kind)"
          role="treeitem"
          :aria-expanded="
            row.kind === 'category' && row.hasChildren ? row.isExpanded : undefined
          "
        >
          <button
            v-if="row.kind === 'category' && row.hasChildren"
            class="lgc-category-toggle"
            type="button"
            :aria-label="
              row.isExpanded
                ? t('category.collapse', { name: row.label })
                : t('category.expand', { name: row.label })
            "
            @click="toggleCategory(row.path)"
          >
            <span
              v-if="row.isExpanded"
              i-material-symbols-keyboard-arrow-down-rounded
              aria-hidden="true"
            />
            <span v-else i-ic-round-keyboard-arrow-right aria-hidden="true" />
          </button>
          <span v-else class="lgc-category-toggle is-placeholder" aria-hidden="true" />

          <RouterLink
            v-if="row.kind === 'category'"
            class="lgc-category-link"
            :to="categoryRouteLocation(row.path)"
            @click="handleCategoryClick(row, $event)"
          >
            <span
              v-if="row.isActive || row.isExpanded"
              class="lgc-category-item-icon"
              i-material-symbols-folder-open-rounded
              aria-hidden="true"
            />
            <span
              v-else
              class="lgc-category-item-icon"
              i-material-symbols-folder-rounded
              aria-hidden="true"
            />
            <span>{{ row.label }}</span>
          </RouterLink>
          <RouterLink v-else class="lgc-category-link is-post" :to="row.path">
            <span
              class="lgc-category-item-icon"
              i-material-symbols-article-outline-rounded
              aria-hidden="true"
            />
            <span>{{ row.label }}</span>
          </RouterLink>

          <span v-if="row.kind === 'category'" class="lgc-category-count">
            {{ row.total }}
          </span>
        </div>
      </li>
    </TransitionGroup>
  </nav>
</template>

<style scoped lang="scss">
.lgc-category-tree {
  @apply 'm-0 grid list-none gap-$lgc-space-xs p-0';
}

// Vue TransitionGroup name classes; rows enter/leave as categories expand.
.lgc-category-branch-enter-active,
.lgc-category-branch-leave-active {
  --category-row-max-block-size: calc(var(--lgc-control-size-sm) + var(--lgc-space-lg));

  max-block-size: var(--category-row-max-block-size);
  overflow: hidden;
  transition-property: max-block-size, opacity, transform;
  transition-duration: var(--lgc-motion-medium);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-category-branch-move {
  transition-property: transform;
  transition-duration: var(--lgc-motion-medium);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-category-branch-enter-from,
.lgc-category-branch-leave-to {
  max-block-size: 0;
  opacity: 0;
  transform: translateY(calc(-1 * var(--lgc-space-xs)));
}

.lgc-category-tree-row {
  --category-icon-column: var(--lgc-icon-size);
  --category-indent-step: calc(var(--category-icon-column) + var(--lgc-space-xs));
  --category-indent: calc(var(--category-depth) * var(--category-indent-step));

  @apply 'grid min-w-0 items-center gap-$lgc-space-xs';
  @apply 'rounded-$lgc-radius-control text-$md-sys-color-on-surface-variant';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  grid-template-columns: var(--lgc-control-size-sm) minmax(0, 1fr) auto;
  padding-inline-start: var(--category-indent);
  transition-property: background-color, border-radius, color, transform;
}

.lgc-category-tree-row:not(.is-active):hover,
.lgc-category-tree-row:not(.is-active):focus-within {
  @apply 'rounded-$lgc-radius-control-active';
  background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
}

.lgc-category-tree-row.is-active {
  @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
}

.lgc-category-tree-row.is-in-active-path {
  @apply 'text-$md-sys-color-primary';
}

.lgc-category-tree-row.is-post {
  @apply 'text-$md-sys-color-on-surface';
}

.lgc-category-tree-row:has(.lgc-category-link:active) {
  transform: scale(var(--lgc-card-press-scale));
}

.lgc-category-toggle {
  @apply 'inline-flex items-center justify-center border-0 bg-transparent p-0';
  @apply 'min-h-$lgc-control-size-sm w-$lgc-control-size-sm rounded-$lgc-radius-control';
  @apply 'text-$md-sys-color-on-surface-variant no-underline cursor-pointer';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: background-color, border-radius, color, transform;
}

.lgc-category-tree-row:not(.is-active) .lgc-category-toggle:hover,
.lgc-category-tree-row:not(.is-active) .lgc-category-toggle:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-highest';
}

.lgc-category-tree-row.is-active .lgc-category-toggle:hover,
.lgc-category-tree-row.is-active .lgc-category-toggle:focus-visible {
  @apply 'rounded-$lgc-radius-control-active text-inherit';
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lgc-category-toggle:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-category-toggle.is-placeholder {
  @apply 'pointer-events-none text-$md-sys-color-outline';
}

.lgc-category-link {
  @apply 'inline-flex min-w-0 items-center gap-$lgc-space-sm py-$lgc-space-sm';
  @apply 'text-inherit no-underline font-900';
}

.lgc-category-item-icon {
  @apply 'inline-flex w-$lgc-icon-size-sm flex-none justify-center text-size-$lgc-icon-size-sm';
}

.lgc-category-link.is-post {
  @apply 'font-700';
}

.lgc-category-link.is-post .lgc-category-item-icon {
  @apply 'text-$md-sys-color-primary';
}

.lgc-category-link span:last-child {
  @apply 'truncate';
}

.lgc-category-count {
  @apply 'mr-$lgc-space-sm inline-flex min-w-$lgc-control-size-sm justify-center';
  @apply 'rounded-$lgc-radius-full px-$lgc-space-sm py-$lgc-space-xs';
  @apply 'text-size-$lgc-label-small font-900 bg-$md-sys-color-surface-container-highest';
}

.lgc-category-tree-row.is-active .lgc-category-count {
  // Residual: active count uses a primary-container state layer instead of
  // jumping to a surface token.
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .lgc-category-tree-row:has(.lgc-category-link:active) {
    transform: none;
  }

  .lgc-category-branch-enter-active,
  .lgc-category-branch-leave-active,
  .lgc-category-branch-move {
    transition-duration: 1ms;
  }

  .lgc-category-branch-enter-from,
  .lgc-category-branch-leave-to {
    transform: none;
  }
}
</style>
