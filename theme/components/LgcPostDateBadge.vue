<script setup lang="ts">
defineProps<{
  day: string
  rest: string
  datetime: string
}>()
</script>

<template>
  <time class="lgc-post-date" :datetime="datetime">
    <strong class="lgc-post-date-day">{{ day }}</strong>
    <span class="lgc-post-date-rest">{{ rest }}</span>
  </time>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-post-date {
  display: flex;
  width: 5.25rem;
  height: 5.25rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: start;
  border-radius: var(--lgc-radius-large);
  color: var(--md-sys-color-on-primary-container);
  background-color: var(--md-sys-color-primary-container);
}

.lgc-post-date-day {
  font-size: 2rem;
  line-height: 1;
}

.lgc-post-date-rest {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@include compact-up {
  .lgc-post-date {
    width: 6rem;
    height: 6rem;
    justify-self: start;
  }
}
</style>
