<template>
  <div
    class="lgc-floating-actions"
    z="$lgc-layer-floating"
    right="$lgc-space-lg md:$lgc-space-3xl"
    bottom="$lgc-space-lg md:$lgc-space-3xl"
    flex="~ col"
    items-end
    fixed
    gap="$lgc-space-sm"
  >
    <LgcPostOutlineAction />
    <div class="md:flex max-md:hidden">
      <LgcFixedBgAction />
    </div>
    <LgcBackToTop />
  </div>
</template>
