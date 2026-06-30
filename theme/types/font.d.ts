declare module '*.ttf' {
  export const css: {
    family: string
    style?: string
    weight?: string | number
  }
  export const fontFamilyFallback: string
}
