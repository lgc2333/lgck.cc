<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{
  frontmatter: Post
}>()
</script>

<template>
  <dl class="lgc-article-author">
    <dt class="sr-only">Authors</dt>
    <dd>
      <div class="lgc-article-author-card">
        <img
          v-if="frontmatter.gravatar"
          :src="`https://gravatar.com/avatar/${frontmatter.gravatar}`"
          alt=""
          class="lgc-article-author-avatar"
        />
        <dl class="lgc-article-author-meta">
          <dt>Author</dt>
          <dd class="lgc-article-author-name">
            {{ frontmatter.author }}
          </dd>
          <dt v-if="frontmatter.twitter">Twitter</dt>
          <dd v-if="frontmatter.twitter">
            <a
              class="link"
              :href="`https://twitter.com/${frontmatter.twitter}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ frontmatter.twitter }}
            </a>
          </dd>
        </dl>
      </div>
    </dd>
  </dl>
</template>

<style scoped lang="scss">
.lgc-article-author {
  margin: 0;

  dd {
    margin: 0;
  }
}

.lgc-article-author-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--lgc-radius-large);
  background: var(--md-sys-color-surface-container);
}

.lgc-article-author-avatar {
  width: 3rem;
  height: 3rem;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.lgc-article-author-meta {
  display: grid;
  gap: 0.125rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;

  dt {
    color: var(--md-sys-color-on-surface-variant);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
  }
}

.lgc-article-author-name {
  color: var(--md-sys-color-on-surface);
  font-weight: 900;
}
</style>
