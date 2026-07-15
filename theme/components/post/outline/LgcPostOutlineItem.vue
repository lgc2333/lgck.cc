<script setup lang="ts">
import type { MenuItem } from 'valaxy'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    headers: MenuItem[]
    onClick: (event: MouseEvent) => void
    activeLink?: string
    root?: boolean
  }>(),
  {
    root: false,
  },
)

const emit = defineEmits<{
  navigate: [event: MouseEvent]
}>()

const { locale } = useI18n()

// inherit lang from parent element if not specified on the header itself
function resolveHeaderLang(lang: string | undefined, element?: Element) {
  if (lang) return lang

  const langHost = element?.parentElement?.closest('[lang]') as HTMLElement | null
  if (!langHost || langHost.tagName === 'HTML' || langHost.tagName === 'BODY') return ''

  return langHost.getAttribute('lang') || ''
}

function onLinkClick(event: MouseEvent) {
  props.onClick(event)
  emit('navigate', event)
}
</script>

<template>
  <ul class="lgc-post-outline-list" :class="root ? 'is-root' : 'is-nested'">
    <li
      v-for="{ children, element, link, title, lang } in headers"
      :key="link"
      class="lgc-post-outline-item"
      :lang="resolveHeaderLang(lang, element) || locale"
    >
      <a
        class="lgc-post-outline-link"
        :class="{ active: activeLink === link }"
        :href="link"
        :aria-current="activeLink === link ? 'location' : undefined"
        @click="onLinkClick"
      >
        <span min-w="0" block whitespace-nowrap text-ellipsis overflow-hidden>
          {{ title }}
        </span>
      </a>
      <LgcPostOutlineItem
        v-if="children?.length"
        :active-link="activeLink"
        :headers="children"
        :on-click="onClick"
        @navigate="emit('navigate', $event)"
      />
    </li>
  </ul>
</template>

<style scoped lang="scss">
// Residual: recursive list/link state belongs to the tree, not each call site.
.lgc-post-outline-list {
  @apply 'm-0 min-w-0 max-w-full list-none overflow-x-hidden p-0';
}

.lgc-post-outline-list.is-nested {
  @apply 'ps-$lgc-space-md';
}

.lgc-post-outline-link {
  @apply 'block h-[32px] min-w-0 max-w-full overflow-hidden';
  @apply 'rounded-$lgc-radius-sm px-$lgc-space-sm no-underline';
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-label-medium';
  @apply 'font-800 leading-[32px]';
  @apply 'transition-[background-color,color]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
}

.lgc-post-outline-link:hover,
.lgc-post-outline-link:focus-visible {
  @apply 'text-$md-sys-color-primary';
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.lgc-post-outline-link.active {
  @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
}
</style>
