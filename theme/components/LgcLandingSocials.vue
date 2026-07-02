<script setup lang="ts">
import type { SocialLink } from 'valaxy'

defineProps<{
  socials: SocialLink[]
}>()
</script>

<template>
  <nav v-if="socials.length" class="lgc-socials" aria-label="Social links">
    <AppLink
      v-for="item in socials"
      :key="`${item.name}-${item.link}`"
      class="lgc-social-link lgc-icon-button-base lgc-icon-button-hover"
      :to="item.link"
      :aria-label="item.name"
      rel="noopener"
    >
      <span :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
.lgc-socials {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.lgc-social-link {
  width: var(--lgc-control-size-compact);
  height: var(--lgc-control-size-compact);
  border-radius: calc(var(--lgc-control-size-compact) / 2);
  font-size: 1.25rem;

  &:hover {
    border-radius: calc(var(--lgc-radius-control-active) - 0.0625rem);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
