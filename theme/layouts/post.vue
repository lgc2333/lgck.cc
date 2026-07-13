<script setup lang="ts">
import { useFrontmatter, usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const frontmatter = useFrontmatter()
const posts = usePostList()

const showArticleNav = computed(() => frontmatter.value.nav !== false)
const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])
</script>

<template>
  <Layout>
    <div class="lgc-page-surface">
      <RouterView v-slot="{ Component }">
        <component :is="Component">
          <template #main-content-after>
            <LgcPostContentAfter />
          </template>

          <template #main-nav>
            <LgcPostArticleNav
              v-if="showArticleNav"
              :next-post="nextPost"
              :prev-post="prevPost"
            />
          </template>

          <template #aside>
            <LgcPostAside />
          </template>
        </component>
      </RouterView>
    </div>
  </Layout>
</template>
