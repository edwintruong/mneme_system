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
| Create notebook source choice | `2159:13626` | `src/screens/CreateNotebookScreen.tsx` | Rebuilt from node; pixel-compared |
| Source selection | `2159:13570` | `src/screens/SelectSourcesScreen.tsx` | Rebuilt from node; pixel-compared |
| AI analysis | `2159:13602` | `src/screens/NotebookAnalysisScreen.tsx` | Legacy UI pending rebuild |
| Notebook content | `2159:13374` | `src/screens/NotebookDetailScreen.tsx` | Pending state |
| AI suggestions list | `2159:13407` | `src/screens/AiSuggestionsScreen.tsx` | Legacy UI pending rebuild |
| AI suggestion detail | `2159:13479` | pending | Pending |
| Search empty | `2159:13796` | `src/screens/SearchScreen.tsx` | Legacy UI pending rebuild |
| Search results | `2159:13747`, `2159:13763` | `src/screens/SearchScreen.tsx` | Pending variants |
| Open-link confirmation | `2159:13778` | within search flow | Pending |

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

The cover JPEG and twelve vectors were exported from the exact node. The link-specific status bar
reverses the Home order (signals on the left, time on the right), so `App.tsx` switches the shared
chrome only for this view. The 30px down-chevron export is rotated 90 degrees by the frame to become
the visible back arrow.

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

Current production measurements are Home 3.10 / 3.13 / 3.06, Notebook list 4.40 / 4.57 / 3.23,
Add link 4.71 / 4.86 / 3.94, Link detail 6.79 / 6.54 / 5.55, Category list
4.87 / 4.98 / 4.82, Create folder 2.12 / 2.20 / 1.67, Empty folder 0.73 / 0.78 / 0.79, and
Folder detail 6.29 / 6.26 / 6.04. Text-heavy states retain glyph/JPEG residuals without structural
blocks. Notebook detail measures 5.43 / 5.14 / 4.47 with the same thin glyph-only residual, and
Create notebook measures 3.28 / 3.28 / 2.34, and Source selection measures
5.75 / 6.07 / 5.48.
