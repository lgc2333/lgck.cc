<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const actionClass =
  'lgc-not-found-action inline-flex min-h-$lgc-control-size items-center gap-$lgc-space-sm px-$lgc-space-lg border-0 rounded-$lgc-radius-control text-$md-sys-color-on-surface bg-$md-sys-color-surface-container-high font-inherit font-900 no-underline transition-[background-color,border-radius,transform] duration-$lgc-motion-short ease-$lgc-easing-standard hover:rounded-$lgc-radius-control-active hover:bg-$md-sys-color-surface-container-highest active:scale-$lgc-control-press-scale'
</script>

<template>
  <Layout>
    <section
      class="lgc-page-surface"
      justify-items="center"
      gap="$lgc-space-2xl"
      pt="0"
      pb="$lgc-space-3xl"
      text-center
      flex-1
      grid
      content-center
      aria-labelledby="lgc-not-found-title"
    >
      <div
        grid
        w="96px"
        h="96px"
        place-items="center"
        rounded="$lgc-radius-4xl"
        text="$md-sys-color-on-primary-container size-48px"
        bg="$md-sys-color-primary-container"
        aria-hidden="true"
      >
        <span i-material-symbols-travel-explore-rounded />
      </div>

      <div grid max-w="$lgc-measure-narrow" gap="$lgc-space-md">
        <h1
          id="lgc-not-found-title"
          m="0"
          text="$md-sys-color-on-surface size-$lgc-display-error"
          font="900"
          leading-none
          tracking-normal
        >
          404
        </h1>
        <p
          m="0"
          text="$md-sys-color-on-surface-variant size-$lgc-body-large"
          leading="[1.75]"
        >
          {{ t('not-found') }}
        </p>
      </div>

      <div flex="~ wrap justify-center" gap="$lgc-space-md">
        <RouterLink class="is-primary" :class="actionClass" to="/">
          <span
            i-material-symbols-home-rounded
            text="size-$lgc-icon-font-sm"
            aria-hidden="true"
          />
          <span>{{ t('button.home') }}</span>
        </RouterLink>
        <button :class="actionClass" type="button" @click="router.back()">
          <span
            i-material-symbols-keyboard-return-rounded
            text="size-$lgc-icon-font-sm"
            aria-hidden="true"
          />
          <span>{{ t('button.back') }}</span>
        </button>
      </div>

      <div
        max-w="$lgc-measure-narrow"
        text="$md-sys-color-on-surface-variant"
        leading="[1.75]"
      >
        <RouterView />
      </div>
    </section>
  </Layout>
</template>

<style scoped lang="scss">
// Residual: color-mix primary hover (no clean utility for mix percent).
.lgc-not-found-action.is-primary {
  @apply 'text-$md-sys-color-on-primary bg-$md-sys-color-primary';

  &:hover {
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 86%,
      var(--md-sys-color-on-primary)
    );
  }
}
</style>
