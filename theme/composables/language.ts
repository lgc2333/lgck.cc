import { ref } from 'vue'

export function useLanguageFlip() {
  const languageFlipping = ref(false)

  function flipLanguageIcon() {
    languageFlipping.value = false
    requestAnimationFrame(() => {
      languageFlipping.value = true
    })
  }

  function stopLanguageFlip() {
    languageFlipping.value = false
  }

  return {
    flipLanguageIcon,
    languageFlipping,
    stopLanguageFlip,
  }
}
