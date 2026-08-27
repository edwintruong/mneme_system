# Mneme React architecture

## Runtime

- React 18 + TypeScript + Vite render the local-first mobile showcase.
- `server.ts` serves the production bundle and server-side Gemini endpoints. Cloud Run supplies
  `PORT`; AI Studio supplies `GEMINI_API_KEY` as a server-side secret.
- The app shell in `src/App.tsx` owns the fixed 390px frame, shared status bar, view stack, bottom
  navigation, and home indicator.

## Layers

- `src/screens/`: one full screen per file. A file may render multiple states only when the Figma
  map assigns those states to the same screen.
- `src/components/`: shared visual primitives. All glyphs render through
  `src/components/common/FigmaIcon.tsx`.
- `src/state/mnemeContext.tsx`: the single React state layer and localStorage persistence.
- `src/data/seed.ts`: exact showcase content required by the Figma frames.
- `src/index.css`: shared design tokens and global mobile rendering rules.
- `public/assets/**/figma_2159/`: exact raster/vector bytes exported from the active Figma section.

## Data flow

Screen action → `MnemeProvider` mutation → React state update → localStorage persistence → subscribed
screens rerender. Gemini actions call `/api/gemini/*`; the server validates the response and the
existing local fallback keeps the showcase functional without a configured key.

## Product and design constraints

- No login or remote application database; the showcase remains local-first.
- Never add an icon library, inline a hand-authored SVG, or substitute a similar glyph. Export the
  vector from the exact Figma node, commit it, and register it in `FigmaIcon`.
- Treat each active frame as a fixed 390px contract. Reuse shared components and CSS tokens only
  when their rendered result matches that node.
- Use `npm run build` and the production server for milestone verification; do not use the Vite dev
  server as evidence for Cloud Run behavior.
