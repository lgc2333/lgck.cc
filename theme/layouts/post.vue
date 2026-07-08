<template>
  <Layout>
    <div class="lgc-page-surface">
      <RouterView v-slot="{ Component }">
        <LgcPostArticle>
          <component :is="Component">
            <template #comment />
          </component>
        </LgcPostArticle>
      </RouterView>
    </div>
  </Layout>
</template>
