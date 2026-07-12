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
  <div grid="~ justify-items-center" mb="28px" gap="$lgc-space-sm">
    <div relative>
      <img
        v-if="avatar"
        class="lgc-mark-avatar"
        w="$lgc-label-width sm:152px"
        h="$lgc-label-width sm:152px"
        rounded="[30px]"
        object-cover
        bg="$lgc-mark-avatar-bg"
        border="3px solid $lgc-mark-avatar-border"
        :src="avatar"
        :alt="name || title"
      />
      <div
        v-if="status?.emoji || status?.message"
        class="lgc-mark-status"
        text="$md-sys-color-on-primary-container size-$lgc-label-medium"
        font="700"
        inline-flex
        whitespace-nowrap
        items-center
        box-border
        justify-center
        absolute
        overflow-hidden
        bg="$md-sys-color-primary-container"
        :aria-label="status.message"
      >
        <span flex-none aria-hidden="true">
          {{ status.emoji }}
        </span>
        <span v-if="status.message" class="lgc-mark-status-message">
          {{ status.message }}
        </span>
      </div>
    </div>
    <div
      v-if="name"
      text="$md-sys-color-on-surface size-$lgc-title-medium"
      font="800"
      leading="[1.2]"
    >
      {{ name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
// Residual: color-mix ring + expand geometry (keep icon anchor stable).
.lgc-mark-avatar {
  --lgc-mark-avatar-bg: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-high) 15%,
    transparent
  );
  --lgc-mark-avatar-border: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-high) 20%,
    transparent
  );
}

.lgc-mark-status {
  --mark-status-offset-inline: calc(-1 * var(--lgc-gap-compact));
  --mark-status-offset-block: calc(-1 * var(--lgc-space-xs));
  --mark-status-size: 36px;
  --mark-status-open-max: 224px;

  --lgc-mark-status-border: color-mix(
    in srgb,
    var(--md-sys-color-on-primary) 20%,
    transparent
  );

  right: var(--mark-status-offset-inline);
  bottom: var(--mark-status-offset-block);
  min-inline-size: var(--mark-status-size);
  max-inline-size: var(--mark-status-size);
  block-size: var(--mark-status-size);
  gap: 0;
  padding: 0;
  border-radius: 18px;
  border: 3px solid var(--lgc-mark-status-border);
  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    padding-inline var(--lgc-motion-medium) var(--lgc-easing-standard);

  &:hover,
  &:focus-within {
    max-inline-size: var(--mark-status-open-max);
    justify-content: flex-start;
    gap: 6px;
    padding-inline: var(--lgc-space-sm);
    border-radius: var(--lgc-radius-md);
  }
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
</style>
