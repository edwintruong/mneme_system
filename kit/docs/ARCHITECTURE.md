# Mneme React architecture

## Runtime

- React 18 + TypeScript + Vite render the local-first mobile showcase.
- `server.ts` serves the production bundle and server-side Gemini endpoints. Cloud Run supplies
  `PORT`; AI Studio supplies `GEMINI_API_KEY` as a server-side secret.
- `Dockerfile` builds the Vite/Express bundle in a Node build stage, then runs it as the unprivileged
  `node` user from a production-only runtime stage. Vite is dynamically imported only in development,
  so it is not required by that runtime image. The image defaults to port 1300 but still honors
  `PORT` supplied by Cloud Run or `docker run`.
- The app shell in `src/App.tsx` owns the fixed 390px frame, full-width 390px shared status bar,
  view stack, bottom navigation, and home indicator. Clock and system-glyph coordinates are route-
  invariant; routes may change only their colors/background treatment.

## Layers

- `src/screens/`: one full screen per file. A file may render multiple states only when the Figma
  map assigns those states to the same screen.
- `src/components/`: shared visual primitives. All glyphs render through
  `src/components/common/FigmaIcon.tsx`.
- `src/state/mnemeContext.tsx`: the single React state layer and localStorage persistence.
- `src/data/seed.ts`: exact showcase content required by the Figma frames.
- `src/index.css`: shared design tokens and global mobile rendering rules.
- `public/assets/**/figma_<section>/`: exact raster/vector bytes exported from each active Figma node.

## Data flow

Screen action → `MnemeProvider` mutation → React state update → localStorage persistence → subscribed
screens rerender. Gemini actions call `/api/gemini/*`; the server validates the response and the
existing local fallback keeps the showcase functional without a configured key.

### Persisted-schema safety contract

- Treat every `localStorage` value as `unknown`; TypeScript interfaces do not validate persisted
  runtime data. Read arrays through `readSavedArray`, catch invalid JSON/non-array values, and run a
  schema migration before exposing records through `MnemeProvider`.
- When a persisted model gains a required collection or field, add its migration in the same
  milestone. Canonical showcase records should be refreshed from `INITIAL_*`; user-created records
  should receive derived defaults that preserve their data.
- Screens that consume persisted collections must still use a defensive array boundary
  (`Array.isArray`) before `.find`, `.map`, or `.forEach`. This second layer prevents a future
  in-memory partial object from crashing the render tree before it reaches persistence.
- `AppErrorBoundary` wraps `MnemeProvider` so an unanticipated render error shows a deliberate
  recovery action instead of an empty white phone.
- Run `kit/scripts/notebook_flow_smoke.py` against the production server after notebook schema or
  routing changes. It injects the pre-outline notebook schema and malformed JSON, then asserts the
  direct flow renders and sends zero `/api/gemini/*` requests.

## Navigation and mobile scrolling

- `App.tsx` owns one persistent view stack and one persistent `<main>` scroll container. Pushing or
  popping a screen resets that container to scroll position 0; vertical touch panning and momentum
  scrolling stay enabled for every screen.
- The active create-notebook route starts at Notebook tab (`2172:4536`) → “Tạo sổ tay” → source
  choice (`2159:13626`) → source selection (`2172:4631`). The app shell owns the 44px status bar,
  so route-level status colors must be declared there: source choice uses solid primary purple;
  AI suggestion details split one continuous dark gradient across the shell status bar and their
  screen header using the shared `--gradient-ai-detail-header` token.
- The notebook AI-update storyboard is also deterministic/local: Notebook tab (`2172:7956`) →
  “Cập nhật ngay” → suggestion list (`2172:5336`) → one data-driven review detail
  (`2172:5510`, `5409`, `5614`, or `5717`). `AiSuggestionDetailScreen` owns the shared review
  geometry; `src/data/aiSuggestions.ts` owns the per-notebook copy, images, scores, and reasons.
  Review/add/ignore state never calls Gemini. Run `kit/scripts/ai_suggestions_smoke.py` after edits
  to this route; it walks all four variants and audits scroll, image loading, text containment, and
  `/api/gemini/*` traffic.
- The Profile tab is node `2221:8269` rendered by `ProfileScreen`. Like create-notebook, it uses the
  shell-owned solid-primary status bar; unlike the other tab frames, its Figma instance disables the
  home indicator, so `App.tsx` suppresses that shared overlay only while Profile is active. The
  bottom navigation remains the shared `BottomNavigation` component.
- Folder-originated add-link navigation retains both the form's selected destination and the folder
  screen to return to in the existing view stack. This reproduces
  `2172:7015 → 2217:7777 → 2217:7825` without a second state layer: `MnemeProvider.addLink`
  persists the link, `App.tsx` pops the add-link view, and `FolderDetailScreen` renders the local
  success state.
- A screen must not use `overflow-hidden` to discard Figma layers below the static frame. Off-screen
  rows remain in normal scroll reach; floating actions use sticky positioning inside the phone
  viewport.

## Product and design constraints

- No login or remote application database; the showcase remains local-first.
- Never add an icon library, inline a hand-authored SVG, or substitute a similar glyph. Export the
  vector from the exact Figma node, commit it, and register it in `FigmaIcon`.
- Treat each active frame as a fixed 390px contract. Reuse shared components and CSS tokens only
  when their rendered result matches that node.
- Use `npm run build` and the production server for milestone verification; do not use the Vite dev
  server as evidence for Cloud Run behavior.
