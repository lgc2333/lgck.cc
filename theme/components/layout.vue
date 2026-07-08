<template>
  <div class="lgc-layout">
    <LgcFixedBg />
    <LgcHeader />

    <div class="lgc-layout-surface">
      <main class="lgc-layout-inner">
        <slot />
      </main>

      <LgcFooter>
        <slot name="footer" />
      </LgcFooter>
    </div>

    <LgcBackToTop />
  </div>
</template>

<style scoped lang="scss">
.lgc-layout {
  -webkit-font-smoothing: antialiased;
  color: var(--md-sys-color-on-surface);
}

.lgc-layout-surface {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: var(--lgc-surface-mask-bg);
}

.lgc-layout-inner {
  display: flex;
  width: 100%;
  max-width: var(--lgc-container-reading);
  box-sizing: border-box;
  flex: 1 0 auto;
  flex-direction: column;
  padding-top: calc(var(--lgc-header-height) + 1rem);
  padding-inline: 1rem;
  margin-inline: auto;
}

.lgc-layout-surface :deep(.lgc-footer) {
  margin-top: auto;
}

@media (min-width: 640px) {
  .lgc-layout-inner {
    padding-top: calc(var(--lgc-header-height) + 2rem);
    padding-inline: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .lgc-layout-inner {
    max-width: var(--lgc-container-wide);
    padding-inline: 0;
  }
}
</style>
