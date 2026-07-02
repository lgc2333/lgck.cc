# M3 Loading Indicator Notes

This module implements the Material 3 Expressive loading indicator for canvas.
When changing it, use official AndroidX or Flutter source as the fact standard.
Do not use old staged diffs or previous local attempts as implementation reference.

Current primary reference files in an official AndroidX checkout:

- `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/LoadingIndicator.kt`
- `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt`
- `graphics/graphics-shapes/src/commonMain/kotlin/androidx/graphics/shapes/`

## Structure

- `index.ts`: canvas controller, timing, spring, rotation, color, and drawing.
- `material-shapes.ts`: the seven indeterminate shapes in official order.
- `rounded-polygon.ts`, `geometry.ts`, `morph.ts`, `math.ts`, `types.ts`: AndroidX graphics-shapes port.
- `path.ts`: converts morphed cubics into centered canvas-space paths.
- `graphics.ts`: barrel export for the geometry/morph/path modules.

## Official Parameters

- Container: `48 x 48`.
- Active indicator size: `38`.
- Active scale: `38 / 48`.
- Indeterminate shape order: `SoftBurst`, `Cookie9Sided`, `Pentagon`, `Pill`, `Sunny`, `Cookie4Sided`, `Oval`.
- Morph interval: `650ms`.
- Global rotation duration: `4666ms`.
- Morph rotation step: `90deg`.
- Spring: damping ratio `0.6`, stiffness `200`.

## Current Visual Decisions

- The pentagon has a centered bounds box but a lower visual/area centroid. Centering
  by bounds makes it look off-center, so `path.ts` centers by sampled filled-area
  centroid, with bounds-center fallback for degenerate shapes.
- The spring value may overshoot `1`. To match the M3E website's perceived bounce,
  `index.ts` clamps morph progress to `[0, 1]` and maps positive overshoot to an
  overall `bounceScale`. This avoids exaggerated shape extrapolation while making
  the indicator read as scaling briefly.

## Verification

After implementation changes, run:

```bash
pnpm format
pnpm lint
pnpm check
pnpm --dir demo build
```

The demo build may emit unrelated Rolldown pure-annotation warnings from
`@vueuse/core` and existing draft-post warnings.
