<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
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
          页面不见了
        </p>
      </div>

      <div flex="~ wrap justify-center" gap="$lgc-space-md">
        <RouterLink class="lgc-not-found-action is-primary" to="/">
          <span
            i-material-symbols-home-rounded
            text="size-$lgc-icon-font-sm"
            aria-hidden="true"
          />
          <span>首页</span>
        </RouterLink>
        <button class="lgc-not-found-action" type="button" @click="router.back()">
          <span
            i-material-symbols-keyboard-return-rounded
            text="size-$lgc-icon-font-sm"
            aria-hidden="true"
          />
          <span>返回</span>
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
.lgc-not-found-action {
  @apply 'inline-flex min-h-$lgc-control-size items-center gap-$lgc-space-sm';
  @apply 'px-$lgc-space-lg border-0 rounded-$lgc-radius-control';
  @apply 'text-$md-sys-color-on-surface bg-$md-sys-color-surface-container-high';
  @apply 'font-inherit font-900 no-underline';
  @apply 'transition-[background-color,border-radius,transform]';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  @apply 'hover:rounded-$lgc-radius-control-active';
  @apply 'hover:bg-$md-sys-color-surface-container-highest';
  @apply 'active:scale-$lgc-control-press-scale';
}

// Residual: color-mix primary hover.
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
