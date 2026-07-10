<template>
  <div antialiased text="$md-sys-color-on-surface">
    <LgcFixedBg />
    <LgcHeader />

    <div flex="~ col" min-h="screen" bg="$lgc-surface-mask-bg">
      <main
        class="lgc-content-under-header"
        box-border
        flex="~ col"
        w="full"
        max-w="$lgc-container-reading lg:$lgc-container-wide"
        flex-1
        mx-auto
        px="$lgc-space-lg sm:$lgc-space-2xl lg:0"
      >
        <slot />
      </main>

      <LgcFooter class="mt-auto">
        <slot name="footer" />
      </LgcFooter>
    </div>

    <LgcBackToTop />
  </div>
</template>
