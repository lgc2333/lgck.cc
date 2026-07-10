<template>
  <div class="lgc-fixed-bg" aria-hidden="true">
    <div class="bg absolute inset-0" />
    <div class="mask absolute inset-0" />
  </div>
</template>

<style scoped lang="scss">
.lgc-fixed-bg {
  .mask {
    background: color-mix(
      in srgb,
      var(--md-sys-color-surface-container) 50%,
      transparent
    );
  }

  .bg {
    background: url('https://i.pixiv.cat/img-master/img/2026/03/09/00/48/28/142076600_p0_master1200.jpg')
      center/cover no-repeat;
  }
}
</style>
