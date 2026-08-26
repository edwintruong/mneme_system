# Figma implementation map

Source file: `8T9Olnto5GDBzUjXyP1ybY`.

Active source-of-truth section: `2159:12770`. Section `2143:4235` is legacy reference only.

| Flow/state | Active Figma node | React screen | Status |
| --- | --- | --- | --- |
| Home | `2159:12771` | `src/screens/HomeScreen.tsx` | Not yet rebuilt against the node in React |
| Home, add-link toast | `2159:13227` | `src/screens/HomeScreen.tsx` | Uses the exact success vector; layout not yet node-verified |
| Home variant | `2159:13303` | pending | Pending |
| Home variant | `2159:13676` | pending | Pending |
| Link detail | `2159:12980` | `src/screens/LinkDetailScreen.tsx` | Legacy UI pending rebuild |
| Add link | `2159:13180` | `src/screens/AddLinkScreen.tsx` | Legacy UI pending rebuild |
| Category list | `2159:13036` | `src/screens/CategoryScreen.tsx` | Legacy UI pending rebuild |
| Create-folder sheet | `2159:13091` | within folder flow | Pending |
| Empty folder | `2159:13158` | `src/screens/FolderDetailScreen.tsx` | Pending state |
| Folder detail list | `2159:13174` | `src/screens/FolderDetailScreen.tsx` | Legacy UI pending rebuild |
| Notebook detail | `2159:12842` | `src/screens/NotebookDetailScreen.tsx` | Legacy UI pending rebuild |
| Notebook list | `2159:12891` | `src/screens/NotebookScreen.tsx` | Legacy UI pending rebuild |
| Create notebook source choice | `2159:13626` | `src/screens/CreateNotebookScreen.tsx` | Legacy UI pending rebuild |
| Source selection | `2159:13570` | `src/screens/SelectSourcesScreen.tsx` | Legacy UI pending rebuild |
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

`FigmaIcon` resolves every glyph from `public/assets/icons/`. Two gaps remain, and both need the
Figma MCP server connected before they can be closed.

### Icons still exported from the legacy section

`public/assets/icons/figma/` holds 84 SVGs exported from section `2143:*`. Only
`public/assets/icons/figma_2159/2159_13227_success.svg` comes from the active section. The 18
namespaced Home exports (nav, search, filter, more-vertical, status bar) were deleted by commit
`fce32d0` and must be re-exported from `2159:12771` rather than reused from the legacy set.

### Every raster asset is corrupt

All 14 PNGs under `public/assets/images/` are unreadable. Their first bytes are `EF BF BD`
repeated — the UTF-8 replacement character — followed by `JF` from a JFIF header, so the files were
originally JPEG and were rewritten through a UTF-8 text decode that destroyed every non-UTF-8 byte.
The damage predates the React migration: the same bytes are in `44ab612` and `ab0756c`. The
original bytes are unrecoverable, so each image must be downloaded again from its Figma node and
saved as binary.
