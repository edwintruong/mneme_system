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

## Link detail is rebuilt from the node

- Replaced the legacy detail UI with node `2159:12980`: reversed status chrome, exact back/share
  actions, 350x164 cover crop, 350x368 information card, chips, source/save metadata, and the fixed
  102px bottom action area.
- Verified the handoff's nine SVGs and cover JPEG byte-for-byte against current MCP downloads, then
  exported the node-specific mobile-signal, Wi-Fi, and battery vectors instead of recoloring Home's
  status export.
- Added the exact Bún chả detail fixture as the fourth saved link, preserving Home's measured
  three-item recent rail, and taught the comparison script to reach it through the real Activity
  flow.
- Production comparison: 6.79 / 6.54 / 5.55 with 6.53% of pixels over 28. The mask has no solid
  displaced structures; remaining differences are Chrome/Figma glyph rasterization and JPEG
  re-encoding detail on this text-heavy frame.
- Replaced stale Flutter instructions in `kit/docs/ARCHITECTURE.md` and `kit/docs/ASSETS.md` with the
  current React/Vite/Cloud Run paths and validation contract.

## Category list and create-folder sheet are rebuilt from their nodes

- Rebuilt `CategoryScreen` from `2159:13036` with its exact movie fixture, four 154x72 folder
  tiles, four 112px link rows, folder crop, thumbnails, filters, typography, and node-exported
  glyphs. The links remain backed by `MnemeProvider` seed/state and navigate through the real view
  stack.
- Replaced the invented centered modal with the exact bottom sheet from `2159:13091`; close,
  cancel, and save stay interactive, and save still uses the existing local-first folder mutation.
- Production comparison: Category list 4.87 / 4.98 / 4.82 (5.94% over 28); Create folder
  2.12 / 2.20 / 1.67 (3.06% over 28). Both masks have only raster/text edge residuals.

## Empty and populated folder states are rebuilt from their nodes

- Replaced the legacy selection dashboard with the two actual Figma states in one
  `FolderDetailScreen`, driven by the existing folder-filtered links from `MnemeProvider`.
- Empty `2159:13158` keeps its 356x706 centered card, exact chain illustration, and functional add
  action. Populated `2159:13174` uses the exact search/filter/card geometry, five node images, source
  labels, tags, and exported controls.
- Production comparison: Empty 0.73 / 0.78 / 0.79 (1.13% over 28); populated
  6.29 / 6.26 / 6.04 (7.23% over 28). The populated mask has only text/JPEG edge differences.

## Notebook detail is rebuilt from the node

- Replaced the legacy card-and-gradient dashboard with `2159:12842`: exact 350x280 cover,
  NotebookLM mark, favourite/edit controls, two tabs, expanded four-part contents tree, and fixed
  share/open actions.
- The full-width white frame uses the node's own status-bar geometry while other screens retain
  Home's intentional 350px status layout. All eleven visible vectors are exact node exports and
  registered through `FigmaIcon`.
- Production comparison: 5.43 / 5.14 / 4.47 (5.99% over 28). The difference mask contains only
  thin text/vector rasterization contours and no displaced structural regions.

## Create-notebook source choice is rebuilt from the node

- Rebuilt `2159:13626` with its purple status/header chrome, overlapping 356x490 source card,
  exact collage/folder crops, and two live choices wired to the existing source-selection flow.
- Production comparison: 3.28 / 3.28 / 2.34 (3.73% over 28), with no broken assets or structural
  blocks in the difference mask.

## Source selection is rebuilt from the node

- Replaced the legacy selector with `2159:13570`: exact three-step progress header,
  search/filter/chips, four 112px selectable rows, node radio controls, and 350px floating action.
- Selection remains live and feeds real link IDs into the existing synthesis path.
- Production comparison: 5.75 / 6.07 / 5.48 (6.27% over 28); residuals are limited to glyph and
  JPEG interpolation edges.

## Next work

1. Continue the remaining Notebook analysis/content states against their own nodes, starting with
   `2159:13602`.
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
