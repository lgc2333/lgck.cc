<template>
  <div class="lgc-fixed-bg" aria-hidden="true" />
</template>

<style scoped lang="scss">
.lgc-fixed-bg {
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--md-sys-color-primary) 24%, transparent) 0 2px,
      transparent 2.6px
    ),
    radial-gradient(
      circle,
      color-mix(in srgb, var(--md-sys-color-tertiary) 20%, transparent) 0 1.4px,
      transparent 2px
    ),
    radial-gradient(
      closest-side at 48% 28%,
      color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent),
      transparent 74%
    ),
    radial-gradient(
      closest-side at 34% 58%,
      color-mix(in srgb, var(--md-sys-color-primary-container) 34%, transparent),
      transparent 80%
    ),
    radial-gradient(
      closest-side at 68% 54%,
      color-mix(in srgb, var(--md-sys-color-tertiary-container) 28%, transparent),
      transparent 82%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--md-sys-color-primary-container) 42%, transparent) 0%,
      color-mix(in srgb, var(--md-sys-color-surface) 96%, transparent) 44%,
      var(--md-sys-color-surface) 100%
    );
  background-position:
    0 0,
    28px 22px,
    center,
    center,
    center,
    center;
  background-size:
    84px 84px,
    132px 132px,
    auto,
    auto,
    auto,
    auto;
}

.lgc-fixed-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(42px);
  mask-image: radial-gradient(ellipse at 50% 42%, black 0 44%, transparent 76%);
  opacity: 0.82;
}
</style>
