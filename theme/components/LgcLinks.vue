<script setup lang="ts">
import { useValaxyI18n } from 'valaxy'
import { computed, onMounted, ref } from 'vue'

type LocaleText = string | Record<string, string>
type AvatarStage = 'avatar' | 'fallback'

interface LgcLink {
  avatar?: string
  blog?: LocaleText
  desc?: LocaleText
  name?: LocaleText
  url: string
}

interface AvatarView {
  kind: 'icon' | 'image'
  stage?: AvatarStage
  value: string
}

interface DisplayLink extends LgcLink {
  avatarView: AvatarView
  blogText: string
  descText: string
  nameText: string
  titleText: string
}

const props = withDefaults(
  defineProps<{
    errorImg?: string
    links: string | LgcLink[]
    random?: boolean
  }>(),
  {
    errorImg: '',
    random: false,
  },
)

const DEFAULT_AVATAR_ICON = 'i-material-symbols-link-rounded'
const ICON_PREFIX = 'i-'
const { $t, $tO } = useValaxyI18n()
const rawLinks = ref<LgcLink[]>(Array.isArray(props.links) ? props.links : [])
const failedAvatars = ref(new Set<string>())

function randomize<T>(items: T[]) {
  return props.random ? [...items].sort(() => Math.random() - 0.5) : [...items]
}

function normalizeAsset(value?: string) {
  const asset = value?.trim() || ''
  return asset === '#' ? '' : asset
}

function failureKey(link: LgcLink, stage: AvatarStage) {
  return `${link.url}:${stage}`
}

function hasFailed(link: LgcLink, stage: AvatarStage) {
  return failedAvatars.value.has(failureKey(link, stage))
}

function markFailed(link: LgcLink, stage?: AvatarStage) {
  if (!stage) {
    return
  }

  const next = new Set(failedAvatars.value)
  next.add(failureKey(link, stage))
  failedAvatars.value = next
}

function resolveText(value?: LocaleText) {
  if (!value) {
    return ''
  }
  return typeof value === 'string' ? $t(value) : String($tO(value) || '')
}

function resolveImageOrIcon(value: string, stage: AvatarStage): AvatarView {
  return value.startsWith(ICON_PREFIX)
    ? { kind: 'icon', value }
    : { kind: 'image', stage, value }
}

function resolveAvatar(link: LgcLink): AvatarView {
  const avatar = normalizeAsset(link.avatar)
  if (avatar && !hasFailed(link, 'avatar')) {
    return resolveImageOrIcon(avatar, 'avatar')
  }

  const fallback = normalizeAsset(props.errorImg)
  if (fallback && !hasFailed(link, 'fallback')) {
    return resolveImageOrIcon(fallback, 'fallback')
  }

  return {
    kind: 'icon',
    value: DEFAULT_AVATAR_ICON,
  }
}

function displayTitle(...parts: string[]) {
  return parts
    .filter(Boolean)
    .filter((part, index, list) => list.indexOf(part) === index)
    .join(' / ')
}

async function loadLinks(source: string) {
  try {
    const response = await fetch(source)
    if (!response.ok) {
      return
    }

    const data = (await response.json()) as unknown
    rawLinks.value = Array.isArray(data) ? randomize(data as LgcLink[]) : []
  } catch {
    rawLinks.value = []
  }
}

onMounted(() => {
  if (typeof props.links === 'string') {
    void loadLinks(props.links)
    return
  }

  if (props.random) {
    rawLinks.value = randomize(props.links)
  }
})

const links = computed<DisplayLink[]>(() =>
  rawLinks.value.map((link) => {
    const nameText = resolveText(link.name)
    const blogText = resolveText(link.blog) || nameText || link.url
    const descText = resolveText(link.desc)

    return {
      ...link,
      avatarView: resolveAvatar(link),
      blogText,
      descText,
      nameText,
      titleText: displayTitle(nameText, blogText, descText),
    }
  }),
)
</script>

<template>
  <div my="$lgc-space-lg">
    <ul
      class="lgc-link-items"
      flex="~ wrap justify-center"
      gap="$lgc-space-sm sm:$lgc-space-md"
      m="0"
      p="0"
      list="none"
    >
      <li v-for="link in links" :key="link.url" class="lgc-link-item">
        <a
          class="lgc-link-card"
          grid="~ cols-[auto_minmax(0,1fr)]"
          w="full"
          gap="$lgc-space-md"
          p="$lgc-space-md sm:$lgc-space-lg"
          rounded="$lgc-radius-control"
          bg="$md-sys-color-surface-container-high"
          no-underline
          items-center
          :aria-label="link.titleText || link.blogText"
          :href="link.url"
          :title="link.titleText"
          target="_blank"
          rel="friend noopener noreferrer"
        >
          <span
            class="lgc-link-avatar"
            shrink-0
            grid
            place-items-center
            overflow-hidden
            size="14"
            rounded="$lgc-radius-md"
            text="size-$lgc-icon-size"
            aria-hidden="true"
          >
            <img
              v-if="link.avatarView.kind === 'image'"
              m="0!"
              size="full"
              max-w="none!"
              object="cover center"
              :src="link.avatarView.value"
              alt=""
              loading="lazy"
              @error="markFailed(link, link.avatarView.stage)"
            />
            <span v-else :class="link.avatarView.value" aria-hidden="true" />
          </span>

          <span min-w="0" gap="1" text-left grid>
            <span
              min-w="0"
              truncate
              text="size-$lgc-body-large"
              font="900"
              leading="snug"
            >
              {{ link.blogText }}
            </span>
            <span
              v-if="link.descText"
              min-w="0"
              wrap="anywhere"
              text="$md-sys-color-on-surface-variant size-$lgc-body-small"
              font="500"
              leading="snug"
            >
              {{ link.descText }}
            </span>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.lgc-link-items {
  list-style: none;
}

.lgc-link-item {
  inline-size: min(100%, 20rem);
  list-style: none;
}

.lgc-link-card {
  @apply 'text-$md-sys-color-on-surface';
  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-link-card:hover,
.lgc-link-card:focus-visible {
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-surface-container-highest';
  @apply 'text-$md-sys-color-primary';
  transform: translateY(-2px);
}

.lgc-link-card:focus-visible {
  outline: var(--lgc-focus-ring) solid var(--md-sys-color-primary);
  outline-offset: 3px;
}

.lgc-link-card:active {
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-surface-container-low';
  transform: scale(var(--lgc-card-press-scale));
}

.lgc-link-avatar {
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-variant) 20%,
    var(--md-sys-color-surface-container-highest)
  );
  color: var(--md-sys-color-on-surface-variant);
}
</style>
