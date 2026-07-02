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
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 22px;
  font-size: 1.25rem;

  &:hover {
    border-radius: 15px;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
