<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <Layout>
    <section
      class="lgc-not-found lgc-page-surface"
      aria-labelledby="lgc-not-found-title"
    >
      <div class="lgc-not-found-mark" aria-hidden="true">
        <span i-material-symbols-travel-explore-rounded />
      </div>

      <div class="lgc-not-found-copy">
        <h1 id="lgc-not-found-title">404</h1>
        <p>页面不见了</p>
      </div>

      <div class="lgc-not-found-actions">
        <RouterLink class="lgc-not-found-action is-primary" to="/">
          <span i-material-symbols-home-rounded aria-hidden="true" />
          <span>首页</span>
        </RouterLink>
        <button class="lgc-not-found-action" type="button" @click="router.back()">
          <span i-material-symbols-keyboard-return-rounded aria-hidden="true" />
          <span>返回</span>
        </button>
      </div>

      <div class="lgc-not-found-content">
        <RouterView />
      </div>
    </section>
  </Layout>
</template>

<style scoped lang="scss">
.lgc-not-found {
  display: grid;
  flex: 1;
  align-content: center;
  justify-items: center;
  gap: 1.5rem;
  padding-block: 0 2rem;
  text-align: center;
}

.lgc-not-found-mark {
  display: grid;
  width: 6rem;
  height: 6rem;
  place-items: center;
  border-radius: 2rem;
  color: var(--md-sys-color-on-primary-container);
  font-size: 3rem;
  background: var(--md-sys-color-primary-container);
}

.lgc-not-found-copy {
  display: grid;
  max-width: var(--lgc-measure-narrow);
  gap: var(--lgc-space-md);

  h1 {
    margin: 0;
    color: var(--md-sys-color-on-surface);
    font-size: clamp(2.25rem, 6vw, 4.25rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: var(--md-sys-color-on-surface-variant);
    font-size: 1rem;
    line-height: 1.75;
  }
}

.lgc-not-found-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.lgc-not-found-action {
  display: inline-flex;
  min-height: var(--lgc-control-size);
  align-items: center;
  gap: 0.5rem;
  padding-inline: 1rem;
  border: 0;
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-high);
  font: inherit;
  font-weight: 900;
  text-decoration: none;
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover {
    border-radius: var(--lgc-radius-control-active);
    background: var(--md-sys-color-surface-container-highest);
  }

  &:active {
    transform: scale(var(--lgc-control-press-scale));
  }

  span:first-child {
    font-size: 1.25rem;
  }
}

.lgc-not-found-action.is-primary {
  color: var(--md-sys-color-on-primary);
  background: var(--md-sys-color-primary);

  &:hover {
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 86%,
      var(--md-sys-color-on-primary)
    );
  }
}

.lgc-not-found-content {
  max-width: var(--lgc-measure-narrow);
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.75;
}
</style>
