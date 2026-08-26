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

## Blocked

Both items need the `claude.ai Figma` MCP server connected; it is currently disconnected.

1. **No screen has been rebuilt against section `2159:12770` yet.** Every screen is still the
   migration's loose Tailwind interpretation, not the node's fixed 390 px layout.
2. **Every raster asset is corrupt.** All 14 PNGs under `public/assets/images/` were destroyed by a
   UTF-8 text decode before the React migration; see `kit/docs/FIGMA_MAP.md` for the byte evidence.
   They must be re-downloaded from Figma as binary.

## Next work

1. Re-export the Home assets from `2159:12771` into `public/assets/icons/figma_2159/`; the 18
   namespaced exports the migration deleted must not be substituted from the legacy `2143:*` set.
2. Re-download all 14 rasters from their Figma nodes.
3. Rebuild Home `2159:12771` and its toast state `2159:13227` against the node, then compare the
   rendered 390x844 frame with the Figma export before moving on.
4. Work through the remaining screens in `kit/docs/FIGMA_MAP.md` in the same way.

## Important context

- Brand tokens live in `src/index.css`; the screens read them as literal hex values today.
- App state is exposed with `MnemeProvider` in `src/state/mnemeContext.tsx`.
- Gemini runs server-side in `server.ts` behind `/api/gemini/*`, keyed by `GEMINI_API_KEY`, which
  AI Studio configures as a server-side secret. Local fallback behavior is preserved.
- Figma asset URLs expire, so referenced assets are committed locally.
- Do not add authentication for this showcase build.
