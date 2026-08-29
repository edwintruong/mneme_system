# Mneme implementation progress

Last updated: 2026-08-29

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
- [x] `2172:7414` Bánh Âu (Công thức bánh) — new folder, 5 links, pixel-compared 4.73/4.77/4.79
- [x] `2172:7512` Bánh Á (Công thức bánh) — new folder, 5 links, pixel-compared 5.10/5.14/5.11
- [x] `2172:7610` Bánh không cần lò nướng (Công thức bánh) — new folder, 5 links,
      pixel-compared 6.48/6.35/6.17. Its header now uses the node's flexible title geometry,
      keeping the long name on one line instead of wrapping inside a fixed 166px box.
- [x] `2172:7704` Trang trí bánh (Công thức bánh) — new folder, 5 links, pixel-compared
      5.08/5.09/5.25. First pass scored 25.32/27.67/27.68 (structurally off): this node's
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
      array so its pixel-verified state (4.87/4.98/4.82) is untouched. `Du lịch` and
      `Công thức bánh` were subsequently audited against `2172:6846` and `2172:7359`.
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

## Activity tab rebuilt from its own node (2026-08-29)

The user pointed at `node-id=2172-4208` and asked for the "Hoạt động" (Activity) tab to be
made to look like it. The screen previously at `src/screens/ActivityScreen.tsx` was an
unrelated placeholder (an "AI recommendation" banner + a "Đã lưu gần đây" links rail reusing
`links.slice(0, 4)`) — it never matched this node at all, in content or layout.

Rebuilt `ActivityScreen.tsx` to match `2172:4208` exactly: a white title bar with the
node's multi-layer purple drop-shadow ("Hoạt động"), then two grouped notification feeds —
"Hôm nay" (3 rows) and "Hôm qua" (3 rows) — each row a 40×40 rounded thumbnail plus two-line
text (a regular-weight prefix sentence + a colored notebook/notebook-category mention,
purple `#7758e2` for "sổ tay" mentions and blue `#6095ff` for category mentions) and a
timestamp. All six rows' copy and the 5 unique thumbnails are literal, fixed content per the
node (not derived from `MnemeProvider` state) — this frame is Figma's own demo/mock feed and
its notebook names ("Movies to Watch", "Cake Receipts", "Travel Inspiration") don't all
correspond to real `INITIAL_NOTEBOOKS` entries, so rows are static, non-interactive `<div>`s
matching the source markup (no `button`/`onClick`, same as the design). Downloaded the 5
unique thumbnail assets to `public/assets/images/figma_2172/2172_4208_notif{1..5}.jpg`
(image 1 is reused for both its "Hôm nay" and "Hôm qua" appearances, matching the node).
`App.tsx`'s `activity` case now renders `<ActivityScreen />` with no props — the old
`onSelectLink`/`onViewSuggestions` wiring was only for the removed placeholder content.

Added a `figma_compare.py` row (`2172:4208`, frame height 824 per the node's own
`absoluteBoundingBox`, reached by clicking the "Hoạt động" bottom-nav button). This broke
the pre-existing `'Link detail'` capture step, which used to open the Activity tab and click
a link title there to reach `2159:12980` — that link (`id:6`, deliberately excluded from
Home's 3-item rail per its own seed.ts comment) had no other route once Activity's link rail
was replaced. Re-routed that step through the search flow instead (open search from Home,
type the title, click the result) — same target screen, no longer coupled to Activity's
content.

Score: 10.49 / 10.19 / 8.84 — the only row currently over the ~8 bar, all other 22 rows
unaffected (zero regressions). Root-caused with a zoomed crop diff (see
`kit/figma-refs/2172_4208_activity.png` vs `kit/figma-refs/out/app_2172_4208_activity.png`):
image position, row layout, spacing, and colors all match closely; the residual is
character-by-character text drift consistent with Roboto-metric differences between Figma's
renderer and Chromium (the raw Figma export even tags text with
`fontVariationSettings: '"wdth" 100'`, a Roboto Flex axis the app's actual Google-Fonts
Roboto doesn't have — grepped and confirmed no other screen's real code applies this either,
so it's a pre-existing, un-fixed-elsewhere artifact of the pipeline, not new). This screen
just has more total text lines (up to 16) than any other row in the suite, which the
whole-frame MAE amplifies even with no structural error. Fixed one genuine bug found along
the way: the two notification cards were missing the 4px gap between rows (`gap-[4px]`,
present in the node's own auto-layout) — adding it dropped the score from ~12/~12/~10 to the
current ~10/~10/~9. Not chasing this further with content-blind CSS tweaks aimed at the
score rather than the design.

## Status bar: live Ho Chi Minh City clock, consistent layout everywhere (2026-08-29)

User feedback: the status bar's time/status display was "hiển thị sai" (wrong) and needed to
be pixel-consistent across every screen, with the clock driven by real Ho Chi Minh City time
instead of a static mock value.

Root cause: `src/App.tsx`'s single shared status bar (rendered once, above every screen) hard-
coded the literal text `9:41` — Apple's standard design-mockup placeholder, copied verbatim
from the Figma export — and had a `usesReversedStatusBar` branch (`currentView.type ===
'link_detail'`) that flipped the layout for that one screen only: time moved to the top-right
and the signal/wifi/battery icons moved to the top-left, using three separate icon assets
(`detail-mobile-signal`/`detail-wifi`/`detail-battery`) instead of the single combined
`status-right` glyph every other screen uses. That flip came from literally matching
`2159:12980`'s own Figma frame, but it made the status bar visibly inconsistent between
screens in the running app, which is what the user flagged.

Fix, in `src/App.tsx`:
- Added `formatStatusBarTime()` / `useStatusBarClock()`: reads the real current time via
  `Intl.DateTimeFormat(..., { timeZone: 'Asia/Ho_Chi_Minh', hourCycle: 'h23' })`, formatted as
  zero-padded `HH:MM` (e.g. `00:40`), refreshed every second (cheap no-op re-render unless the
  formatted string actually changed, via a `prev === next` check in the state updater).
- Removed the `usesReversedStatusBar` branch entirely. Every screen — including Link detail —
  now renders the same layout: clock top-left (`top-[13px] left-[24px]`, the position already
  verified against the other 22 nodes), status icons top-right via the single `status-right`
  glyph (or `create-notebook-status` for the purple variant). This is a deliberate, explicit
  user override of `2159:12980`'s literal mockup in favor of a real, consistent OS-style status
  bar; the `detail-mobile-signal`/`detail-wifi`/`detail-battery` icon registry entries in
  `FigmaIcon.tsx` are left in place (harmless, still-valid asset catalog entries) but are no
  longer referenced anywhere.

Verified: `npx tsc --noEmit` and `npm run build` clean; full 23-row `kit/scripts/
figma_compare.py` suite re-run with zero regressions — Link detail actually improved slightly
(7.13/6.89/5.88, previously used the reversed layout matching that one frame) and every other
row is byte-for-byte unaffected, since the status bar is centralized in `App.tsx` and no other
file references `9:41`, `status-right`, or the removed reversed-layout icons (confirmed via
`grep -rl` across `src/` before making the change).

## Showcase Home audited against node 2172:4416 (2026-08-29)

The user selected Section 9 Home node `2172:4416` as the current target and explicitly asked
that the live time display remain unchanged. Direct `get_design_context`, asset hashing, and a
production screenshot comparison confirmed that the existing Home geometry, avatar, seven
other raster assets, and every visible SVG already match this showcase node. The first
"Đã lưu gần đây" thumbnail differed: `2159:12771` used an older overhead food photo, while
`2172:4416` uses a different crepe-and-berries photo.

- Exported the current crepe source to
  `public/assets/images/figma_2172/2172_4416_recent_crepe.jpg` and pointed the `id:5` seed item
  at it.
- Made the visible Home storyboard deterministic: `HomeScreen` selects the three recent links
  (`id:5`, `id:4`, `id:3`) and four categories by their Figma fixture ids instead of depending
  on mutable array order. `MnemeProvider` normalizes only those fixture records when loading
  older localStorage data and restores a missing fixture, while preserving all unrelated
  user-created links/categories and the rest of the local-first state.
- Updated `HomeScreen`'s trace comments to the `2172:4416` node ids and added the exact Figma
  export plus a dedicated comparison row to `kit/scripts/figma_compare.py`.
- Production comparison: 3.15 / 3.20 / 3.16, with 3.84% of pixels over 28 and no broken images.
  The remaining status-bar time difference is intentional per the user's instruction; no clock
  code or placement was changed. The full 24-row suite showed no regressions. Its process still
  exits non-zero because Activity's already-documented 10.50 / 10.21 / 8.87 text-antialiasing
  residual remains above the script's global 8.0 threshold, unrelated to this Home change.
- Verified the below-fold Home state in the production build: the scroll container has 88px of
  travel, and after scrolling to its end the final 80px "Công thức bánh" row ends at y=705,
  safely above the bottom-navigation menu beginning at y=781. The live clock continued running
  unchanged during this check.

## Recent-card link details matched to Section 9 nodes (2026-08-29)

Each of the three cards under Home's "Đã lưu gần đây" rail now opens its own exact content
variant in the shared `LinkDetailScreen`:

- `Công thức bánh crepe` -> `2172:4258`: Tik Tok URL/source, two recipe notes,
  `Công thức bánh` / `Bánh ngọt` tags, and `1 phút trước`.
- `Tối ưu prompt AI` -> `2172:4313`: YouTube URL/source, two prompt-workflow notes,
  `Học tập & Công việc` / `AI Workflow` tags, and `8 phút trước`.
- `Phim hay mùa hè 2026` -> `2172:4365`: Facebook URL/source, two film notes,
  `Phim ảnh` / `Giải trí` tags, and `2 giờ trước`.

The shared detail card now grows from its content, matching the 368px recipe/prompt cards and
the 392px movie card without creating separate screens or a second state layer. The two new
source glyphs are exact node exports registered as `showcase-youtube` and
`showcase-facebook` in `FigmaIcon`; all other glyphs and covers reuse byte-identical existing
Figma exports. Existing persisted fixture ids are upgraded by the Home normalization above, so
the three details are correct in both new and previously used browser sessions.

Focused production comparison (Figma / app, no broken images or structural blocks):

- `2172:4258`: 4.35 / 4.62 / 4.48, 4.51% of pixels over 28.
- `2172:4313`: 4.60 / 4.76 / 4.27, 5.03% of pixels over 28.
- `2172:4365`: 5.17 / 4.68 / 3.94, 4.97% of pixels over 28.
- Legacy detail `2159:12980`: 7.12 / 6.88 / 5.87, confirming no regression from the
  content-sized card.

Playwright also clicked all three Home cards, asserted each title, URL, notes, tags, source,
saved time, and source icon, then used the back control to return Home. The live Ho Chi Minh
City clock/status placement remains the deliberate user override and was not changed.

## Phim ảnh showcase flow matched (2026-08-29)

Home's `Phim ảnh` category now opens the exact five-node Section 9 flow selected by the user:

- Category `2172:5822`: exact `Folders (6)` copy; four visible 24-link tiles in storyboard
  order (`Phim Hàn`, `Phim kinh dị`, `Phim ngắn`, `Anime`); the four deterministic overview
  fixtures; and the node's search, filter, add-folder, overflow, and folder glyphs.
- Folder detail `2172:5877` `Phim Hàn`, `2172:5991` `Phim kinh dị`, `2172:6105`
  `Phim ngắn`, and `2172:6221` `Anime`: five exact links each, with node-specific titles,
  images/crops, sources, authors, durations, and tags.

The shared `CategoryScreen` selects overview records by `MOVIE_CATEGORY_LINK_IDS`, so Home's
recent-card movie fixture and older persisted ordering cannot displace the storyboard copy.
`MnemeProvider` normalizes and restores the canonical movie fixtures without replacing unrelated
or user-created local-first data. Folder tiles remain backed by the existing view stack and open
the same reusable `FolderDetailScreen`; no duplicate screen or second state layer was introduced.

Fresh production comparison (Figma / app, no broken images or structural blocks):

- `2172:5822`: 4.92 / 5.04 / 4.89, 5.97% of pixels over 28.
- `2172:5877`: 6.64 / 6.98 / 6.93, 7.69%.
- `2172:5991`: 6.47 / 6.28 / 6.01, 7.71%.
- `2172:6105`: 5.91 / 5.80 / 5.49, 7.20%.
- `2172:6221`: 6.37 / 6.35 / 6.27, 7.24%.

`figma_compare.py` reached the category and every folder through the real Home click path. The
full 35-row production suite showed no regression in the requested flow; it still exits non-zero
only because Activity's previously documented text-antialiasing residual exceeds the global 8.0
threshold. `npm run build` is clean.

## Học tập & Công việc showcase flow matched (2026-08-29)

Home's `Học tập & Công việc` category now opens the exact Section 9 category state and four
distinct populated folder states requested by the user:

- Category `2172:6335`: exact four visible folder tiles/counts (`Ngoại ngữ` 18,
  `Kỹ năng làm việc` 15, `Tài liệu học tập` 20, `Công cụ AI` 12), the four overview links in
  storyboard order, their real source/author/duration metadata, tags, and the node's folder crop.
- `2172:6390` `Ngoại ngữ`, `2172:6504` `Kỹ năng làm việc`, `2172:6618`
  `Tài liệu học tập`, and `2172:6732` `Công cụ AI`: five exact links each, including the current
  Figma images, titles, authors, durations, sources, and both tags.

The implementation reuses `CategoryScreen`, `FolderDetailScreen`, and `MnemeProvider`; no second
state layer or duplicate screen was added. The 20 canonical study fixture ids are normalized and
restored when older localStorage data loads, while unrelated/user-created records remain intact.
`CategoryScreen` selects the four overview fixtures by explicit ids rather than mutable seed order.
The same audit caught an older ordering regression where recent-card id `3` (now categorized as
`Phim ảnh`) displaced the first movie overview row; the movie overview is now deterministic via
ids `10–13`, restoring its prior pixel match.

Focused production comparison (Figma / app, no broken images or structural blocks):

- `2172:6335`: 5.18 / 4.99 / 4.66, 6.10% of pixels over 28.
- `2172:6390`: 5.59 / 5.42 / 5.23, 6.89%.
- `2172:6504`: 6.04 / 6.05 / 5.74, 7.25%.
- `2172:6618`: 6.07 / 5.94 / 5.81, 6.97%.
- `2172:6732`: 5.47 / 5.24 / 4.86, 6.32%.
- Legacy movie Category `2159:13036`: 4.93 / 5.05 / 4.91, confirming the shared-screen change
  did not regress its content/layout.

`figma_compare.py` now reaches every state through the real Home → category → folder click path.
The live status-bar clock remains intentionally unchanged.

## Du lịch showcase flow matched (2026-08-29)

Home's `Du lịch` category now opens the complete five-node flow selected by the user:

- Category `2172:6846`: exact visible folders/counts (`Việt Nam` 22, `Nhật Bản` 14,
  `Đông Nam Á` 16, `Mẹo du lịch tiết kiệm` 11), four deterministic overview links, real
  duration/source/author metadata, tags, and the byte-identical shared Figma folder crop.
- New folder `2172:6901` `Việt Nam`: five exact links with current Figma JPEGs, titles,
  sources, authors, durations, and tags.
- Existing exact folder fixtures are reused for `2172:7015` `Nhật Bản`, `2172:7130`
  `Đông Nam Á`, and `2172:7244` `Mẹo du lịch tiết kiệm`.

Category node `2172:6846` and folder node `2172:7244` intentionally use different title copy for
the same cheap-flight photo. A category-only fixture preserves the longer “chỉ với vài bước đơn
giản” copy without corrupting the shorter folder-detail title. All 21 canonical travel fixture
ids are migrated/restored for older localStorage sessions while unrelated and user-created data
remain untouched.

Focused production comparison (Figma / app, no broken images or structural blocks):

- `2172:6846`: 4.76 / 4.50 / 4.31, 5.73% of pixels over 28.
- `2172:6901`: 4.94 / 4.68 / 4.61, 5.93%.
- `2172:7015`: 5.24 / 5.08 / 5.00, 6.29%.
- `2172:7130`: 5.43 / 5.36 / 5.32, 6.55%.
- `2172:7244`: 5.83 / 5.97 / 6.10, 6.89%.
- Shared-screen regressions: Study category remains 5.17 / 4.98 / 4.64 and legacy movie
  Category remains 4.92 / 5.04 / 4.90.

Playwright also started from an intentionally empty persisted link array, confirmed migration of
every required travel fixture id, clicked all four folder tiles through the real Home route,
asserted each folder's first exact title, returned to the category between clicks, and found zero
broken images. The live clock/status implementation was not changed.

## Công thức bánh showcase flow matched (2026-08-29)

Home's `Công thức bánh` category now opens the exact five-node Section 9 flow selected by the
user:

- Category `2172:7359`: exact `Folders (6)` copy; folder counts `Bánh Âu` 16, `Bánh Á` 13,
  `Bánh không cần lò nướng` 19, and `Trang trí bánh` 9; exact truncation; and four
  deterministic overview links with real source, author, duration, and both tags.
- Folder details `2172:7414`, `2172:7512`, `2172:7610`, and `2172:7704` retain their five
  node-specific links and route through the shared `FolderDetailScreen`.

The first three category rasters and the shared folder crop hash byte-for-byte against the
already committed Folder Detail assets. `2172:7359` uses a different original source crop for
the fourth overview image, so it is preserved separately as `2172_7359_link4.jpg`. Category-only
records `181` and `182` preserve the category's second tags and its distinct “đơn giản mà đẹp
mắt” title without changing the single-tag/copy contract of folder nodes `2172:7610` and
`2172:7704`. `CAKE_SHOWCASE_LINK_IDS` also upgrades and restores all canonical fixtures for
older localStorage sessions while preserving unrelated and user-created data.

Fresh production comparison (Figma / app, no broken images or structural blocks):

- `2172:7359`: 4.68 / 4.54 / 4.41, 5.89% of pixels over 28.
- `2172:7414`: 4.73 / 4.77 / 4.79, 6.02%.
- `2172:7512`: 5.10 / 5.14 / 5.11, 6.21%.
- `2172:7610`: 6.48 / 6.35 / 6.17, 7.19%; the one-line header fix improved the old
  7.31 / 7.21 / 6.93 score.
- `2172:7704`: 5.08 / 5.09 / 5.25, 6.12%.

Playwright started from an empty persisted link array, verified all four exact category rows and
category-only tags, opened every folder through the real Home route using its node count, checked
each first title, returned to the category, and found zero broken images. `tsc --noEmit` and the
production build are clean. The full 36-row comparison suite still exits non-zero only because
Activity's previously documented text-antialiasing residual exceeds the global 8.0 threshold.

## Create-folder and add-link-to-category flow matched (2026-08-29)

Verified the uncommitted working-tree changes to `App.tsx`, `AddLinkScreen.tsx`,
`CategoryScreen.tsx`, `FolderDetailScreen.tsx`, `HomeScreen.tsx`, `mnemeContext.tsx`, and
`types.ts` against four nodes the user pointed at directly:

- `2172:7830` (create-folder sheet, restaged over the `Phim ảnh` category): the existing
  `2159:13091` sheet already carries the right copy (`Tạo folder mới`, `Tên folder`,
  `Nhập tên folder`, `Lưu`/`Hủy`); submitting now also calls `onSelectFolder(folderName)` so the
  new folder opens immediately instead of leaving the user on the category screen.
- `2172:5821` (`Phim tài liệu` folder, 5 links): already fully seeded in `src/data/seed.ts`
  (ids 20–24) with exact titles/sources/authors/tags, reachable from `Phim ảnh` → "Xem tất cả
  folder". No changes needed; confirmed by screenshot.
- `2172:8010` (add-link-to-category): `AddLinkScreen` now takes `initialCategory`, and when it is
  `Du lịch` (opened via `CategoryScreen`'s new `onAddLink`), the screen swaps in the exact
  Kyoto-itinerary preset (title, summary, domain, preview image, category art, AI-suggested badge)
  instead of the generic `2159:13180` skincare fixture. Saving calls the new
  `onSaveToCategory`/`addLink({ preset })` path, which skips the Gemini/fallback analysis step and
  writes the link with deterministic showcase metadata.
- `2172:8057` (Home add-link toast): `HomeScreen` replaced the old dismissable green toast with
  the node's grey card, `Đã thêm vào category "…"` copy (category name interpolated), and a
  purple `Mở` action that opens that category. `App.tsx` tracks `successCategory` instead of a
  boolean `showToast` to drive this.

Also swept text-overflow protection across the touched screens per explicit user requirement (no
text may spill outside its card/row): `line-clamp-2` on the add-link preview title/summary,
`truncate`/`text-ellipsis` + `min-w-0`/`overflow-hidden` on category/folder header titles, tag
chips, source/author rows, and the create-folder input and folder-name header. Confirmed with a
Playwright stress test using an intentionally oversized folder name — the create-folder input and
the resulting `FolderDetailScreen` header both ellipsis-truncate inside their fixed-width
containers with no overflow.

Verification performed: `tsc --noEmit` clean, `npm run build` clean, and a full Playwright
walkthrough (`npm start` on port 8080, `localStorage` cleared) driving Home → `Phim ảnh` →
create-folder sheet, Home → `Phim ảnh` → "Xem tất cả folder" → `Phim tài liệu`, Home → `Du lịch` →
add-link → save, and the resulting Home toast. Screenshots visually match all four Figma exports
(`kit/figma-refs/2172_7830_create_folder.png`, `2172_5821_folder_documentary.png`,
`2172_8010_add_link_category.png`, `2172_8057_home_add_toast.png`) in layout, copy, and spacing;
no `figma_compare.py` numeric score was computed for these four (they are not yet rows in
`SCREENS`) — visual screenshot comparison only. None of this work is committed yet.

## Create-notebook flow matched against Section 9 (2026-08-29)

Implemented and pixel-verified the three nodes the user pointed at for the "tạo sổ tay" (create
notebook) flow, using `figma-design-to-code` (`get_design_context`) on each node rather than
inferring from screenshots alone, per the user's "chuẩn từng pixel, từng icon" instruction:

- `2172:4536` (notebook list, restaged): `NotebookScreen.tsx` and its `INITIAL_NOTEBOOKS` fixture
  (`src/data/seed.ts`) already matched this node almost exactly — same header, AI banner, and all
  four notebook rows/covers, confirmed by downloading and comparing each cover image's bytes
  against the currently-committed ones. The one real diff: the node abbreviates "phút" as "’" in
  "Món ăn dễ nấu trong 15’", where the seed had the full word. Fixed in `INITIAL_NOTEBOOKS`. This
  title is shared with that notebook's detail-screen header (no separate design reference exists
  for that detail screen), so the abbreviated form now shows there too — an accepted, documented
  trade-off since there is only one field and one route to it, not a dual-context case.
- `2172:4631` (select-content step, restaged): `SelectSourcesScreen.tsx` previously rendered
  static lorem-ipsum rows (`Morem ipsum dolor sit amet...`) — the literal content of legacy node
  `2159:13570`, its own already-verified design. This node instead specifies four rows with real
  research/AI-workflow copy. Added a `SHOWCASE_SOURCES` fixture with each row's title/source/
  author/tags, and swapped in each row's own photo — downloaded via `download_assets` and mapped
  to its row by cropping and screenshotting each row's own node id (`2172:4655/4672/4689/4706`)
  individually rather than assuming the download's list order, which caught what would otherwise
  have been a wrong image-to-row assignment (row 2's "hanging info cube" and row 4's "Rome tourist"
  photo are not in visual top-to-bottom order in the raw asset list). `sourceIds` passed to
  `onSynthesize`/`addNotebook` still resolves through the real `links` array by position — changing
  that would require either minting new persisted `SavedLink` records (risking the pixel-verified
  Category/Folder counts elsewhere) or accepting `addNotebook` throwing on an all-fake-id selection
  (it does `links.filter(l => sourceIds.includes(l.id))` and throws if nothing matches) — so this
  is a deliberate display-only fixture, not a new persisted link.
  Two rows in the node's own layer tree (5 and 6, reusing its default lorem-ipsum/Figma-dock
  placeholder) sit below the node's clipped 844px frame height and are not visible in the reference
  export; they were intentionally not rendered, matching what the export actually shows rather than
  the full off-screen layer tree.
  The node's floating button reads "Bỏ chọn 3 mục" but only 2 of the 4 visible rows show a checked
  radio in the reference screenshot — kept the existing dynamic `selectedCount` behavior (recomputed
  from real toggle state, matching this codebase's pattern everywhere else) rather than hardcoding
  "3" to match static mockup text that disagrees with its own visible checkboxes; default state is
  `[true, false, true, false]` so two rows render checked, matching the screenshot exactly.
- `2172:7907` (notebook detail, "Research với NotebookLM"): already fully implemented — verified
  byte-for-byte equivalent content to already-shipped `NotebookDetailScreen.tsx`/node `2159:12842`
  (same title, cover, description, "3 video - 12 phút đọc", and all four TOC items with the 2.1–2.3
  sub-items). No code change; this is a genuine pixel-duplicate restaging, not an oversight.

Added `public/assets/images/figma_2172/2172_4631_source_{1..4}_*.jpg` (the four real row photos)
and `..._source_generic_figma_dock.jpg` (downloaded but unused, kept for provenance/future rows).
Saved full-frame references `kit/figma-refs/2172_{4536,4631,7907}_*.png` and added all three as
rows in `kit/scripts/figma_compare.py`'s `SCREENS`, replacing `2159:13570`'s now-unreachable row
with `2172:4631`'s.

Fresh production comparison (Figma / app, no broken images or structural blocks):

- `2172:4536`: 4.26 / 4.44 / 3.13, 4.69% of pixels over 28 (legacy `2159:12891` unaffected at
  4.37 / 4.55 / 3.23 — the one-word text fix did not regress it).
- `2172:4631`: 5.55 / 5.88 / 5.20, 6.22%; diff mask shows only glyph/photo-recompression residual
  and the documented "3" vs "2" counter text, no structural blocks.
- `2172:7907`: 5.44 / 5.16 / 4.51, 6.02% — identical to legacy `2159:12842`, confirming the
  pixel-duplicate finding above.

`tsc --noEmit` and `npm run build` are clean. The full `figma_compare.py` suite (39 rows) shows no
regression elsewhere; it still exits non-zero only because Activity's previously documented
text-antialiasing residual exceeds the global 8.0 threshold. None of this work is committed yet.

## Notebook detail fully data-driven across all four notebooks (2026-08-29)

The user pointed at 8 nodes for "chi tiết sổ tay" (notebook detail) and explicitly asked to
determine which were scroll-states of one screen versus genuinely separate screens before coding.
Investigated via `get_metadata` (cheap orientation) then full `get_design_context` (exact text/
structure) rather than assuming from screenshots alone:

- `2172:4487`/`5069`/`5118`/`5167` are each notebook's **Mục lục (TOC)** screen — the same
  screen/component as the already-shipped `2159:12842`/`2172:7907` (cover card, tabs, collapsed
  outline), just restaged with each notebook's own outline. `2172:4487` (Research) is a confirmed
  pixel-duplicate of what already shipped.
- `2172:4589`/`5216`/`5256`/`5296` are a **separate screen** reached via "Xem sổ tay" (previously a
  dead button with no `onClick`), confirmed by: their own header (compact title bar replacing the
  cover card, with its own back target), their own footer ("Add Section" + share, not "Chia sẻ"/
  "Xem sổ tay"), and a `get_metadata` structural diff against the TOC screen. This is genuinely new
  UI, not a scrolled state — built as `src/screens/NotebookReadingScreen.tsx`.

**Data model**: added `NotebookOutlineItem`/`NotebookOutlineSubItem` (`number`, `title`, optional
`body`, optional `subItems`, optional `defaultExpanded`) and an `outline: NotebookOutlineItem[]`
field to `Notebook`, plus `meta`/`summary` (the cover's two text lines, previously hardcoded to
Research's copy for every notebook). Populated exactly for all four notebooks in
`INITIAL_NOTEBOOKS`. The reading screen renders only outline items/sub-items that carry a `body`
— for every notebook this is item 1, item 2, and item 2's first two sub-items; item 2's third
sub-item and items 3/4 never carry a `body` in any of the four nodes, so they only ever appear in
the TOC. `mnemeContext.tsx`'s `addNotebook` (freshly AI-generated notebooks, no Figma node) now
derives a matching `outline` from its `sections` instead of leaving the field unset.

**`NotebookDetailScreen.tsx` refactor**: the TOC content and footer were absolutely-positioned at
fixed pixel offsets tuned for one notebook's content length. With real per-notebook outlines this
broke immediately — AI Tips & Tricks (the longest) rendered its footer buttons overlapping rows 3
and 4. Fixed by measuring each of the four nodes' own Button y-offset against its own TOC content
block height: the gap from tabs+content-block-end to the footer is a **constant 49px across all
four**, and the header+cover+tabs block's own height is **constant 411px** (matching the original
single-notebook pixel-verified offset). So that first block stays absolutely positioned exactly as
before, unchanged in height; the TOC/Thông tin content and the footer switched to normal flow
below it, with the footer's `mt-[49px]` reproducing every notebook's correct position without any
per-notebook conditional. Also removed a redundant screen-local home-indicator `<div>` — `App.tsx`
already draws one globally for `usesWhiteCanvas` screens (confirmed by reading `App.tsx`, not
assumed) and the screen-local copy would have floated at the wrong position once the layout went
dynamic-height.

**Getting exact paragraph breaks right** (the most time spent on this pass): several outline
items' `body` text is split across multiple Figma text nodes rather than one paragraph, and the
split matters visually — but two different splits exist, indistinguishable from `get_metadata`'s
flattened text (had to re-fetch full `get_design_context` per reading screen to see the actual
`<p>` boundaries):
1. A plain two-paragraph split (`<p mb-0>chunk1</p><p>chunk2</p>`, no third node) — this measures
   flush, zero extra gap, confirmed via the node's own Frame-height arithmetic (a 228px-tall block
   = title 24 + gap 12 + exactly 8 lines of 24px body, not 9). Encoded as a single `\n`.
2. A three-paragraph split with an explicit empty middle paragraph (a lone zero-width space or
   plain space, `<p mb-0>chunk1</p><p mb-0> </p><p>chunk2</p>`) — this one is a real blank line.
   Encoded as `\n\n`. Every notebook's "2.2" sub-item body uses this pattern; Research's item 1 and
   Món ăn's items 1 and 2 use the flush two-paragraph pattern instead.
Getting this wrong first (over-adding blank lines, then removing breaks entirely and letting text
reflow) is what produced two badly wrong intermediate states before landing on the correct
per-case reading, visible in this file's edit history — worth remembering that `get_metadata`
alone cannot distinguish these two cases.

Also corrected the outer block gap from the node's declared (but not actually reproduced) 24px
auto-layout gap to the observed 18px between top-level blocks (confirmed via bounding-box deltas
across three different notebooks' metadata — the same "declared gap ≠ rendered gap" quirk already
documented for `AddLinkScreen`'s card), with a nested 12px gap specifically between a "2." item's
own sub-items, and added a 15px flow spacer before the sticky header that the original TOC
screen's `top-[15px]` back-button offset already implied but the reading screen was missing
entirely (this alone accounted for roughly half of an initial ~40-point score error).

**On the remaining elevated score**: after all of the above, the four reading screens still score
~20–28 instead of the usual ~5–7 (see `kit/docs/FIGMA_MAP.md`'s "known elevated score" note for
the full investigation). This was not left unexamined — Playwright-measured title positions match
the node's own derived formula to the pixel on every checkpoint tried (Research's titles at 113,
359, 533, 701 all match hand-derived expected values from the node's own block-height arithmetic
exactly), and a brute-force vertical-shift search confirms 0px shift is already optimal. The
elevated score is attributable to text density — these are the only screens in the app with
multiple full paragraphs of body copy, so ordinary cross-renderer glyph antialiasing (present at a
low, accepted baseline on every other screen) accumulates over far more character edges here.

Verification: `tsc --noEmit` and `npm run build` clean. Full `figma_compare.py` re-run after every
fix; confirmed zero regression on all previously-verified rows including `2159:12842`/`2172:7907`
(unchanged at 5.44/5.16/4.51 → 5.45/5.17/4.51, noise-level). Playwright walked all 4 notebooks ×
both screens through the real UI (Sổ tay tab → notebook → Xem sổ tay → back → back) each run.
`kit/scripts/figma_compare.py`'s `SCREENS` gained 8 rows; `kit/figma-refs/` gained the 8
corresponding reference exports plus `out/compare_*` diff masks for all 8. None of this is
committed yet.

## Create-notebook route and phone scrolling corrected (2026-08-29)

The three supplied nodes had already been implemented and pixel-compared separately, but the
runtime storyboard between them was wrong. `App.tsx` still inserted legacy source-choice node
`2159:13626` after the Notebook list, then sent “Tiếp tục” through the unrelated legacy analysis
screen. The active route now follows the supplied frames directly:

`2172:4536` Notebook list → “Tạo sổ tay” → `2172:4631` source selection → “Tiếp tục” →
`2172:7907` Research notebook detail.

The legacy `CreateNotebookScreen.tsx` and `NotebookAnalysisScreen.tsx` files remain available for
historical/reference work but are intentionally unreachable from this showcase flow. Their stale
`2159:13626` row was removed from `figma_compare.py`; the `2172:4631` capture path now uses the real
direct navigation above.

Fixed the phone-scroll behavior rather than treating the Figma export as a clipped poster:

- the shared `<main>` explicitly enables vertical touch panning, momentum scrolling and contained
  overscroll;
- `SelectSourcesScreen` no longer uses a fixed 800px `overflow-hidden` root;
- the two additional source rows present below `2172:4631`'s static frame are rendered and reachable
  by scrolling;
- the purple “Bỏ chọn / Tiếp tục” action remains sticky at the same viewport Y while the source list
  moves beneath it.

Playwright verified the complete path against the production bundle (`npm run build` + `npm start`).
On 390×856, source selection reports `clientHeight=812`,
`scrollHeight=1090`, reaches `scrollTop=278`, and the CTA remains at Y=748 before and after the
scroll. Notebook list also scrolls (`847 > 812`, 35px reachable); back from detail returns to source
selection, with zero broken images and zero page errors. An overflow audit found no visible
text element with uncontained horizontal overflow on either source selection or notebook detail.
The initial `2172:4631` viewport remains pixel-stable at 5.57 / 5.90 / 5.21 (6.23% over 28), within
noise of its earlier 5.55 / 5.88 / 5.20 score.

## Blank screen after “Tiếp tục” — root cause and permanent guard (2026-08-29)

Reproduced the user-reported blank screen without clearing browser storage. The direct route itself
was correct; the crash came from a persisted schema mismatch:

- older `mneme_notebooks_v1` records were written before `Notebook` gained required `meta`,
  `summary`, and `outline` fields;
- `MnemeProvider` previously returned `JSON.parse(saved)` directly and TypeScript could not validate
  that runtime object;
- `NotebookDetailScreen` immediately called `notebook.outline.find(...)`, producing the exact browser
  error `Cannot read properties of undefined (reading 'find')`;
- the exception escaped the React tree, leaving only the empty white app canvas.

Permanent prevention added:

1. `migrateSavedNotebooks` refreshes canonical ids 1–4 from `INITIAL_NOTEBOOKS`, adds missing fixtures,
   and derives `meta`/`summary`/`outline` for unrelated old user-created notebooks without deleting
   their sections.
2. All persisted arrays now cross a `readSavedArray` runtime boundary that catches malformed JSON
   and non-array values instead of allowing hydration to crash.
3. `NotebookDetailScreen` and `NotebookReadingScreen` defensively normalize `outline` before calling
   collection methods.
4. `AppErrorBoundary` wraps the provider and displays a contained “Khôi phục dữ liệu demo” action if
   an unknown future render error gets past migrations, so the app never silently becomes white.
5. Added `kit/scripts/notebook_flow_smoke.py` as a regression test. It injects the exact old schema
   and malformed JSON, walks `4536 → 4631 → 7907`, and records requests to Gemini.

The active create-notebook path is deliberately fake/local: “Tiếp tục” opens canonical Research
fixture id 1 synchronously and never calls `addNotebook` or `/api/gemini/create-notebook`. Production
smoke result: stale schema migrated, malformed JSON recovered, detail rendered with zero page errors,
and `gemini_requests_in_showcase_flow: 0`. `tsc --noEmit` and `npm run build` remain clean.

## Remove duplicate “Self-care · Tổng hợp” notebooks (2026-08-29)

The two duplicate notebooks were not part of `INITIAL_NOTEBOOKS`; they were stale records created by
the retired Gemini showcase flow and persisted in `mneme_notebooks_v1`. Notebook hydration now removes
that exact legacy title (including punctuation/diacritic variants) while preserving every unrelated
user-created notebook. The notebook smoke test injects both historical variants and verifies that the
two duplicates are deleted, an unrelated local notebook survives, and the four canonical fixtures are
still restored.

## Notebook AI Suggestions flow rebuilt (2026-08-29)

Implemented the full supplied storyboard from the exact Figma nodes (the duplicated `2172:5510`
URL maps to one screen, so it is implemented once):

`2172:7956` Notebook banner → “Cập nhật ngay” → `2172:5336` Suggestions list → Review →
`2172:5510` Research / `2172:5409` Món ăn / `2172:5614` AI Tips / `2172:5717` Figma Tips.

- Rebuilt `AiSuggestionsScreen.tsx` with the exact white header/tabs, grouped Today/Yesterday cards,
  notebook covers, “Mới” badges, scores, and Review actions. All/New/Ignored are interactive.
- Added `AiSuggestionDetailScreen.tsx` as one shared, data-driven review layout. It renders each
  notebook's dark header, two exact suggested resources, match percentages, three AI reasons, and
  Add/Choose other/Ignore actions without duplicating four full-screen components.
- Added `src/data/aiSuggestions.ts` for the four fixtures and committed the exact Figma raw image
  assets. The one new settings glyph was exported from `2172:5336` and registered in `FigmaIcon`;
  existing exact Figma exports were reused for the shared back/more/AI/check glyphs.
- The route is local/fake by design and sends no Gemini request. Add changes only the local visual
  state; Ignore returns to the list and moves the notebook into the “Đã bỏ qua” tab; “Chọn sổ tay
  khác” returns to the Notebook tab.
- Every screen remains in the shared phone `<main>` and exposes all below-frame resources through
  vertical touch scrolling. Long titles, authors, URLs, and reason text wrap/truncate inside their
  own cards instead of leaking horizontally.

Added `kit/scripts/ai_suggestions_smoke.py`. Production smoke walked all four Review screens,
confirmed `scrollHeight > clientHeight` for list and details, exercised Add and Ignore, found zero
broken images/page errors/visible text overflow, and recorded `gemini_requests: 0`. `tsc --noEmit`
and `npm run build` are clean.

All six nodes were added to `figma_compare.py`, together with an optional `MNEME_FIGMA_NODES`
filter for targeted reruns. Final scores are banner 4.26/4.44/3.13, list 11.31/11.71/8.75,
Research 16.37/15.94/15.02, Food 15.62/15.24/14.32, AI Tips 15.61/15.27/14.62, and Figma
14.87/14.43/13.72. The detail values are elevated for the same reason as Notebook Reading: many
small text lines and JPEG edges accumulate Chrome-vs-Figma raster residuals. Side-by-side and diff
masks show aligned headers/cards/images/buttons rather than displaced structural blocks; the
Research reason wrap was explicitly corrected to remain inside its lavender area.

## Docker deployment on port 1300 (2026-08-29)

Added a multi-stage `Dockerfile` and `.dockerignore`. The runtime image installs production
dependencies only, runs as the unprivileged `node` user, listens on configurable `PORT` (default
1300), and checks `/api/health`. `server.ts` now imports Vite only inside the development branch;
the former top-level import made a production-only image require a package that correctly exists
only in `devDependencies`.

Built `mneme-system:port-1300`, started `mneme-port-1300` on
`127.0.0.1:1300`, and verified Docker health, `/api/health`, the built index, and SPA fallback all
return successfully. Gemini remains optional (`geminiConfigured: false` without a runtime secret).

## Next work

1. Add `2172:7830`, `2172:5821`, `2172:8010`, and `2172:8057` as rows in
   `kit/scripts/figma_compare.py`'s `SCREENS` table so they get a numeric pixel-diff score like
   every other rebuilt screen, instead of only a manual screenshot check.
2. The create-folder-then-open-folder flow (`onSelectFolder(folderName)` after submit) only
   resolves to a populated demo folder for names that already exist in `CATEGORY_FOLDERS`/seed
   data (e.g. `Phim tài liệu`); a freshly typed arbitrary name correctly opens its own new empty
   folder (verified), which is the existing `FolderDetailScreen` empty state, not a new one.
3. `NotebookReadingScreen.tsx`'s "Add Section" and share buttons are visual-only (no `onClick`
   yet, matching the node — neither button has an obvious target screen in the current node set).

## Important context

- Brand tokens live in `src/index.css`; the screens read them as literal hex values today.
- App state is exposed with `MnemeProvider` in `src/state/mnemeContext.tsx`.
- Gemini runs server-side in `server.ts` behind `/api/gemini/*`, keyed by `GEMINI_API_KEY`, which
  AI Studio configures as a server-side secret. Local fallback behavior is preserved.
- Figma asset URLs expire, so referenced assets are committed locally.
- Do not add authentication for this showcase build.
