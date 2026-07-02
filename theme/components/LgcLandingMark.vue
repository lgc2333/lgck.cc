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
  box-sizing: border-box;
  min-inline-size: 2.25rem;
  max-inline-size: 2.25rem;
  block-size: 2.25rem;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
  border: 3px solid var(--md-sys-color-surface);
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
  background: var(--md-sys-color-secondary-container);
  box-shadow: 0 0.35rem 1.25rem
    color-mix(in srgb, var(--md-sys-color-secondary) 22%, transparent);
  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    padding-inline var(--lgc-motion-medium) var(--lgc-easing-standard);

  &:hover,
  &:focus-within {
    max-inline-size: 14rem;
    justify-content: flex-start;
    gap: 0.4rem;
    padding-inline: 0.55rem;
    border-radius: 12px;
  }
}

.lgc-mark-status-emoji {
  flex: 0 0 auto;
}

.lgc-mark-status-message {
  max-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-mark-status:hover .lgc-mark-status-message,
.lgc-mark-status:focus-within .lgc-mark-status-message {
  max-inline-size: 11rem;
  opacity: 1;
}

@media (min-width: 640px) {
  .lgc-mark-avatar {
    width: 9.5rem;
    height: 9.5rem;
  }
}
</style>
