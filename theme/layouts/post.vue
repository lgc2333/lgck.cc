<script setup lang="ts">
import { useFrontmatter, usePostList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { normalizePostListValue } from '../utils/post'

const frontmatter = useFrontmatter()
const route = useRoute()
const posts = usePostList()

const currentIndex = computed(() => posts.value.findIndex((p) => p.path === route.path))
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])

const tags = computed(() => normalizePostListValue(frontmatter.value.tags))
const categories = computed(() => normalizePostListValue(frontmatter.value.categories))
</script>

<template>
  <Layout>
    <div class="lgc-page-surface">
      <RouterView v-slot="{ Component }">
        <component :is="Component">
          <template #main-header>
            <LgcPostArticleHeader
              :categories="categories"
              :frontmatter="frontmatter"
              :tags="tags"
            />
          </template>

          <template #main-nav>
            <LgcPostArticleNav :next-post="nextPost" :prev-post="prevPost" />
          </template>
        </component>
      </RouterView>
    </div>
  </Layout>
</template>
