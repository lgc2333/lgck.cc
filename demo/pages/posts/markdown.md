---
title:
  zh-CN: Markdown
  en: Markdown
---

::: zh-CN

## 自定义容器

下面的容器块演示 Markdown 扩展能力（提示框本身使用英文原文，便于对照官方示例）。
:::

::: en

## Custom Containers

The following blocks demonstrate Markdown extensions (container labels stay in English for the official sample).
:::

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

::: zh-CN

## 代码块中的彩色 Diff

:::

::: en

## Colored Diffs in Code Blocks

:::

<!-- eslint-skip -->

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
