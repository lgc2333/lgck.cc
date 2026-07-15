<script setup lang="ts">
import type { LandingAvatarShape } from '../../types'

const props = withDefaults(
  defineProps<{
    avatar?: string
    avatarShape?: LandingAvatarShape
    intro?: string
    link?: string
    name?: string
    status?: {
      emoji: string
      message: string
    }
    title: string
  }>(),
  {
    avatarShape: 'rounded',
  },
)
</script>

<template>
  <div
    class="lgc-mark"
    grid="~ justify-items-center"
    mb="$lgc-space-lg sm:36px"
    gap="$lgc-space-xs sm:$lgc-space-sm"
  >
    <AppLink
      v-if="props.link"
      class="lgc-mark-identity text-inherit no-underline"
      grid="~ justify-items-center"
      gap="$lgc-space-sm"
      :to="props.link"
    >
      <div class="lgc-mark-avatar-wrap" relative>
        <img
          v-if="props.avatar"
          class="lgc-mark-avatar"
          :class="{ 'is-circle': props.avatarShape === 'circle' }"
          w="$lgc-label-width sm:152px"
          h="$lgc-label-width sm:152px"
          rounded="[30px]"
          object-cover
          bg="$lgc-mark-avatar-bg"
          border="3px solid $lgc-mark-avatar-border"
          :src="props.avatar"
          :alt="props.name || props.title"
        />
        <span
          v-if="props.status?.emoji || props.status?.message"
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
          right="$mark-status-offset-inline"
          bottom="$mark-status-offset-block"
          min-w="$mark-status-size"
          max-inline="$mark-status-size"
          h="$mark-status-size"
          gap="0"
          p="0"
          rounded="[18px]"
          border="3px solid $lgc-mark-status-border"
          :aria-label="props.status.message"
        >
          <span flex-none aria-hidden="true">
            {{ props.status.emoji }}
          </span>
          <span
            v-if="props.status.message"
            class="lgc-mark-status-message"
            max-inline="0"
            opacity-0
            text-ellipsis
            overflow-hidden
          >
            {{ props.status.message }}
          </span>
        </span>
      </div>
      <span
        v-if="props.name"
        class="lgc-mark-name"
        text="$md-sys-color-on-surface size-$lgc-title-medium"
        font="800"
        leading="[1.2]"
      >
        {{ props.name }}
      </span>
    </AppLink>

    <div
      v-else
      class="lgc-mark-identity text-inherit"
      grid="~ justify-items-center"
      gap="$lgc-space-sm"
    >
      <div class="lgc-mark-avatar-wrap" relative>
        <img
          v-if="props.avatar"
          class="lgc-mark-avatar"
          :class="{ 'is-circle': props.avatarShape === 'circle' }"
          w="$lgc-label-width sm:152px"
          h="$lgc-label-width sm:152px"
          rounded="[30px]"
          object-cover
          bg="$lgc-mark-avatar-bg"
          border="3px solid $lgc-mark-avatar-border"
          :src="props.avatar"
          :alt="props.name || props.title"
        />
        <div
          v-if="props.status?.emoji || props.status?.message"
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
          right="$mark-status-offset-inline"
          bottom="$mark-status-offset-block"
          min-w="$mark-status-size"
          max-inline="$mark-status-size"
          h="$mark-status-size"
          gap="0"
          p="0"
          rounded="[18px]"
          border="3px solid $lgc-mark-status-border"
          :aria-label="props.status.message"
        >
          <span flex-none aria-hidden="true">
            {{ props.status.emoji }}
          </span>
          <span
            v-if="props.status.message"
            class="lgc-mark-status-message"
            max-inline="0"
            opacity-0
            text-ellipsis
            overflow-hidden
          >
            {{ props.status.message }}
          </span>
        </div>
      </div>
      <div
        v-if="props.name"
        class="lgc-mark-name"
        text="$md-sys-color-on-surface size-$lgc-title-medium"
        font="800"
        leading="[1.2]"
      >
        {{ props.name }}
      </div>
    </div>

    <p
      v-if="props.intro"
      class="lgc-mark-intro"
      m="0"
      max-w="$lgc-measure-narrow"
      text="$md-sys-color-on-surface size-$lgc-body-medium sm:size-$lgc-body-large"
      leading="[1.6]"
    >
      {{ props.intro }}
    </p>
  </div>
</template>

<style scoped lang="scss">
// Residual: text-shadow has no project utility and shares a landing token.
.lgc-mark-name,
.lgc-mark-intro {
  text-shadow: var(--lgc-landing-text-shadow);
}

.lgc-mark-avatar.is-circle {
  @apply 'rounded-full';
}

// Residual: color-mix ring + max-inline-size transition geometry.
.lgc-mark-avatar {
  --lgc-mark-avatar-bg: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-high) 30%,
    transparent
  );
  --lgc-mark-avatar-border: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-high) 30%,
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

  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    padding-inline var(--lgc-motion-medium) var(--lgc-easing-standard);

  &:hover,
  &:focus-within {
    @apply 'max-inline-$mark-status-open-max justify-start gap-[6px] px-$lgc-space-sm rounded-$lgc-radius-md';
  }
}

.lgc-mark-status-message {
  transition:
    max-inline-size var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-mark-status:hover .lgc-mark-status-message,
.lgc-mark-status:focus-within .lgc-mark-status-message {
  @apply 'max-inline-$lgc-header-link-max-width opacity-100';
}
</style>
