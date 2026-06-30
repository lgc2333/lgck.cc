# Theme Design

This document is primarily for AI agents implementing or extending this theme. Keep the theme aligned with this design before writing code.

## References First

If unsure about any Material 3 / Material 3 Expressive decision, search and review the current official guidance before implementing. Do not rely only on memory.

Start from these references:

- Material Design 3: <https://m3.material.io/>
- Material Design 3 Expressive: <https://m3.material.io/blog/building-with-m3-expressive>
- Google Design, M3 Expressive research: <https://design.google/library/expressive-material-design-google-research>
- Material 3 styles: <https://m3.material.io/styles>
- Material 3 color: <https://m3.material.io/styles/color/overview>
- Material 3 elevation: <https://m3.material.io/styles/elevation/overview>
- Material 3 motion: <https://m3.material.io/styles/motion/overview>

Search terms that usually help:

- `Material 3 Expressive official guidelines`
- `Material 3 Expressive color shape motion`
- `Material 3 surface container tonal elevation`
- `Material 3 state layers hover pressed focus`

## Direction

Build a Valaxy theme centered on a configurable landing screen, not a default post list. The first viewport is the product: avatar/mark, site title, short subtitle, social icons, and a dock-like link matrix. Current posts are an optional second section and are disabled by default.

The visual language is **Material 3 / M3 Expressive x soft blue character site**.

- Blue is the primary color.
- Character impression comes from soft blue/white, cookie brown, ribbon pink, rounded avatar/twin-tail motifs, dots, and small star accents.
- Use filled tonal surfaces instead of outlines and shadows.
- Keep reading surfaces calm and durable for a long-running blog.
- The theme must work without bundled character images.

## Design Principles

- **Landing first:** Home defaults to `landing-only`. Do not show posts unless the user enables `landing.showPosts`.
- **M3 hierarchy:** Use color roles, tonal surface containers, shape, state layers, and motion for hierarchy.
- **Low elevation:** Most elements have no border and no shadow. Use `surface-container-*` color steps. Reserve shadows for rare floating affordances only.
- **Expressive focus:** Spend personality on the central landing composition and dock links. Article pages and post cards should be quieter.
- **Blue dominant:** Primary blue carries navigation, selected states, primary links, and scroll affordance.
- **Accent restraint:** Cookie brown, ribbon pink, and gold are accents only. They should appear in meaningful states or character motifs, not flood the page.
- **Configurable assets:** Use a CSS-generated abstract avatar/mark by default. Allow user-provided avatar images later.
- **Responsive first:** Mobile keeps identity first, collapses dock links into large touch targets, and hides optional topbar links.

## Main Screen Design

The first viewport should feel like a polished personal entry screen:

- Topbar uses a filled `surface-container` background and no shadow.
- Left side contains primary navigation icon buttons.
- Right side contains language, dark mode, and search.
- The selected home icon uses a `primary-container` pill.
- Center identity block contains avatar/mark, eyebrow, title, subtitle, dock links, and social icons.
- Dock links are the main interaction area and should be visually stronger than social icons.
- Scroll hint is hidden or visually disabled when `landing.showPosts` is false.
- When `landing.showPosts` is true, show a clear scroll affordance and render posts below the first viewport.

Useful implementation structure:

```vue
<template>
  <main class="lgc-home">
    <section class="lgc-landing" :class="{ 'is-compact': landing.compact }">
      <LandingTopbar />
      <LandingIdentity />
      <LandingDock />
      <LandingSocials />
      <LandingScrollHint v-if="landing.showPosts" />
    </section>

    <LatestPosts v-if="landing.showPosts" />
  </main>
</template>
```

## Formal Main Screen Specification

The formal default home screen is **Soft Blue Dock Landing**.

### Composition

Use one full viewport landing surface with these regions:

```vue
<section class="lgc-landing">
  <LandingTopbar />
  <div class="lgc-landing-center">
    <LandingMark />
    <LandingEyebrow />
    <LandingTitle />
    <LandingSubtitle />
    <LandingDock />
    <LandingSocials />
  </div>
  <LandingScrollHint v-if="landing.showPosts" />
</section>
```

The landing surface should use `surface-container-lowest` to `surface-container-low`, with very subtle broad radial lighting from `primary-container` and `tertiary-container`. Do not use decorative orbs, bokeh blobs, or heavy gradients.

### Topbar

- Height: `64px` desktop, `72px` mobile if wrapping is needed.
- Background: `--md-sys-color-surface-container`.
- Shape: topbar itself is flush inside the landing frame; icon buttons carry shape.
- Left icons: home, posts, projects, album, links.
- Right icons: language, dark mode, search.
- Home icon selected by default.
- Selected icon width may expand to `64px` and use a pill shape.
- Optional middle links are hidden on small screens.

### Center Identity

- Center identity block is horizontally centered and vertically optically centered.
- Default mark is generated in CSS and must not require assets.
- If `landing.avatar` is provided, use the image inside the same mark container.
- Mark size: `116px` desktop, `96px` mobile.
- Title uses `--lgc-display-large`.
- Subtitle max width: `560px`; line-height around `1.7`.
- Eyebrow is optional but enabled by default.

### Dock Links

- Dock starts after the subtitle with `32px` vertical spacing.
- Dock max width: `720px`.
- Link height: `56px` desktop, `52px` mobile.
- Link shape: `--lgc-shape-dock-item`.
- No border and no shadow.
- Link variants:
  - `primary`: `primary` / `on-primary`.
  - `tonal`: `primary-container` / `on-primary-container`.
  - `default`: `surface-container-high` / `on-surface`.
  - `cookie`: `secondary-container` / `on-secondary-container`.
  - `ribbon`: `tertiary-container` / `on-tertiary-container`.
- On mobile, links become a two-column grid. Avoid text overflow.

### Social Icons

- Social icons sit below the dock with `20px` spacing.
- Use transparent icon buttons with state layer only.
- Social icons must not visually compete with dock links.

### Scroll Hint

- If `landing.showPosts` is false, do not render the scroll hint.
- If true, render a bottom-centered pill using `surface-container-high` and primary arrow.
- The scroll hint links to the posts section.

### Optional Posts Preview

When enabled, posts begin after the first viewport. Use filled tonal cards with no outline:

```vue
<section id="posts" class="lgc-posts">
  <PostCard v-for="post in posts" :key="post.path" :post="post" />
</section>
```

Cards use:

- Date block in `primary-container`.
- Title in `on-surface`.
- Summary in `on-surface-variant`.
- Tags in `surface-container-highest`.
- Arrow/action in `primary-container`.

### Responsive Rules

- `>= 980px`: full dock row with wrapping allowed.
- `< 980px`: landing frame radius reduces to `28px`; optional topbar links may hide.
- `< 640px`: dock links become two columns; mark becomes smaller; title remains large but must not overflow.
- Do not put hero-scale text inside compact panels.

## Design Tokens

Use CSS variables. Material role names are allowed for Material roles; custom theme tokens must use the `--lgc-*` prefix.

### Color Roles

```css
:root {
  --md-sys-color-primary: #2e6f9f;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #d0e9ff;
  --md-sys-color-on-primary-container: #001d33;

  --md-sys-color-secondary: #6f5b52;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-secondary-container: #f9ded3;
  --md-sys-color-on-secondary-container: #291812;

  --md-sys-color-tertiary: #8f4f50;
  --md-sys-color-tertiary-container: #ffdad9;
  --md-sys-color-on-tertiary-container: #3b080d;

  --md-sys-color-surface: #fbfcff;
  --md-sys-color-surface-container-lowest: #ffffff;
  --md-sys-color-surface-container-low: #f4f8fc;
  --md-sys-color-surface-container: #edf3f9;
  --md-sys-color-surface-container-high: #e7eef5;
  --md-sys-color-surface-container-highest: #dfe8f1;
  --md-sys-color-on-surface: #171c21;
  --md-sys-color-on-surface-variant: #5d6873;

  --lgc-cookie: #a6794b;
  --lgc-cookie-chip: #4e382e;
  --lgc-ribbon: #c77970;
  --lgc-star: #ecd062;
  --lgc-blue-dot: #9fcdf7;
}
```

Dark mode should preserve the blue identity, not become pure black:

```css
html.dark {
  --md-sys-color-primary: #9fcdf7;
  --md-sys-color-on-primary: #003353;
  --md-sys-color-primary-container: #174d73;
  --md-sys-color-on-primary-container: #d0e9ff;

  --md-sys-color-secondary: #dec2b7;
  --md-sys-color-on-secondary: #3f2c25;
  --md-sys-color-secondary-container: #574139;
  --md-sys-color-on-secondary-container: #f9ded3;

  --md-sys-color-tertiary: #ffb3b4;
  --md-sys-color-tertiary-container: #723638;
  --md-sys-color-on-tertiary-container: #ffdad9;

  --md-sys-color-surface: #101418;
  --md-sys-color-surface-container-lowest: #0b0f13;
  --md-sys-color-surface-container-low: #171c21;
  --md-sys-color-surface-container: #1b2228;
  --md-sys-color-surface-container-high: #252d34;
  --md-sys-color-surface-container-highest: #303942;
  --md-sys-color-on-surface: #e8eef4;
  --md-sys-color-on-surface-variant: #bec8d2;

  --lgc-cookie: #d2a36e;
  --lgc-cookie-chip: #51392e;
  --lgc-ribbon: #efaaa3;
  --lgc-star: #f2d86b;
  --lgc-blue-dot: #78b8ed;
}
```

### Shape

```css
:root {
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;

  --lgc-shape-page: 40px;
  --lgc-shape-avatar: 34px;
  --lgc-shape-dock-item: 24px;
}
```

Use shape intentionally:

- Topbar icon buttons: `16px`; selected state becomes pill.
- Landing frame: `40px` desktop, `28px` on mobile.
- Dock links: `24px`; hover morphs toward pill.
- Post cards: `28px`; hover may soften to `34px`.

### Typography

Use system CJK sans by default. Do not depend on remote font loading.

```css
:root {
  --lgc-font-display: "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif;
  --lgc-font-body: Inter, "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif;
  --lgc-display-large: clamp(42px, 8.6vw, 96px);
  --lgc-headline-large: clamp(28px, 4vw, 44px);
  --lgc-title-large: 22px;
  --lgc-body-large: 16px;
  --lgc-label-large: 14px;
}
```

No negative letter spacing. Do not scale ordinary text with viewport width. Use `clamp()` only for true landing headings.

### Motion And State

```css
:root {
  --lgc-motion-short: 160ms;
  --lgc-motion-medium: 260ms;
  --lgc-easing-standard: cubic-bezier(.2, 0, 0, 1);
  --lgc-state-hover-opacity: .08;
  --lgc-state-focus-opacity: .12;
  --lgc-state-pressed-opacity: .12;
}
```

- Hover uses a state-layer overlay at 8%.
- Pressed scales to `.98` or `.96` for icon buttons and briefly reduces corner radius.
- Shape morph is allowed for dock links and selected nav items.
- Always support `prefers-reduced-motion`.

Example:

```css
.lgc-dock-link {
  border: 0;
  border-radius: var(--lgc-shape-dock-item);
  background: var(--md-sys-color-surface-container-high);
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-medium) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-dock-link:hover {
  border-radius: 999px;
  background-image:
    linear-gradient(
      color-mix(in srgb, currentColor calc(var(--lgc-state-hover-opacity) * 100%), transparent),
      color-mix(in srgb, currentColor calc(var(--lgc-state-hover-opacity) * 100%), transparent)
    );
}
```

## Components

### Landing Topbar

- Filled `surface-container`.
- No shadow.
- No default outline.
- Selected item uses `primary-container`.
- Mobile hides optional middle nav icons.

### Identity Block

- Default avatar is CSS-generated: soft blue rounded square, abstract twin-tail/hair shapes, and a cookie badge.
- `landing.avatar` can replace the CSS mark.
- Eyebrow uses `secondary-container` and three tiny dots: ribbon, cookie, primary.
- Title is large and centered.
- Subtitle is max-width limited and readable.

### Dock Links

Dock links are the main action area.

Variants:

- `primary`: main content link.
- `tonal`: important internal link, using `primary-container`.
- `default`: regular link, using `surface-container-high`.
- `cookie`: secondary/cookie accent, using `secondary-container`.
- `ribbon`: support/sponsor accent, using `tertiary-container`.

No outlines by default. Use icons when available.

### Social Row

- Icon-only.
- Transparent by default.
- State layer on hover/focus.
- Lower visual weight than dock links.

### Scroll Hint

- Hidden or disabled when `landing.showPosts` is false.
- Visible and clickable when `landing.showPosts` is true.
- Use `surface-container-high` pill with primary arrow.

### Posts Section

- Disabled by default.
- When enabled, render below the first viewport.
- Use filled tonal cards, not outlined cards.
- Cards include date block, title, summary, tags, and arrow.
- Covers are optional. Do not require post images.

## Theme Config Shape

```ts
themeConfig: {
  landing: {
    enable: true,
    showPosts: false,
    compact: false,
    avatar: '',
    eyebrow: 'soft blue / cookie / ribbon',
    title: '',
    subtitle: '',
    links: [
      { text: '博客文章', link: '/posts', icon: 'i-ri-article-line', variant: 'primary' },
      { text: '项目列表', link: '/projects', icon: 'i-ri-layout-grid-line', variant: 'tonal' },
      { text: '友情链接', link: '/links', icon: 'i-ri-link', variant: 'cookie' },
    ],
    socials: [
      { text: 'GitHub', link: '', icon: 'i-ri-github-line' },
    ],
  },
}
```

## Implementation Notes

- Keep the theme usable without image assets.
- Do not place cards inside cards.
- Avoid decorative blobs/orbs. Subtle broad radial lighting is acceptable.
- Avoid a one-note blue palette. Blue dominates, but brown/pink/gold accents must appear in small, meaningful states.
- Use icon libraries already available in the project. Do not hand-roll SVG icons.
- The same token system must drive light and dark mode.
- Before finalizing implementation, verify desktop and mobile screenshots.
- If the implementation starts drifting from M3 Expressive, pause and re-check the references in this document.
