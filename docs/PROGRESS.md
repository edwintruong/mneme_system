# Mneme implementation progress

Last updated: 2026-08-27

## Current milestone

The app is a React + TypeScript + Vite web app deployed to Google AI Studio, which runs it on
Cloud Run. It is local-first and requires no login.

Commit `fce32d0` rewrote the Flutter app in React but did not carry over the Figma fidelity the
Flutter build had reached. Restoring that fidelity against section `2159:12770` is the active work.

## Completed

- Removed the last Flutter remnants: `lib/`, `android/`, `ios/`, `web/`, `test/`, `build/`,
  `.dart_tool/`, `assets/`, `pubspec.yaml`, `pubspec.lock`, `.metadata`, `analysis_options.yaml`,
  `mneme.iml`, `.flutter-plugins-dependencies`. `public/assets/` was verified to be a superset of
  the deleted `assets/` first.
- Rebuilt `FigmaIcon` on a registry of 41 SVGs exported from Figma. It renders each export at its
  intrinsic aspect ratio and recolors through a CSS mask, so a glyph keeps its exported path.
  Dropped `lucide-react`: all 24 icon names used across the screens now resolve to Figma exports,
  and no icon-library glyph ships.
- Rebuilt the bottom navigation on the exported 390x75 notched bar (`home_nav_bg.svg`) with the
  per-tab Figma vectors, replacing the wrong glyphs the migration left (an open book for Notebook,
  a sparkle for Activity, an avatar crop for Profile).
- Replaced the hand-drawn `✓`/`✕` toast glyphs with the exact `2159:13227` success vector.
- Narrowed the app shell from 412 px to the 390 px the Figma frames use, and replaced the emoji
  status bar with the exported status vector.
- Fixed two AI Studio deploy blockers in `server.ts`: the port was hardcoded to 3000 where Cloud Run
  assigns `PORT`, and `npm start` did not set `NODE_ENV=production`, so the container would have
  tried to boot Vite dev middleware from a devDependency absent in the production image. Verified
  `PORT=8080 npm start` serves the SPA, `/api/health`, and the static Figma icons.
- `tsc --noEmit`: clean. `npm run build`: clean.

## Home is rebuilt from the node

- Read node `2159:12771` with `get_design_context` and its tokens with `get_variable_defs`, then
  downloaded all 18 of its assets: 10 SVGs and 8 JPEGs.
- Rewrote `HomeScreen` against the node. The migration's version shared almost nothing with the
  design: it had no greeting header, rendered "Đã lưu gần đây" as a list of link tiles instead of a
  three-column 80px thumbnail rail, invented a "Danh mục kiến thức" carousel in place of the
  "Categories" list, and used tab labels the design does not use.
- Rebuilt the bottom navigation on the node's own 115px geometry: the FAB gradient
  `#613eea → #9f8aeb`, the notched 390x75 bar, and four 74px tabs.
- Put the Figma variables into `src/index.css` under names that mirror their Figma paths.
- Fixed the frame structure: the Figma frame carries `px-20`, which is why the status bar is 350
  wide starting at x=20 while Content is a full 390 overflowing that padding. Reproducing this is
  what put the status bar and its clock in the right place.
- Deleted the 14 corrupt rasters and repointed every reference to the new exports.
- Measured: mean absolute difference 3.09 / 3.11 / 3.05 of 255 over the design area. Avatar, search
  and filter icons, both 80px image rails, the FAB, the nav labels and the overflow dots all land
  within 1px. See `kit/docs/FIGMA_MAP.md` for the method and the two export gotchas.
- All four tabs and the add-link flow render with no broken images and no page errors.

## Blocked## Next work

1. Rebuild the remaining screens against their own `2159:*` nodes, in the order listed in
   `kit/docs/FIGMA_MAP.md`. They are still the migration's loose interpretation and still consume
   legacy `2143:*` icon exports.
2. Implement the Home toast state `2159:13227` against its node; it currently uses the exact
   success vector but its layout has not been node-verified.
3. Implement the two remaining Home variants, `2159:13303` and `2159:13676`.

## Important context

- Brand tokens live in `src/index.css`; the screens read them as literal hex values today.
- App state is exposed with `MnemeProvider` in `src/state/mnemeContext.tsx`.
- Gemini runs server-side in `server.ts` behind `/api/gemini/*`, keyed by `GEMINI_API_KEY`, which
  AI Studio configures as a server-side secret. Local fallback behavior is preserved.
- Figma asset URLs expire, so referenced assets are committed locally.
- Do not add authentication for this showcase build.
