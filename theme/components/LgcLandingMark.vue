<script setup lang="ts">
defineProps<{
  avatar?: string
  name?: string
  status?: {
    emoji: string
    message: string
  }
  title: string
}>()
</script>

<template>
  <div class="lgc-mark">
    <div class="lgc-mark-avatar-wrap">
      <img v-if="avatar" class="lgc-mark-avatar" :src="avatar" :alt="name || title" />
      <div
        v-if="status?.emoji || status?.message"
        class="lgc-mark-status"
        :aria-label="status.message"
      >
        <span class="lgc-mark-status-emoji" aria-hidden="true">{{ status.emoji }}</span>
        <span v-if="status.message" class="lgc-mark-status-message">
          {{ status.message }}
        </span>
      </div>
    </div>
    <div v-if="name" class="lgc-mark-name">{{ name }}</div>
  </div>
</template>

<style scoped lang="scss">
.lgc-mark {
  display: grid;
  justify-items: center;
  gap: 0.55rem;
  margin-bottom: 1.25rem;
}

.lgc-mark-avatar-wrap {
  position: relative;
}

.lgc-mark-avatar {
  width: 9rem;
  height: 9rem;
  border: 4px solid var(--md-sys-color-surface);
  border-radius: 30px;
  object-fit: cover;
}

.lgc-mark-name {
  color: var(--md-sys-color-on-surface);
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.2;
}

.lgc-mark-status {
  position: absolute;
  right: -0.45rem;
  bottom: -0.3rem;
  display: inline-flex;
  max-width: 2.25rem;
  min-height: 2rem;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.55rem;
  overflow: hidden;
  border-radius: 999px;
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
  background: var(--md-sys-color-secondary-container);
  box-shadow: 0 0 0 3px var(--md-sys-color-surface);
  transition:
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    background-color var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover,
  &:focus-within {
    max-width: 14rem;
    border-radius: 12px;
    background: var(--md-sys-color-surface-container-high);
  }
}

.lgc-mark-status-emoji {
  flex: 0 0 auto;
}

.lgc-mark-status-message {
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 640px) {
  .lgc-mark-avatar {
    width: 9.5rem;
    height: 9.5rem;
  }
}
</style>
