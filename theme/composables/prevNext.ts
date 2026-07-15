import type { CollectionConfig, Post } from 'valaxy'
import { resolveCollectionItemHref, useValaxyI18n } from 'valaxy'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

import { normalizeLocaleText } from '../utils/post'

export interface LgcPrevNextItem {
  external?: boolean
  href: string
  title: string
}

export function usePostPrevNextItems(
  prevPost: MaybeRefOrGetter<Post | undefined>,
  nextPost: MaybeRefOrGetter<Post | undefined>,
) {
  const { t, locale } = useI18n()

  const prev = computed<LgcPrevNextItem | undefined>(() => {
    const post = toValue(prevPost)
    if (!post?.path) return undefined

    return {
      href: post.path,
      title: normalizeLocaleText(post.title, locale.value, t),
    }
  })

  const next = computed<LgcPrevNextItem | undefined>(() => {
    const post = toValue(nextPost)
    if (!post?.path) return undefined

    return {
      href: post.path,
      title: normalizeLocaleText(post.title, locale.value, t),
    }
  })

  return { next, prev }
}

export function useCollectionPrevNextItems(
  collection: MaybeRefOrGetter<CollectionConfig | undefined>,
  currentIndex: MaybeRefOrGetter<number>,
) {
  const { $tO } = useValaxyI18n()

  function resolveItem(
    item: NonNullable<CollectionConfig['items']>[number] | undefined,
  ) {
    const currentCollection = toValue(collection)
    if (!item || !currentCollection?.key) return undefined

    const resolved = resolveCollectionItemHref(currentCollection.key, item)
    return {
      external: resolved.isExternal,
      href: resolved.href,
      title: $tO(item.title || ''),
    }
  }

  const prev = computed<LgcPrevNextItem | undefined>(() => {
    const items = toValue(collection)?.items
    const index = toValue(currentIndex)
    if (!items || index < 0) return undefined

    return resolveItem(items[index - 1])
  })

  const next = computed<LgcPrevNextItem | undefined>(() => {
    const items = toValue(collection)?.items
    const index = toValue(currentIndex)
    if (!items || index < 0) return undefined

    return resolveItem(items[index + 1])
  })

  return { next, prev }
}
