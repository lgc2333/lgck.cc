<script setup lang="ts">
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'
import { useSiteConfig, useValaxyI18n } from 'valaxy'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface SponsorMethod {
  name: string
  url: string
  color?: string
  icon?: string
}

const props = withDefaults(
  defineProps<{
    description?: string
    link?: string
    methods?: SponsorMethod[]
    title?: string
    variant: 'link' | 'methods'
  }>(),
  {
    description: '',
    link: '',
    methods: () => [],
    title: '',
  },
)

const { t } = useI18n()
const { $t } = useValaxyI18n()
const siteConfig = useSiteConfig()
const expanded = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
let sponsorZoom: Zoom | undefined

const titleText = computed(() => $t(props.title) || t('post.sponsor'))
const descriptionText = computed(
  () => $t(props.description) || t('post.sponsor_description'),
)
const toggleLabel = computed(() =>
  expanded.value ? t('post.sponsor_methods_close') : t('post.sponsor_methods'),
)

async function syncSponsorZoom() {
  await nextTick()

  if (!sectionRef.value) return

  const images = Array.from(
    sectionRef.value.querySelectorAll<HTMLImageElement>('.lgc-post-sponsor-method-img'),
  )

  if (!images.length) {
    sponsorZoom?.detach(...sponsorZoom.getImages())
    return
  }

  const options = {
    background: 'var(--medium-zoom-c-bg, rgba(0, 0, 0, 0.8))',
    ...siteConfig.value.mediumZoom.options,
  }

  if (!sponsorZoom) sponsorZoom = mediumZoom(options)
  else sponsorZoom.update(options)

  sponsorZoom.detach(...sponsorZoom.getImages())
  sponsorZoom.attach(images)
}

onMounted(syncSponsorZoom)
watch(() => [expanded.value, props.methods], syncSponsorZoom, { flush: 'post' })

onBeforeUnmount(() => {
  sponsorZoom?.detach(...sponsorZoom.getImages())
})
</script>

<template>
  <section
    ref="sectionRef"
    class="lgc-post-sponsor"
    grid
    gap="$lgc-space-lg"
    p="$lgc-space-xl"
    rounded="$lgc-radius-large"
    text="$md-sys-color-on-surface"
    bg="$md-sys-color-secondary-container"
  >
    <div class="lgc-post-sponsor-header" grid items-center gap="$lgc-space-md">
      <span
        inline-grid
        self-center
        place-items-center
        w="$lgc-control-size"
        h="$lgc-control-size"
        rounded="$lgc-radius-control-active"
        text="$md-sys-color-on-secondary-container size-$lgc-icon-size"
        bg="$md-sys-color-surface-container-highest"
        aria-hidden="true"
      >
        <span i-material-symbols-volunteer-activism-outline-rounded />
      </span>

      <div min-w="0" grid self-center gap="$lgc-space-xs">
        <h2
          m="0"
          text="$md-sys-color-on-secondary-container size-$lgc-title-small"
          font="900"
          leading-tight
        >
          {{ titleText }}
        </h2>

        <p
          m="0"
          text="$md-sys-color-on-secondary-container size-$lgc-body-small"
          leading-relaxed
          opacity-85
        >
          {{ descriptionText }}
        </p>
      </div>

      <AppLink
        v-if="variant === 'link' && link"
        class="lgc-post-sponsor-action"
        justify-self="end"
        max-sm="col-span-full justify-self-stretch w-full justify-center"
        self-center
        :to="link"
      >
        <span i-material-symbols-favorite-rounded aria-hidden="true" />
        <span>{{ t('post.sponsor_link') }}</span>
      </AppLink>

      <button
        v-else-if="variant === 'methods' && methods.length"
        class="lgc-post-sponsor-action"
        type="button"
        justify-self="end"
        max-sm="col-span-full justify-self-stretch w-full justify-center"
        self-center
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <span i-material-symbols-favorite-rounded aria-hidden="true" />
        <span>{{ toggleLabel }}</span>
        <span
          :class="
            expanded
              ? 'i-material-symbols-keyboard-arrow-up-rounded'
              : 'i-material-symbols-keyboard-arrow-down-rounded'
          "
          aria-hidden="true"
        />
      </button>
    </div>

    <template v-if="variant === 'methods' && methods.length">
      <div
        v-if="expanded"
        class="lgc-post-sponsor-methods"
        grid
        grid-cols="[repeat(auto-fit,minmax(136px,1fr))]"
        gap="$lgc-space-md"
        :class="{ 'is-expanded': expanded }"
      >
        <div
          v-for="method in methods"
          :key="`${method.name}-${method.url}`"
          class="lgc-post-sponsor-method"
          :style="{
            '--sponsor-method-color':
              method.color?.trim() || 'var(--md-sys-color-primary)',
          }"
        >
          <span class="lgc-post-sponsor-method-img-frame">
            <img
              class="lgc-post-sponsor-method-img"
              :src="method.url"
              :alt="$t(method.name)"
              loading="lazy"
            />
          </span>
          <span
            v-if="method.icon"
            text="size-$lgc-icon-size"
            :class="method.icon"
            aria-hidden="true"
          />
          <span min-w="0" wrap="anywhere">{{ $t(method.name) }}</span>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.lgc-post-sponsor-action {
  @apply 'inline-flex items-center gap-$lgc-space-sm';
  @apply 'px-$lgc-space-lg py-$lgc-space-sm rounded-$lgc-radius-control-active border-0 no-underline appearance-none';
  @apply 'text-$md-sys-color-on-primary-container';
  @apply 'text-size-$lgc-body-medium font-900 font-inherit cursor-pointer whitespace-nowrap';
  @apply 'transition-[background-color,border-radius,transform]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 84%,
    var(--md-sys-color-primary)
  );
}

.lgc-post-sponsor-header {
  --post-sponsor-header-cols: var(--lgc-control-size) minmax(0, 1fr);
  --post-sponsor-header-cols-wide: var(--lgc-control-size) minmax(0, 1fr) auto;

  // Residual: space-separated grid track var is more reliable than arbitrary
  // grid-cols for this local template API.
  grid-template-columns: var(--post-sponsor-header-cols);
}

@screen sm {
  .lgc-post-sponsor-header {
    grid-template-columns: var(--post-sponsor-header-cols-wide);
  }
}

.lgc-post-sponsor-action:hover,
.lgc-post-sponsor-action:focus-visible {
  @apply 'rounded-$lgc-radius-control-active';
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 72%,
    var(--md-sys-color-primary)
  );
}

.lgc-post-sponsor-action:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-post-sponsor-method {
  @apply 'grid min-w-0 justify-items-center gap-$lgc-space-sm p-$lgc-space-md';
  @apply 'rounded-$lgc-radius-control-active text-center';
  @apply 'text-size-$lgc-label-medium font-800';
  color: var(--sponsor-method-color);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.lgc-post-sponsor-method-img-frame {
  @apply 'box-border inline-grid w-full max-w-36 aspect-square place-items-center';
  @apply 'rounded-$lgc-radius-content p-[6px]';
  background: color-mix(in srgb, currentColor 25%, transparent);
}

.lgc-post-sponsor-method-img {
  @apply 'block w-full h-full object-contain';
}
</style>
