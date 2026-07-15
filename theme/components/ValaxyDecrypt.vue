<script lang="ts" setup>
import { runContentUpdated, useDecrypt, useFrontmatter } from 'valaxy'
import { defineComponent, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    encryptedContent: string
    hint?: string
  }>(),
  {
    hint: '',
  },
)

const password = ref('')
const decryptedContent = ref('')
const hasError = ref(false)

const { decrypt } = useDecrypt()
const { t } = useI18n()

async function decryptContent() {
  const ciphertext = props.encryptedContent
  if (!ciphertext) return

  try {
    const result = await decrypt(password.value, ciphertext)
    decryptedContent.value = result || ''

    setTimeout(() => {
      runContentUpdated()
    }, 16)
  } catch (e) {
    hasError.value = true
    console.error(e)
  }
}

function encryptAgain() {
  decryptedContent.value = ''
  password.value = ''

  setTimeout(() => {
    runContentUpdated()
  }, 16)
}

function handleRevealAfterEnter() {
  runContentUpdated()
}

const ValaxyDeprecatedContent = defineComponent({
  name: 'ValaxyDeprecatedContent',
  props: {
    html: String,
  },
  render() {
    const content = `<div>${this.html}</div>`
    return h({
      setup: () => {
        const fm = useFrontmatter()
        return {
          frontmatter: fm,
        }
      },
      template: content,
    })
  },
})
</script>

<template>
  <div>
    <Transition
      name="lgc-decrypt-swap"
      mode="out-in"
      @after-enter="handleRevealAfterEnter"
    >
      <div v-if="!decryptedContent" key="locked" w-full p-y="$lgc-space-5xl">
        <form
          class="lgc-decrypt"
          grid
          w-full
          max-w="[min(100%,34rem)]"
          gap="$lgc-space-sm"
          m-x="auto"
          @submit.prevent="decryptContent"
        >
          <div
            v-if="hint"
            text="$md-sys-color-on-surface-variant"
            text-size="$lgc-body-medium"
            leading="relaxed"
            v-html="hint"
          />

          <div
            class="lgc-decrypt__field"
            grid
            grid-cols="[minmax(0,1fr)_auto]"
            items-center
            gap="$lgc-space-sm"
          >
            <input
              v-model="password"
              class="lgc-decrypt__input"
              w-full
              min-h="$lgc-control-size"
              border="0"
              rounded="$lgc-radius-control"
              bg="$md-sys-color-surface-container-lowest"
              p-x="$lgc-space-lg"
              p-y="$lgc-space-sm"
              text="$md-sys-color-on-surface"
              text-size="$lgc-body-medium"
              outline="none"
              type="password"
              :placeholder="t('post.decrypt_password_placeholder')"
              :class="{ 'is-error': hasError }"
              @input="hasError = false"
            />

            <button
              class="lgc-decrypt__submit"
              type="submit"
              size="$lgc-control-size"
              border="0"
              rounded="$lgc-radius-control"
              bg="$md-sys-color-primary-container"
              text="$md-sys-color-primary"
              shrink-0
              inline-grid
              cursor-pointer
              place-items-center
              :aria-label="t('post.decrypt')"
            >
              <span
                class="i-material-symbols-arrow-forward-rounded"
                text-size="$lgc-icon-size"
                aria-hidden="true"
              />
            </button>
          </div>
        </form>
      </div>

      <div v-else key="unlocked" class="lgc-decrypt__content">
        <ValaxyDeprecatedContent :html="decryptedContent" />
        <div text-center w-full m-t="$lgc-space-3xl">
          <button
            class="lgc-decrypt__reset"
            type="button"
            min-h="$lgc-control-size-compact"
            border="0"
            rounded="$lgc-radius-control"
            bg="$md-sys-color-secondary-container"
            p-x="$lgc-space-xl"
            p-y="$lgc-space-sm"
            text="$md-sys-color-on-secondary-container"
            text-size="$lgc-label-medium"
            font="800"
            inline-flex
            cursor-pointer
            items-center
            justify-center
            @click="encryptAgain"
          >
            {{ t('post.encrypt_again') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.lgc-decrypt__input,
.lgc-decrypt__submit,
.lgc-decrypt__reset {
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    color var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-decrypt__input:hover,
.lgc-decrypt__input:focus {
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-surface';
}

.lgc-decrypt__input.is-error {
  @apply 'bg-$md-sys-color-error-container text-$md-sys-color-on-error-container';
}

.lgc-decrypt__input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
}

.lgc-decrypt__submit:hover,
.lgc-decrypt__submit:focus-visible {
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-primary text-$md-sys-color-on-primary';
  transform: translateY(-1px);
}

.lgc-decrypt__reset:hover,
.lgc-decrypt__reset:focus-visible {
  @apply 'rounded-$lgc-radius-control-active bg-$md-sys-color-secondary text-$md-sys-color-on-secondary';
  transform: translateY(-1px);
}

.lgc-decrypt__submit:active,
.lgc-decrypt__reset:active {
  transform: scale(var(--lgc-control-press-scale));
}

.lgc-decrypt-swap-enter-active,
.lgc-decrypt-swap-leave-active {
  transition:
    opacity var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-decrypt-swap-enter-from {
  opacity: 0;
  transform: translateY(var(--lgc-space-md));
}

.lgc-decrypt-swap-leave-to {
  opacity: 0;
  transform: translateY(calc(-1 * var(--lgc-space-sm)));
}

@media (prefers-reduced-motion: reduce) {
  .lgc-decrypt-swap-enter-active,
  .lgc-decrypt-swap-leave-active {
    transition: none;
  }

  .lgc-decrypt-swap-enter-from,
  .lgc-decrypt-swap-leave-to {
    transform: none;
  }
}
</style>
