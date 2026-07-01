# Theme Design

AI-facing design notes for `valaxy-theme-lgcuwukii`. Keep this concise and use code as the source of truth for exact tokens.

## Check References First

If a Material 3 / Material 3 Expressive decision is unclear, search and review official references before implementing. Do this before relying on memory or copying older theme decisions.

Recommended starting points:

- [Material Design 3](https://m3.material.io/)
- [Material 3 Expressive announcement](https://m3.material.io/blog/building-with-m3-expressive)
- [Expressive Material Design research](https://design.google/library/expressive-material-design-google-research)
- [Material 3 styles](https://m3.material.io/styles)
- [Material 3 color](https://m3.material.io/styles/color/overview)
- [Material 3 elevation](https://m3.material.io/styles/elevation/overview)
- [Material 3 motion](https://m3.material.io/styles/motion/overview)

Useful search terms:

- `Material 3 Expressive official guidelines`
- `Material 3 Expressive color shape motion`
- `Material 3 surface container tonal elevation`
- `Material 3 state layer hover pressed focus`

## Direction

The home page is a configurable Valaxy landing screen with optional posts below it. Visual direction: **Material 3 / M3 Expressive x soft blue character site**.

- Blue is the primary color.
- Character impression comes from soft blue and white surfaces, cookie-brown and ribbon-pink accents, rounded shapes, light dot texture, and gentle expressive motion.
- Prefer filled tonal surfaces over outlines and shadows.
- Keep article/post reading surfaces calmer than the landing screen.
- The theme must work without bundled character images.

## Current Main Screen

- `LgcLandingHome.vue` owns the first viewport and optional posts section.
- `LgcLandingTopbar.vue`, `LgcLandingDock.vue`, `LgcLandingSocials.vue`, `LgcLandingMark.vue`, and `LgcLandingPostCard.vue` own their local styles.
- `theme/styles/layout.scss` should stay small: global text, page background, focus, and reduced-motion only.
- `theme/styles/css-vars.scss` stores shared Material color roles and reusable lgc typography/motion tokens.

## Landing Rules

- Use one full viewport landing surface.
- Topbar floats over the landing and uses rounded icon buttons with Material state layers.
- Center content is optically centered. Do not reintroduce a vertical center line.
- Background atmosphere should be diffuse and soft. Avoid solid-center blur circles, visible decorative orbs, and heavy gradients.
- Dock links are the main interaction area and should be stronger than social icons.
- Social icons stay icon-only and visually quiet.
- `landing.showPosts` controls whether posts and the scroll hint render. It is currently enabled by default so the preview shows the post list.

## Avatar

- Do not simulate an avatar with CSS.
- Use `themeConfig.landing.avatar` when present.
- If `landing.avatar` is empty, hide the avatar area completely.
- Do not add decorative badges below or on top of the avatar unless they are a real configurable feature.

## Style Constraints

- Use Uno utility classes directly in Vue components for one-off layout and sizing.
- Component-specific SCSS belongs in the component's scoped `<style>`.
- Add global SCSS only for behavior shared across the theme.
- Do not create CSS variables for values used only once.
- Do not use `--uwk-*`; custom theme tokens use the `--lgc-*` prefix.
- Use Material Symbols Rounded as the primary icon language. Additional rounded icon sets are fine when needed.
- Iconify icons used by config must be safelisted or loaded through the theme's Uno icon collections.

## Material Feel

- No default outlines on cards/buttons. Use state layers and tonal containers.
- No default shadows for landing controls or post cards.
- Shape is expressive but disciplined: pills for selected icons and scroll hint, large rounded cards for posts, smaller rounded states on hover.
- Motion should be subtle shape/position feedback and must respect `prefers-reduced-motion`.
- Text must fit on mobile. Do not use viewport-scaled font sizes except for the landing title.

## Theme Config Shape

```ts
themeConfig: {
  landing: {
    enable: true,
    showPosts: true,
    compact: false,
    avatar: '',
    eyebrow: 'soft blue / cookie / ribbon',
    title: '',
    subtitle: '',
    links: [
      { text: '博客文章', link: '/posts', icon: 'i-material-symbols-article-outline-rounded', variant: 'primary' },
      { text: '项目列表', link: '/projects', icon: 'i-material-symbols-dashboard-outline-rounded', variant: 'tonal' },
      { text: '友情链接', link: '/links', icon: 'i-material-symbols-link-rounded', variant: 'cookie' },
    ],
    socials: [
      { text: 'GitHub', link: '', icon: 'i-simple-icons-github' },
    ],
  },
}
```

## Before Finalizing

- Build the demo site and confirm Iconify classes are emitted in the CSS.
- Verify desktop and mobile layouts.
- If the design starts drifting from M3 Expressive, pause and re-check the official references above.
