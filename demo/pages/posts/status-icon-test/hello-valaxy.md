---
title:
  zh-CN: 你好，Valaxy！
  en: Hello, Valaxy!
date: 2022-03-22
updated: 2022-03-23
categories: $locale:category.valaxy_notes
tags:
  - valaxy
  - $locale:tag.notes
top: 1
cover: https://cdn.yunyoujun.cn/img/bg/girl-in-water-tank.webp
---

::: zh-CN

## 你好，Valaxy！

中文内容示例。

**加粗中文**
:::

::: en

## Hello, Valaxy!

English content sample.

**English Bold**
:::

```ts
import { defineConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-lgcuwukii'

export default defineConfig<ThemeConfig>({
  theme: 'lgcuwukii',

  themeConfig: {
    landing: {
      mode: 'compact',
    },
  },
})
```
