<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  category?: string
  excerpt?: string
  excerptType?: string
  path: string
  tags: string[]
  title: string
}>()

const shouldRenderAsTemplate = computed(() => {
  if (!props.excerpt) return false
  if (props.excerptType === 'html') return true

  return /<[A-Z][\w.-]*(?:\s|\/?>)/.test(props.excerpt)
})
</script>

<template>
  <div class="lgc-post-body">
    <h3 class="lgc-post-title">
      <RouterLink class="lgc-post-title-link" :to="path">
        {{ title }}
      </RouterLink>
    </h3>
    <div v-if="excerpt && shouldRenderAsTemplate" class="lgc-post-excerpt">
      <ValaxyDynamicComponent :template-str="excerpt" />
    </div>
    <div v-else-if="excerpt" class="lgc-post-excerpt" v-html="excerpt" />
    <div v-if="category || tags.length" class="lgc-post-tags">
      <LgcPostMetaChips :category="category" :tags="tags" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-body {
  min-width: 0;
  align-self: center;
}

.lgc-post-title {
  margin: 0;
  font-size: var(--lgc-title-large);
  font-weight: 900;
  line-height: 1.25;
}

.lgc-post-title-link {
  color: inherit;
  text-decoration: none;
}

.lgc-post-title-link:hover,
.lgc-post-title-link:focus-visible {
  color: var(--md-sys-color-primary);
}

.lgc-post-excerpt {
  margin-top: 0.75rem;
  overflow: hidden;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.75;
}

.lgc-post-excerpt :deep(p) {
  margin: 0;
}

.lgc-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
</style>
