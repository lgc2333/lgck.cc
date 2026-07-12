declare module '@vue/runtime-dom' {
  interface HTMLAttributes {
    [key: string]: any
  }
}

declare module '@vue/runtime-core' {
  interface AllowedComponentProps {
    [key: string]: any
  }
}

declare module '*.ttf' {
  export const css: {
    family: string
    style?: string
    weight?: string | number
  }
  export const fontFamilyFallback: string
}

declare module 'virtual:lgc-material-colors.css' {}

export {}
