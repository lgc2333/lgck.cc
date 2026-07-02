<script lang="ts" setup>
import { useAppStore, useSiteConfig } from 'valaxy'

// import { computed } from 'vue'
// import { useRoute } from 'vue-router'

// const route = useRoute()
// const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')

const appStore = useAppStore()

const siteConfig = useSiteConfig()
</script>

<template>
  <nav w="full" class="flex items-center justify-between py-10 font-bold">
    <RouterLink class="text-xl" to="/" :aria-label="siteConfig.title">
      <img
        class="mr-2 inline-block"
        style="width: 50px; height: 35px"
        alt="logo"
        :src="siteConfig.favicon"
      />
      <span class="hidden md:inline">{{ siteConfig.title }}</span>
    </RouterLink>
    <div class="text-sm text-gray-500 leading-5">
      <template v-for="(item, i) in siteConfig.social" :key="item.link">
        <AppLink :to="item.link" rel="noopener">
          {{ item.name }}
        </AppLink>
        <span v-if="i !== siteConfig.social.length - 1" class="ml-2 mr-2">·</span>
      </template>
    </div>

    <button
      type="button"
      aria-label="Toggle Dark Mode"
      @click="appStore.toggleDarkWithTransition"
    >
      <div v-if="!appStore.isDark" i-ri-sun-line />
      <div v-else i-ri-moon-line />
    </button>
  </nav>
</template>
