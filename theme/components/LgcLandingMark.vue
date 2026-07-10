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
@use '../styles/helpers' as *;

.lgc-mark {
  display: grid;
  justify-items: center;
  gap: var(--lgc-space-sm);
  margin-bottom: 28px;
}

.lgc-mark-avatar-wrap {
  position: relative;
}

.lgc-mark-avatar {
  width: var(--lgc-label-width);
  height: var(--lgc-label-width);
  border: 3px solid
    color-mix(in srgb, var(--md-sys-color-surface-container-high) 20%, transparent);
  border-radius: 30px;
  object-fit: cover;
}

.lgc-mark-name {
  color: var(--md-sys-color-on-surface);
  font-size: var(--lgc-title-medium);
  font-weight: 800;
  line-height: 1.2;
}

.lgc-mark-status {
  position: absolute;
  right: calc(-1 * var(--lgc-gap-compact));
  bottom: calc(-1 * var(--lgc-space-xs));
  display: inline-flex;
  box-sizing: border-box;
  min-inline-size: 36px;
  max-inline-size: 36px;
  block-size: 36px;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 18px;
  border: 3px solid
    color-mix(in srgb, var(--md-sys-color-surface-container-high) 20%, transparent);
  color: var(--md-sys-color-on-secondary-container);
  font-size: var(--lgc-label-medium);
  font-weight: 700;
  white-space: nowrap;
  background: var(--md-sys-color-secondary-container);
  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    padding-inline var(--lgc-motion-medium) var(--lgc-easing-standard);

  &:hover,
  &:focus-within {
    max-inline-size: 224px;
    justify-content: flex-start;
    gap: 6px;
    padding-inline: var(--lgc-space-sm);
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
  max-inline-size: var(--lgc-header-link-max-width);
  opacity: 1;
}

@include compact-up {
  .lgc-mark-avatar {
    width: 152px;
    height: 152px;
  }
}
</style>
