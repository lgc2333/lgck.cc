<script setup lang="ts">
import { computed } from 'vue'

type ButtonClass = string | string[] | Record<string, boolean>

const props = withDefaults(
  defineProps<{
    ariaControls?: string
    ariaExpanded?: boolean
    buttonClass?: ButtonClass
    href?: string
    interactiveDetail?: boolean
    label: string
    mobileOnly?: boolean
    show?: boolean
  }>(),
  {
    show: true,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const linkRel = computed(() => (props.href ? 'noopener' : undefined))
</script>

<template>
  <Transition name="lgc-floating-action-button-reveal">
    <span
      v-if="show && interactiveDetail"
      class="lgc-floating-action-button"
      :class="[
        {
          'has-detail': $slots.detail,
          'has-interactive-detail': interactiveDetail,
          'is-mobile-only': mobileOnly,
        },
        buttonClass,
      ]"
    >
      <span v-if="$slots.detail" class="lgc-floating-action-detail">
        <span class="lgc-floating-action-detail-inner">
          <slot name="detail" />
        </span>
      </span>
      <a
        v-if="href"
        class="lgc-floating-action-icon lgc-floating-action-icon-control"
        :href="href"
        target="_blank"
        :rel="linkRel"
        :aria-controls="ariaControls"
        :aria-expanded="ariaExpanded"
        :aria-label="label"
        :title="label"
        @click="emit('click', $event)"
      >
        <slot />
      </a>
      <button
        v-else
        class="lgc-floating-action-icon lgc-floating-action-icon-control"
        type="button"
        :aria-controls="ariaControls"
        :aria-expanded="ariaExpanded"
        :aria-label="label"
        :title="label"
        @click="emit('click', $event)"
      >
        <slot />
      </button>
    </span>

    <a
      v-else-if="show && href"
      class="lgc-floating-action-button"
      :class="[
        { 'has-detail': $slots.detail, 'is-mobile-only': mobileOnly },
        buttonClass,
      ]"
      :href="href"
      target="_blank"
      :rel="linkRel"
      :aria-controls="ariaControls"
      :aria-expanded="ariaExpanded"
      :aria-label="label"
      :title="label"
      @click="emit('click', $event)"
    >
      <span v-if="$slots.detail" class="lgc-floating-action-detail">
        <span class="lgc-floating-action-detail-inner">
          <slot name="detail" />
        </span>
      </span>
      <span class="lgc-floating-action-icon">
        <slot />
      </span>
    </a>

    <button
      v-else-if="show"
      class="lgc-floating-action-button"
      :class="[
        { 'has-detail': $slots.detail, 'is-mobile-only': mobileOnly },
        buttonClass,
      ]"
      type="button"
      :aria-controls="ariaControls"
      :aria-expanded="ariaExpanded"
      :aria-label="label"
      :title="label"
      @click="emit('click', $event)"
    >
      <span v-if="$slots.detail" class="lgc-floating-action-detail">
        <span class="lgc-floating-action-detail-inner">
          <slot name="detail" />
        </span>
      </span>
      <span class="lgc-floating-action-icon">
        <slot />
      </span>
    </button>
  </Transition>
</template>

<style scoped lang="scss">
.lgc-floating-action-button {
  --lgc-floating-action-detail-max: 248px;
  --lgc-floating-action-detail-block-max: 12rem;
  --lgc-floating-action-open-max: calc(
    var(--lgc-floating-action-detail-max) + var(--lgc-back-to-top-size)
  );
  --lgc-floating-action-motion-duration: var(--lgc-motion-medium);

  @apply 'max-inline-$lgc-back-to-top-size';
  @apply 'inline-flex min-h-$lgc-back-to-top-size items-center justify-end overflow-hidden';
  @apply 'gap-0 border-0 p-0 no-underline appearance-none cursor-pointer';
  @apply 'rounded-$lgc-radius-control-active text-$md-sys-color-primary bg-$md-sys-color-surface-container-high backdrop-blur-$lgc-elevate-blur';
  @apply 'shadow-$lgc-elevation-shadow-level-2';
  transition-property:
    background-color, border-radius, box-shadow, color, max-inline-size, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-short), var(--lgc-motion-short),
    var(--lgc-motion-short), var(--lgc-floating-action-motion-duration),
    var(--lgc-motion-short);
  @apply 'ease-$lgc-easing-standard';
}

.lgc-floating-action-button:hover,
.lgc-floating-action-button:focus-visible,
.lgc-floating-action-button:focus-within {
  @apply 'max-inline-$lgc-floating-action-open-max';
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-surface-container-highest';
  @apply 'text-$md-sys-color-primary shadow-$lgc-elevation-shadow-level-3';
}

.lgc-floating-action-button.has-detail {
  @apply 'items-end';
}

.lgc-floating-action-button:active,
.lgc-floating-action-button.has-interactive-detail:has(:active) {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-floating-action-button.has-interactive-detail {
  @apply 'cursor-default';
}

.lgc-floating-action-button.is-mobile-only {
  @apply 'lg:hidden!';
}

.lgc-floating-action-icon {
  @apply 'relative grid h-$lgc-back-to-top-size w-$lgc-back-to-top-size flex-none place-items-center';
  @apply 'text-size-$lgc-icon-size';
}

.lgc-floating-action-icon-control {
  @apply 'border-0 p-0 text-current no-underline bg-transparent appearance-none cursor-pointer';
}

.lgc-floating-action-detail {
  --lgc-floating-action-edge-feather: var(--lgc-space-md);

  max-block-size: 0;
  @apply 'block max-inline-0 overflow-hidden opacity-0';
  transition-property: max-inline-size, max-block-size, opacity;
  transition-duration:
    var(--lgc-floating-action-motion-duration),
    var(--lgc-floating-action-motion-duration),
    var(--lgc-floating-action-motion-duration);
  @apply 'ease-$lgc-easing-standard';

  // Residual: alpha mask feather softens the animated clipping edge.
  mask-image: linear-gradient(
    to right,
    black 0,
    black calc(100% - var(--lgc-floating-action-edge-feather)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    black 0,
    black calc(100% - var(--lgc-floating-action-edge-feather)),
    transparent 100%
  );
}

.lgc-floating-action-detail-inner {
  box-sizing: border-box;
  inline-size: var(--lgc-floating-action-detail-max);
  @apply 'block py-$lgc-space-sm pl-$lgc-space-md pr-$lgc-space-sm';
  @apply 'text-left text-size-$lgc-body-small leading-snug text-$md-sys-color-on-surface';
}

.lgc-floating-action-button:hover .lgc-floating-action-detail,
.lgc-floating-action-button:focus-visible .lgc-floating-action-detail,
.lgc-floating-action-button:focus-within .lgc-floating-action-detail {
  max-block-size: var(--lgc-floating-action-detail-block-max);
  @apply 'max-inline-$lgc-floating-action-detail-max opacity-100';
}

.lgc-floating-action-button-reveal-enter-active,
.lgc-floating-action-button-reveal-leave-active {
  transition:
    opacity var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-floating-action-button-reveal-enter-from,
.lgc-floating-action-button-reveal-leave-to {
  opacity: 0;
  transform: translateY(var(--lgc-space-md));
}

@media (prefers-reduced-motion: reduce) {
  .lgc-floating-action-button-reveal-enter-active,
  .lgc-floating-action-button-reveal-leave-active {
    transition: none;
  }

  .lgc-floating-action-button-reveal-enter-from,
  .lgc-floating-action-button-reveal-leave-to {
    transform: none;
  }
}
</style>
