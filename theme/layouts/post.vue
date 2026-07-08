<script setup lang="ts">
import { usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const posts = usePostList()

const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])
</script>

<template>
  <Layout>
    <div class="lgc-page-surface">
      <RouterView v-slot="{ Component }">
        <component :is="Component">
          <template #main-nav>
            <LgcPostArticleNav :next-post="nextPost" :prev-post="prevPost" />
          </template>
        </component>
      </RouterView>
    </div>
  </Layout>
</template>
