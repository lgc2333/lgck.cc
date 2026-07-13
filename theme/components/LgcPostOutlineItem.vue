<script setup lang="ts">
import type { MenuItem } from 'valaxy'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    headers: MenuItem[]
    onClick: (event: MouseEvent) => void
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
      <a class="lgc-post-outline-link" :href="link" @click="onLinkClick">
        {{ title }}
      </a>
      <LgcPostOutlineItem
        v-if="children?.length"
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
  @apply 'm-0 list-none p-0';
}

.lgc-post-outline-list.is-nested {
  @apply 'ps-$lgc-space-md';
}

.lgc-post-outline-link {
  @apply 'block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap';
  @apply 'rounded-$lgc-radius-sm px-$lgc-space-sm py-[6px] no-underline';
  @apply 'text-$md-sys-color-on-surface-variant text-size-$lgc-label-medium';
  @apply 'font-800 leading-snug';
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
