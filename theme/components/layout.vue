<template>
  <div antialiased text="$md-sys-color-on-surface">
    <LgcFixedBg />
    <LgcHeader />

    <div flex="~ col" min-h="screen" bg="$lgc-surface-mask-bg">
      <main
        class="lgc-content-under-header"
        flex="~ col"
        w="full"
        max-w="$lgc-container-reading lg:$lgc-container-wide"
        mx-auto
        flex-1
        box-border
        px="$lgc-space-lg sm:$lgc-space-2xl lg:0"
      >
        <slot />
      </main>

      <LgcFooter class="mt-auto">
        <slot name="footer" />
      </LgcFooter>
    </div>

    <LgcFloatingActions />
  </div>
</template>
