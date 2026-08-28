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

## Details screen cross-checked against the Section 9 showcase demo

- The user pointed at `2172:3041` ("LUỒNG SHOWCASE APP DEMO"), a separate, much larger
  section that restages Home/Folder Detail/Activity/etc. with realistic demo content
  (K-drama, horror, anime, study, travel folders) — a demo-video storyboard, not a new
  design. `get_design_context` on one of its 11 `Folder Detail` frames (`2172:5877`,
  "Phim Hàn") confirmed the component is code-identical to the already-rebuilt
  `2159:13174`; only the demo content differs.
- Found and fixed a real bug while wiring that content in: `FolderLinkRow`'s duration
  badge was hardcoded to `"2:12"` for every row. Added `duration?: string` to
  `SavedLink` and render it conditionally.
- Found and fixed a seed-ordering regression I nearly introduced: `CategoryScreen`
  filters by `category` alone and takes `.slice(0, 4)`, so inserting the 4 new
  "Phim Hàn" links after the existing fixture item shifted which links populate that
  already-verified screen. Moved the new links to the end of the array — filtering by
  folder for `FolderDetailScreen` doesn't care about position, but `.slice(0, 4)` on
  the full category list does.
- Seeded the folder's remaining 4 links (exact titles/sources/tags/durations/images
  from the node) so `2172:5877` renders as a real 5-link populated state.
- Production comparison: 6.60 / 6.92 / 6.86 (7.66% over 28), in line with the original
  populated Folder Detail score (6.68 / 6.71 / 6.39). Mask has no structural blocks.
- The other 10 `Folder Detail` demo variants in Section 9 use the same verified
  template but were not individually seeded/compared — see `kit/docs/FIGMA_MAP.md`.
  Section 9 also contains many non-"details" screens (Activity, Home, Notebook detail
  variants for other demo categories) that are out of scope of this pass.

## Standing goal (set 2026-08-28): finish every Section 9 details screen

The user's instruction: work until all `2172:3041` ("LUỒNG SHOWCASE APP DEMO") "details"
(Folder Detail) screens are complete, keep writing docs and rely on `/compact` so another
agent can take over if usage runs out, skip matching the phone status bar (battery/wifi/
clock — OS chrome, not app UI), and make sure Home's scrollable content below the fold is
also coded correctly since this is a phone interface.

There are 11 Folder Detail frames total in Section 9; see the table in
`kit/docs/FIGMA_MAP.md` under "Section 9" for the exact node → folder → category mapping
(confirmed by screenshot, not metadata layer names).

### Section 9 remaining Folder Detail variants — tracking checklist

- [x] `2172:5877` Phim Hàn (Phim ảnh) — done, pixel-compared 6.60/6.92/6.86
- [x] `2172:5991` Phim kinh dị (Phim ảnh) — item 1 is now id:152 (was wrongly reusing
      id:12's text; see "Content-accuracy audit" below), pixel-compared 6.43/6.23/5.93
- [x] `2172:6105` Phim ngắn (Phim ảnh) — item 1 is now id:153 (was wrongly reusing id:13's
      text), pixel-compared 5.87/5.74/5.42
- [x] `2172:6221` Anime (Phim ảnh) — item 1 is now id:154 (was wrongly reusing id:11's
      text), pixel-compared 6.33/6.29/6.20.
      First pass scored 9.96/10.02/10.00 (structurally off): 4 of its 5 thumbnails use a
      Figma-specified crop leaf larger than the 80x80 container with a non-center
      top/left offset (e.g. `w-[80px] h-[91.966px] top-[-12px]`), not a plain centered
      `object-cover`. Fixed by computing each leaf's exact crop rectangle in the source
      image's native pixel space (scale = renderedW / originalW, then map the leaf's
      top/left offsets through that scale) and baking the crop into the saved asset
      instead of changing `FolderLinkRow`'s generic `object-cover` renderer — score
      dropped to 6.48/6.55/6.51. If a future folder's thumbnail looks structurally wrong
      only in that one folder, check the node's `get_design_context` leaf `w-[]`/`h-[]`/
      `top-[]`/`left-[]` on the image div before assuming it's a seeding mistake.
- [x] `2172:7015` Nhật Bản (Du lịch) — new folder, 5 links, pixel-compared 5.21/5.04/4.94
- [x] `2172:7130` Đông Nam Á (Du lịch) — new folder, 5 links, pixel-compared 5.39/5.32/5.26
- [x] `2172:7244` Mẹo du lịch tiết kiệm (Du lịch) — new folder, 5 links, pixel-compared 5.79/5.93/6.04
- [x] `2172:7414` Bánh Âu (Công thức bánh) — new folder, 5 links, pixel-compared 4.68/4.72/4.72
- [x] `2172:7512` Bánh Á (Công thức bánh) — new folder, 5 links, pixel-compared 5.05/5.08/5.04
- [x] `2172:7610` Bánh không cần lò nướng (Công thức bánh) — new folder, 5 links,
      pixel-compared 7.31/7.21/6.93 (single-tag row layout; see note below)
- [x] `2172:7704` Trang trí bánh (Công thức bánh) — new folder, 5 links, pixel-compared
      5.03/5.03/5.18. First pass scored 25.32/27.67/27.68 (structurally off): this node's
      item 1 also carries an image override (`imgImagePlaceholder` background +
      `imgImage` real photo on top), which I initially assumed only items 2–5 had. That
      shifted every item's real-photo variable by one (item1 got the placeholder,
      item2 got item1's photo, etc.) across all 5 rows. Fixed by re-fetching the node
      and mapping each card's *last* `src={imgN}` inside its
      `data-name="Image placeholder"` → `data-name="Button"` span, not the first —
      the same fix already applied to the 5 other new folders via the corrected regex
      parser (`n7015`/`7130`/`7244`/`7414`/`7512`), which this one had skipped because
      it was hand-read from an inline tool result instead of re-verified programmatically.
- [x] `FolderDetailScreen.tsx`'s `FolderLinkRow` now renders each tag chip
      conditionally (`link.tags[0] && …`, `link.tags[1] && …`) instead of assuming both
      always exist — `2172:7610` and `2172:7704` are single-tag rows.
- [x] `CategoryScreen.tsx` folder tiles made category-aware via a `CATEGORY_FOLDERS`
      map keyed by `category.name` (was hardcoded to the movie folders for every
      category — a real pre-existing bug: opening "Du lịch" or "Công thức bánh" showed
      movie folder tiles). `Phim ảnh`'s entry is byte-identical to the old hardcoded
      array so its pixel-verified state (4.87/4.98/4.82) is untouched; `Du lịch` and
      `Công thức bánh` have no dedicated category-list Figma frame in this file, so
      their tiles are functional rather than pixel-targeted.
- [x] Full `figma_compare.py` re-run: all 22 rows (11 original + 11 Section 9 Folder
      Detail nodes) pass under the 8.0 worst-score bar, zero regressions on any
      previously-verified screen.
- [x] Fixed two real, general navigation bugs found while wiring up the new folders'
      click-through paths in `figma_compare.py` (not showcase-specific — both would
      affect the real app on any tab with enough content to scroll):
      1. **Bottom nav permanently covering scrolled content.** `BottomNavigation` is
         `absolute bottom-0` over the scrollable `<main>` in `App.tsx`, 115px tall, so
         any content scrolled to the bottom of a tab screen ended up permanently hidden
         behind it (opaque from y=40 of that 115px down) — there was no bottom padding
         reserving that space. Fixed by adding `pb-[115px]` to `<main>` when
         `currentView.type === 'tabs'`.
      2. **Scroll position leaking between screens.** `<main>` is one persistent DOM
         node that swaps children via `renderActiveScreen()`; navigating away from a
         scrolled-down screen (e.g. Home scrolled to reach "Công thức bánh") left the
         *next* screen rendered at that same scroll offset instead of at its own top —
         on a "details" screen this meant the header/search bar scrolled half off-screen
         before any user interaction. Fixed with a `mainRef` + `useEffect` that calls
         `mainRef.current?.scrollTo(0, 0)` whenever `currentView` or `currentTab`
         changes (covers both push/pop navigation and bottom-nav tab switches).
      Both fixes were verified to cause zero regression across all 22
      `figma_compare.py` rows (each screen is captured at its own top-of-scroll state).
- [x] Status bar (battery/wifi/clock) intentionally excluded from matching per user
      instruction — do not spend effort chasing it in future comparisons.
- [x] Checked whether the two pending "Home variant" nodes (`2159:13303`, `2159:13676`)
      were a scrolled-down state of Home relevant to the scroll-fix above — they render
      pixel-identical to the already-verified Home frame (`2159:12771`), so no separate
      implementation was needed for them specifically.

Section 9's Folder Detail work is now fully complete. If resuming other Section 9 work
(Activity/Notebook-detail/HỌC TẬP-CV demo variants — out of scope of this pass) from a
fresh context: read `kit/docs/FIGMA_MAP.md`'s Section 9 table for what's already done,
and note the seed-array position sensitivity in `CategoryScreen`'s `.slice(0, 4)` —
always append new links at the very end of `INITIAL_LINKS`, never in the middle.

## Content-accuracy audit (set 2026-08-28, same session)

The user ran the app themselves and reported real title/content mismatches inside
"Đã lưu gần đây"-style rows despite the pixel scores above all passing. Their follow-up
instruction, to stay in force for the rest of this goal: **check every screen carefully
and get each content, each icon, and the UI exactly right** — pixel-score-under-8 is
necessary but not sufficient; text content must match the source node's actual copy too.

Root cause found: `id:11` (Anime), `id:12` (Phim kinh dị), `id:13` (Phim ngắn) were each
being reused for **two different Figma frames that show two different titles for the same
photo** — the original Category List "Tất cả links" section (`2159:13036`) and Section 9's
own Folder Detail frame for that folder (`2172:6221`/`2172:5991`/`2172:6105`). A prior
session's "extend the existing fixture to be item 1" approach (see the `2172:6221`/
`2172:7704` notes above) assumed one record could serve both frames; it can't when the
frames disagree. Confirmed via fresh `get_design_context` on all 4 nodes — e.g. `2172:5991`
item 1 title is "Gia đình phát hiện đoạn băng bí ẩn giấu sau bức tường" while `2159:13036`'s
own copy for the same photo is "Gia đình chuyển vào căn nhà mới và phát hiện những đoạn
băng bị giấu trong tường". (First attempt: overwrote id:11/12/13's titles to the Section 9
wording, which fixed those 3 folders but regressed Category List from 4.87/4.98/4.82 to
5.61/5.70/5.41, since those ids are also the first 3 of `categoryLinks.slice(0, 4)` there.)

Fix: kept `id:11/12/13` exactly matching `2159:13036` (their original titles restored,
`folder` changed to the category name `'Phim ảnh'` so they no longer double-list inside
`FolderDetailScreen`), and added three new records — `id:152` (Phim kinh dị), `id:153`
(Phim ngắn), `id:154` (Anime) — carrying each Folder Detail node's own exact title, reusing
the same image asset. Inserted at the front of each folder's existing items 2–5 block so
`folderLinks` filter order keeps item 1 first. Re-verified: Category List back to
4.87/4.98/4.82, all three Folder Detail scores improved (see checklist above), all 22
`figma_compare.py` rows still pass with zero regressions.

Icon audit: grepped the whole `src/` tree for `lucide-react` imports, raw `<svg>` outside
`FigmaIcon.tsx`, and leftover unicode glyphs — none found in any Section 9 / Folder Detail
code path. The `✓`/`✕` unicode glyphs that do exist (`EditLinkScreen`, `ProfileScreen`,
`AiSuggestionsScreen`, `SearchScreen`) are all in screens already flagged "Legacy UI
pending rebuild" in `kit/docs/FIGMA_MAP.md`, outside this goal's Folder Detail scope —
left as-is, not a new finding.

If more content mismatches like this turn up later: the pixel-diff score is computed over
the whole frame and averages out a single wrong row, so a folder can score under 8 while
still having one visibly wrong title. When auditing, read the actual rendered text in
`kit/figma-refs/out/compare_*.png` (Figma | app | diff columns) side by side rather than
trusting the aggregate number alone — that's how these three were caught.

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
