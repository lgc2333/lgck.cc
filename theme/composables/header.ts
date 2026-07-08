import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useRoute } from 'vue-router'

import type { HeaderActivePathRewrite, HeaderNavLink } from '../types'
import type { RouteActiveMatch } from '../utils/route'
import { isRouteLinkActive } from '../utils/route'

export function useHeaderNavItemState(options: {
  activeMatch?: MaybeRefOrGetter<RouteActiveMatch | undefined>
  activePathRewrites?: MaybeRefOrGetter<HeaderActivePathRewrite[] | undefined>
  item: MaybeRefOrGetter<HeaderNavLink>
}) {
  const route = useRoute()
  const isRouteActive = computed(() => {
    const item = toValue(options.item)
    return resolveHeaderNavItemState(
      route.path,
      item,
      toValue(options.activeMatch) || 'prefix',
      toValue(options.activePathRewrites),
    ).isRouteActive
  })
  const iconClass = computed(() => {
    const item = toValue(options.item)
    return isRouteActive.value ? item.activeIcon || item.icon : item.icon
  })

  return {
    iconClass,
    isRouteActive,
  }
}

export function resolveHeaderNavItemState(
  routePath: string,
  item: HeaderNavLink,
  activeMatch: RouteActiveMatch,
  activePathRewrites?: HeaderActivePathRewrite[],
) {
  const isRouteActive = isRouteLinkActive(
    routePath,
    item.link,
    activeMatch,
    activePathRewrites,
  )

  return {
    iconClass: isRouteActive ? item.activeIcon || item.icon : item.icon,
    isRouteActive,
  }
}
