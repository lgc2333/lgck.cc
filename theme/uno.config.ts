import { defineConfig } from 'unocss'

const mdVar = (name: string) => `var(--md-sys-color-${name})`

export const lgcUnoTheme = {
  colors: {
    md: {
      primary: mdVar('primary'),
      'on-primary': mdVar('on-primary'),
      'primary-container': mdVar('primary-container'),
      'on-primary-container': mdVar('on-primary-container'),
      secondary: mdVar('secondary'),
      'on-secondary': mdVar('on-secondary'),
      'secondary-container': mdVar('secondary-container'),
      'on-secondary-container': mdVar('on-secondary-container'),
      tertiary: mdVar('tertiary'),
      'tertiary-container': mdVar('tertiary-container'),
      'on-tertiary-container': mdVar('on-tertiary-container'),
      surface: mdVar('surface'),
      'surface-container-lowest': mdVar('surface-container-lowest'),
      'surface-container-low': mdVar('surface-container-low'),
      'surface-container': mdVar('surface-container'),
      'surface-container-high': mdVar('surface-container-high'),
      'surface-container-highest': mdVar('surface-container-highest'),
      'on-surface': mdVar('on-surface'),
      'on-surface-variant': mdVar('on-surface-variant'),
      outline: mdVar('outline'),
      'outline-variant': mdVar('outline-variant'),
    },
    cookie: {
      DEFAULT: '#8b6a50',
      text: '#fff7ed',
    },
    ribbon: {
      DEFAULT: '#c77970',
      text: '#fff8f6',
    },
  },
  fontFamily: {
    cjk: 'var(--lgc-font-family-cjk), var(--lgc-font-family-system)',
    mono: 'var(--va-font-mono)',
    sans: 'var(--lgc-font-family-sans)',
    display: 'var(--lgc-font-display)',
    body: 'var(--lgc-font-body)',
  },
  fontSize: {
    'lgc-display': 'var(--lgc-display-large)',
    'lgc-headline': 'var(--lgc-headline-large)',
    'lgc-title': 'var(--lgc-title-large)',
  },
}

export default defineConfig({
  presets: [],
  theme: lgcUnoTheme,
})
