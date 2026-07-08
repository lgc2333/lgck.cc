<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useAppStore } from 'valaxy'
import LgcCommentFrame from 'valaxy-theme-lgcuwukii/components/LgcComment.vue'

const store = useAppStore()
</script>

<template>
  <LgcCommentFrame>
    <Giscus
      repo="lgc2333/blog"
      repo-id="R_kgDOLr1GDQ"
      category="Announcements"
      category-id="DIC_kwDOLr1GDc4Cen96"
      mapping="pathname"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="`https://blog.lgc2333.top/css/giscus/${store.isDark ? 'dark' : 'light'}.css`"
      lang="zh-CN"
      loading="lazy"
    />
  </LgcCommentFrame>
</template>
