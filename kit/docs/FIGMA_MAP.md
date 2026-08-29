# Figma implementation map

Source file: `8T9Olnto5GDBzUjXyP1ybY`.

Active source-of-truth section: `2159:12770`. Section `2143:4235` is legacy reference only.

| Flow/state | Active Figma node | React screen | Status |
| --- | --- | --- | --- |
| Home | `2159:12771` | `src/screens/HomeScreen.tsx` | Rebuilt from the node and pixel-compared |
| Home, add-link toast | `2159:13227` | `src/screens/HomeScreen.tsx` | Uses the exact success vector; layout not yet node-verified |
| Home variant | `2159:13303` | pending | Pending |
| Home variant | `2159:13676` | pending | Pending |
| Link detail | `2159:12980` | `src/screens/LinkDetailScreen.tsx` | Rebuilt from node; pixel-compared |
| Add link | `2159:13180` | `src/screens/AddLinkScreen.tsx` | Rebuilt from node; pixel-compared |
| Category list | `2159:13036` | `src/screens/CategoryScreen.tsx` | Rebuilt from node; pixel-compared |
| Create-folder sheet | `2159:13091` | `src/screens/CategoryScreen.tsx` | Rebuilt from node; pixel-compared |
| Empty folder | `2159:13158` | `src/screens/FolderDetailScreen.tsx` | Rebuilt from node; pixel-compared |
| Folder detail list | `2159:13174` | `src/screens/FolderDetailScreen.tsx` | Rebuilt from node; pixel-compared |
| Notebook detail | `2159:12842` | `src/screens/NotebookDetailScreen.tsx` | Rebuilt from node; pixel-compared |
| Notebook list | `2159:12891` | `src/screens/NotebookScreen.tsx` | Rebuilt from node; pixel-compared |
| Create notebook source choice | `2159:13626` | `src/screens/CreateNotebookScreen.tsx` | Legacy, intentionally unreachable — active `2172:4536` “Tạo sổ tay” opens `2172:4631` directly |
| Source selection | `2159:13570` | `src/screens/SelectSourcesScreen.tsx` | Superseded — the screen's only reachable path now renders showcase node `2172:4631`'s content instead of this node's lorem-ipsum rows; see Section 9 table |
| AI analysis | `2159:13602` | `src/screens/NotebookAnalysisScreen.tsx` | Legacy, intentionally unreachable in the direct `4536 → 4631 → 7907` showcase route |
| Notebook content | `2159:13374` | `src/screens/NotebookDetailScreen.tsx` | Pending state |
| AI suggestions list | `2159:13407` | `src/screens/AiSuggestionsScreen.tsx` | Superseded by the active showcase node `2172:5336` |
| AI suggestion detail | `2159:13479` | pending | Pending |
| Search empty | `2159:13796` | `src/screens/SearchScreen.tsx` | Legacy UI pending rebuild |
| Search results | `2159:13747`, `2159:13763` | `src/screens/SearchScreen.tsx` | Pending variants |
| Open-link confirmation | `2159:13778` | within search flow | Pending |

## Section 9 — showcase demo flow (`2172:3041`)

A separate, much larger section ("LUỒNG SHOWCASE APP DEMO") that restages the same
screens above with realistic demo content across several sample folders/categories
(K-drama, horror, anime, study/CV, travel, etc.) — apparently a storyboard for a demo
video, not new screen designs. Its `Folder Detail` frames (11 instances) use the exact
same component structure as `2159:13174`, confirmed by direct `get_design_context`
diff against `2172:5877` ("Phim Hàn").

All 11 `Folder Detail` frame node IDs were confirmed by screenshot (not metadata layer
names, which are stale — see the G1 gotcha below). None are "UI/UX"; the earlier guess in
this table was wrong. The real set is 3 more movie folders (extending categories already
seeded), 3 new travel folders, and 4 new cake folders:

All 11 nodes are now seeded and pixel-compared. Scores (mean abs diff / 255, R/G/B):

| Node | Folder name | Category | Score |
| --- | --- | --- | --- |
| `2172:5877` | Phim Hàn | Phim ảnh | 6.60 / 6.92 / 6.86 |
| `2172:5991` | Phim kinh dị | Phim ảnh | 6.43 / 6.23 / 5.93 |
| `2172:6105` | Phim ngắn | Phim ảnh | 5.87 / 5.74 / 5.42 |
| `2172:6221` | Anime | Phim ảnh | 6.33 / 6.29 / 6.20 (see crop-fix note in `docs/PROGRESS.md`) |
| `2172:7015` | Nhật Bản | Du lịch | 5.21 / 5.04 / 4.94 |
| `2172:7130` | Đông Nam Á | Du lịch | 5.39 / 5.32 / 5.26 |
| `2172:7244` | Mẹo du lịch tiết kiệm | Du lịch | 4.83 / 4.99 / 5.32 (also benefits from the flexible one-line header geometry) |
| `2172:7414` | Bánh Âu | Công thức bánh | 4.73 / 4.77 / 4.79 |
| `2172:7512` | Bánh Á | Công thức bánh | 5.10 / 5.14 / 5.11 |
| `2172:7610` | Bánh không cần lò nướng | Công thức bánh | 6.48 / 6.35 / 6.17 (flexible title geometry now keeps the node's one-line header) |
| `2172:7704` | Trang trí bánh | Công thức bánh | 5.08 / 5.09 / 5.25 |

`2172:7610` and `2172:7704` are the only two Folder Detail nodes whose link rows carry a
single tag chip instead of two — `FolderLinkRow` in `FolderDetailScreen.tsx` now renders
each tag chip conditionally rather than assuming both `tags[0]` and `tags[1]` exist.

Two Home-variant nodes listed in "Next work" below, `2159:13303` and `2159:13676`, turned
out to be pixel-duplicates of the already-verified Home frame (`2159:12771`) — not a
distinct scrolled-down state. No separate implementation was needed for them.

`CategoryScreen.tsx`'s folder-tile section was hardcoded to a single `MOVIE_FOLDERS` array
regardless of which category was open (a pre-existing bug: opening "Du lịch" showed movie
folder tiles). Fixed by keying the tile list off `category.name`, with the `Phim ảnh` entry
kept byte-identical to the old `MOVIE_FOLDERS` order so its pixel-verified state
(4.87/4.98/4.82) is untouched. `Du lịch` and `Công thức bánh` are now fully audited against
`2172:6846` and `2172:7359` respectively.

All 11 Folder Detail frames in Section 9 are now complete — see `docs/PROGRESS.md`'s
"Standing goal" checklist for the full history of this pass, including two real bugs
found and fixed along the way (image-crop leaf geometry, an off-by-one image mapping)
and two app-wide navigation fixes (bottom-nav scroll clearance, scroll-position reset
between screens).

`id:11`/`id:12`/`id:13` (Anime/Phim kinh dị/Phim ngắn) no longer double as their Folder
Detail's item 1 — `2159:13036` and their `2172:*` Folder Detail node show different title
text for the same reused photo, so one record can't satisfy both frames. `id:11/12/13`
now stay matched to `2159:13036` only (`folder: 'Phim ảnh'`, unreachable from Folder
Detail); `id:152/153/154` are the Folder Detail-only item-1 records. See
`docs/PROGRESS.md`'s "Content-accuracy audit" section for the full root cause.

| Activity | `2172:4208` | `src/screens/ActivityScreen.tsx` | Complete — 10.49 / 10.19 / 8.84 (see "Activity tab rebuilt from its own node" in `docs/PROGRESS.md`; residual is text-density antialiasing, not a structural mismatch) |
| Home | `2172:4416` | `src/screens/HomeScreen.tsx` | Complete — 3.15 / 3.20 / 3.16; exact fixed showcase fixtures, corrected crepe thumbnail, persisted-data normalization, and live clock preserved |
| Recent detail — Công thức bánh crepe | `2172:4258` | `src/screens/LinkDetailScreen.tsx` | Complete — 4.35 / 4.62 / 4.48; exact Tik Tok content |
| Recent detail — Tối ưu prompt AI | `2172:4313` | `src/screens/LinkDetailScreen.tsx` | Complete — 4.60 / 4.76 / 4.27; exact YouTube content and node SVG |
| Recent detail — Phim hay mùa hè 2026 | `2172:4365` | `src/screens/LinkDetailScreen.tsx` | Complete — 5.17 / 4.68 / 3.94; exact Facebook content and node SVG |
| Phim ảnh category | `2172:5822` | `src/screens/CategoryScreen.tsx` | Complete — 4.92 / 5.04 / 4.89; exact four visible folders/counts and deterministic overview links |
| Học tập & Công việc category | `2172:6335` | `src/screens/CategoryScreen.tsx` | Complete — 5.18 / 4.99 / 4.66; exact four visible folders/counts and four overview links |
| Folder detail — Ngoại ngữ | `2172:6390` | `src/screens/FolderDetailScreen.tsx` | Complete — 5.59 / 5.42 / 5.23; five exact links |
| Folder detail — Kỹ năng làm việc | `2172:6504` | `src/screens/FolderDetailScreen.tsx` | Complete — 6.04 / 6.05 / 5.74; five exact links |
| Folder detail — Tài liệu học tập | `2172:6618` | `src/screens/FolderDetailScreen.tsx` | Complete — 6.07 / 5.94 / 5.81; five exact links |
| Folder detail — Công cụ AI | `2172:6732` | `src/screens/FolderDetailScreen.tsx` | Complete — 5.47 / 5.24 / 4.86; five exact links |
| Du lịch category | `2172:6846` | `src/screens/CategoryScreen.tsx` | Complete — 4.76 / 4.50 / 4.31; exact folders/counts and four overview links |
| Folder detail — Việt Nam | `2172:6901` | `src/screens/FolderDetailScreen.tsx` | Complete — 4.94 / 4.68 / 4.61; five exact links |
| Công thức bánh category | `2172:7359` | `src/screens/CategoryScreen.tsx` | Complete — 4.68 / 4.54 / 4.41; exact counts, overview metadata, tags, and category-specific image crop |
| Create-folder sheet (restaged) | `2172:7830` | `src/screens/CategoryScreen.tsx` | Complete — reuses `2159:13091` sheet; submit now opens the created folder. Screenshot-verified, not yet in `figma_compare.py` |
| Folder detail — Phim tài liệu | `2172:5821` | `src/screens/FolderDetailScreen.tsx` | Complete — 5 exact links seeded (ids 20–24), reachable via `Phim ảnh` → "Xem tất cả folder". Screenshot-verified, not yet in `figma_compare.py` |
| Add link to category (Du lịch/Kyoto preset) | `2172:8010` | `src/screens/AddLinkScreen.tsx` | Complete — `initialCategory` prop swaps in the exact Kyoto preset and skips Gemini analysis via `addLink({ preset })`. Screenshot-verified, not yet in `figma_compare.py` |
| Home add-link toast (category variant) | `2172:8057` | `src/screens/HomeScreen.tsx` | Complete — replaces old dismissable toast with `Đã thêm vào category "…"` + `Mở` action. Screenshot-verified, not yet in `figma_compare.py` |
| Notebook list (showcase) | `2172:4536` | `src/screens/NotebookScreen.tsx` | Complete — 4.26 / 4.44 / 3.13, 4.69% over 28. Pixel-duplicate of `2159:12891` except one word ("15’" vs "15 phút"); fixed in `INITIAL_NOTEBOOKS`, see `docs/PROGRESS.md` |
| Notebook list with AI update banner | `2172:7956` | `src/screens/NotebookScreen.tsx` | Complete — “Cập nhật ngay” now opens the live Suggestions route; 4.26 / 4.44 / 3.13, 4.69% over 28 |
| AI Suggestions list | `2172:5336` | `src/screens/AiSuggestionsScreen.tsx` | Complete — grouped cards, live All/New/Ignored tabs, and Review navigation; 11.31 / 11.71 / 8.75, 8.90% over 28 |
| AI Suggestion Review — Research | `2172:5510` | `src/screens/AiSuggestionDetailScreen.tsx` | Complete — 16.37 / 15.94 / 15.02, 11.49% over 28; text/JPEG-heavy residual without displaced layout blocks |
| AI Suggestion Review — Món ăn | `2172:5409` | `src/screens/AiSuggestionDetailScreen.tsx` | Complete — 15.62 / 15.24 / 14.32, 10.25% over 28 |
| AI Suggestion Review — AI Tips & Tricks | `2172:5614` | `src/screens/AiSuggestionDetailScreen.tsx` | Complete — 15.61 / 15.27 / 14.62, 10.74% over 28 |
| AI Suggestion Review — Figma Tips & Tricks | `2172:5717` | `src/screens/AiSuggestionDetailScreen.tsx` | Complete — 14.87 / 14.43 / 13.72, 10.26% over 28 |
| Select sources for notebook (showcase) | `2172:4631` | `src/screens/SelectSourcesScreen.tsx` | Complete — active direct route from `2172:4536`; static viewport remains 5.57 / 5.90 / 5.21, while rows 5–6 are now reachable by touch scroll and the CTA stays sticky |
| Notebook detail (showcase) | `2172:7907` | `src/screens/NotebookDetailScreen.tsx` | Complete — direct local/fake-AI transition from `2172:4631`, no Gemini request. Persisted pre-outline notebooks are migrated before render to prevent the former blank-screen crash |
| Notebook Mục lục — Research | `2172:4487` | `src/screens/NotebookDetailScreen.tsx` | Complete — 5.45 / 5.17 / 4.51, 6.02% over 28. Pixel-duplicate of `2159:12842`/`2172:7907` |
| Notebook Mục lục — Món ăn | `2172:5069` | `src/screens/NotebookDetailScreen.tsx` | Complete — 5.41 / 5.04 / 4.30, 6.04% over 28. `NotebookDetailScreen` is now fully data-driven off `notebook.outline` (was previously hardcoded to the Research notebook's content for every notebook) |
| Notebook Mục lục — AI Tips & Tricks | `2172:5118` | `src/screens/NotebookDetailScreen.tsx` | Complete — 5.29 / 5.07 / 4.41, 5.90% over 28 |
| Notebook Mục lục — Đánh giá địa điểm du lịch | `2172:5167` | `src/screens/NotebookDetailScreen.tsx` | Complete — 5.71 / 5.65 / 4.98, 6.30% over 28 |
| Notebook reading — Research | `2172:4589` | `src/screens/NotebookReadingScreen.tsx` (new) | Complete but scores 21.25 / 21.49 / 14.66, 19.74% over 28 — see "known elevated score" note below; no structural defect found after exhaustive verification |
| Notebook reading — Món ăn | `2172:5216` | `src/screens/NotebookReadingScreen.tsx` | Complete, same known elevated-score profile: 20.35 / 21.07 / 14.10, 19.50% |
| Notebook reading — AI Tips & Tricks | `2172:5256` | `src/screens/NotebookReadingScreen.tsx` | Complete, same known elevated-score profile: 27.78 / 28.53 / 20.86, 22.47% (highest of the four — this notebook has the most body text) |
| Notebook reading — Đánh giá địa điểm du lịch | `2172:5296` | `src/screens/NotebookReadingScreen.tsx` | Complete, same known elevated-score profile: 21.86 / 21.93 / 13.90, 19.38% |
| Notebook-detail demo variants | many (see `Section 9` root) | existing screens | Not audited |

### Notebook reading screens — known elevated `figma_compare.py` score

All four `NotebookReadingScreen` rows score ~20–28 instead of the usual ~5–7, well past the
documented "~8 = structurally wrong" guidance. This was investigated exhaustively (not left as an
assumption): Playwright-measured bounding boxes of every title in the Research and AI Tips
screens match the node's own metadata-derived Y-offset formula to the pixel (e.g. Research's
`2.2` title lands at 701px against a hand-derived 701px from the node's own block heights and
gaps), and a brute-force vertical-shift search over the two images confirms 0px shift already
minimizes the diff — i.e. there is no residual misalignment to fix. The elevated score is text
density: these are the only screens in the app with multiple full paragraphs of body copy, so
ordinary Chrome-vs-Figma glyph antialiasing (present at a low, accepted level on every other
screen) accumulates over far more character edges than anywhere else. The diff masks (see
`kit/figma-refs/out/compare_2172_{4589,5216,5256,5296}_*.png`) show line-by-line antialiasing
ghosting, not solid structural blocks.

## Legacy implementation reference

| Flow | Figma node | React screen |
| --- | --- | --- |
| Home | `2143:5988` | `src/screens/HomeScreen.tsx` |
| Add link | `2143:7101` | `src/screens/AddLinkScreen.tsx` |
| Category/folders | `2143:6203` | `src/screens/CategoryScreen.tsx` |
| Folder detail | `2143:4870` | `src/screens/FolderDetailScreen.tsx` |
| Link detail | `2143:6066` | `src/screens/LinkDetailScreen.tsx` |
| Notebook list | `2143:5270` | `src/screens/NotebookScreen.tsx` |
| Choose notebook source | `2143:5058` | `src/screens/CreateNotebookScreen.tsx` |
| Select sources | `2143:4240` | `src/screens/SelectSourcesScreen.tsx` |
| AI analysis | `2143:4274` | `src/screens/NotebookAnalysisScreen.tsx` |
| Notebook detail | `2143:4945` | `src/screens/NotebookDetailScreen.tsx` |
| AI suggestion | `2143:5513` | `src/screens/AiSuggestionsScreen.tsx` |

Primary tokens confirmed by active Home `2159:12771`: background `#F8F6FD`, primary `#7758E2`, primary soft `#F1EEFC`, ink `#0E0727`, muted `#9490A2`, neutral surface `#F5F5F7`.

Token source: `src/index.css`. SVG registry/component: `src/components/common/FigmaIcon.tsx`. Asset rules and naming are documented in `kit/docs/ASSETS.md`.

## Asset status

`FigmaIcon` resolves every glyph from `public/assets/icons/`.

### Home, node 2159:12771 — complete

18 assets were downloaded from the node: 10 SVGs into `public/assets/icons/figma_2159/` and 8
JPEGs into `public/assets/images/figma_2159/`. `FigmaIcon` points Home's glyphs at these rather
than the legacy `2143:*` stand-ins.

Two exports need care, both verified against the Figma render:

- `2159_12771_more_vertical.svg` is a 2.5x12.5 vector, but the instance is **rotated** in the
  design: it renders as 12.5x2.5 centred at (12, 11) inside its 24px box. Render it rotated 90deg.
- `2159_12771_nav_bg.svg` is 390x75 while the node declares 428 wide. The notch measures at
  x=194.5 in the 390 render, so the vector is drawn at 390, not stretched.

The frame itself carries `px-20`. That is why the status bar is 350 wide starting at x=20 while
Content is a full 390 that overflows the padding — reproducing this is what aligns the status bar.

### Remaining screens

`public/assets/icons/figma/` still holds 84 SVGs exported from section `2143:*`. Pending screens
still using them must be re-exported from their own `2159:*` nodes when rebuilt.

### Link detail, node 2159:12980 — complete

The cover JPEG and twelve vectors were exported from the exact node. The 30px down-chevron export
is rotated 90 degrees by the frame to become the visible back arrow. Although this legacy node
draws time/status in the opposite order, the app intentionally keeps the same live Ho Chi Minh
City clock/status placement across every view per the user's explicit override.

Production comparison measures 6.79 / 6.54 / 5.55 with 6.53% of pixels over 28. The difference
mask contains image re-encoding detail and glyph rasterization, but no solid displaced regions;
all large frames, the 350x164 cover, 350x368 card, tags, metadata rows, and bottom controls align.

### Category list and create-folder sheet, nodes 2159:13036 and 2159:13091 — complete

The category screen uses the exact folder crop, four link images, eight node vectors, and Figma's
movie fixture text. The paired sheet uses its exact close vector and preserves the live local-first
folder mutation. Production comparison measures 4.87 / 4.98 / 4.82 for the list and
2.12 / 2.20 / 1.67 for the sheet; neither difference mask contains structural blocks.

### Folder detail states, nodes 2159:13158 and 2159:13174 — complete

`FolderDetailScreen` switches from the exact 356x706 empty card to the search/filter/list state
using the existing `MnemeProvider` links. The empty illustration, add glyph, five populated
thumbnails, and all visible controls come from their own nodes. Production comparison measures
0.73 / 0.78 / 0.79 for empty and 6.29 / 6.26 / 6.04 for populated; the populated residual is
limited to text/JPEG rasterization rather than displaced structures.

### Raster assets

The 14 PNGs that used to sit in `public/assets/images/` were unreadable: their first bytes were
`EF BF BD` repeated — the UTF-8 replacement character — followed by `JF` from a JFIF header, so
they were JPEGs rewritten through a UTF-8 text decode. The damage predated the React migration
(`44ab612` and `ab0756c` carry the same bytes). They were deleted and replaced by the 8 real
exports above, which are JPEG and are named `.jpg` accordingly.

## Comparison method

Render the app at 390x856 with `device_scale_factor: 1`, screenshot it, and diff against
`get_screenshot` of the node. Exclude pixels equal to `#444444`: that is the Figma canvas backdrop
showing through the frame's 40px corner radius, not part of the design.

Current production measurements are active Showcase Home (`2172:4416`) 3.15 / 3.20 / 3.16,
legacy Home (`2159:12771`) 4.02 / 4.37 / 4.44, Notebook list 4.42 / 4.59 / 3.25,
Add link 4.71 / 4.86 / 3.94, legacy Link detail 7.12 / 6.88 / 5.87,
recent details (`2172:4258`, `2172:4313`, `2172:4365`) 4.35 / 4.62 / 4.48,
4.60 / 4.76 / 4.27, and 5.17 / 4.68 / 3.94 respectively, Category list
4.87 / 4.98 / 4.82, Create folder 2.12 / 2.20 / 1.67, Empty folder 0.73 / 0.78 / 0.79, and
Folder detail 6.29 / 6.26 / 6.04. Text-heavy states retain glyph/JPEG residuals without structural
blocks. Notebook detail measures 5.43 / 5.14 / 4.47 with the same thin glyph-only residual, and
Create notebook measures 3.28 / 3.28 / 2.34, and Source selection measures
5.75 / 6.07 / 5.48.
