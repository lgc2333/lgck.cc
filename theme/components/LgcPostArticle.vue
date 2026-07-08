<template>
  <article class="lgc-article">
    <slot />
  </article>
</template>

<style scoped lang="scss">
.lgc-article {
  position: relative;
  isolation: isolate;
  color: var(--md-sys-color-on-surface);
}
</style>
