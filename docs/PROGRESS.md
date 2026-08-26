# Mneme implementation progress

Last updated: 2026-08-27

## Current milestone

The first runnable Flutter showcase milestone is complete. The app is local-first and requires no login. Migration from legacy Figma section `2143:4235` to the source-of-truth section `2159:12770` is underway; base Home `2159:12771` and its add-link toast state `2159:13227` are now implemented and emulator-compared.

## Completed

- Inspected the Figma UI section and mapped its major flows: Home/Search, Add link, Category/Folder, Link detail, Notebook creation/detail, and AI suggestions.
- Confirmed `kit/` currently contains empty placeholder directories only.
- Created the Android/iOS Flutter project with one Dart file per screen.
- Added SQLite persistence and seeded demo data for categories, folders, links, and notebooks.
- Added exact raster assets exported from Figma under `assets/images/`.
- Implemented working demo actions: search, add/classify a link, create a folder, open/delete/favorite a link, create a notebook, and accept an AI suggestion.
- Completed the notebook showcase sequence: choose creation mode → select sources → animated AI analysis → notebook detail.
- Added link editing, favorite/delete confirmation, share preview, and folder multi-select move/delete actions.
- Added an inferred five-part showcase script in `docs/DEMO_SCRIPT.md`.
- Re-read the original attached 0:00–1:05 video script and replaced the inferred version with an exact screen/action mapping.
- Added the post-share AI analysis state, semantic natural-language retrieval for the script's air-fryer cake example, and a proactive Home notebook CTA.
- Added a real Android `ACTION_SEND` text share target; cold and warm share intents open the pre-filled Flutter intake flow.
- Added durable agent handoff instructions and Figma node mapping under `kit/`.
- Re-read 11 exact Figma screen/component nodes with the design-to-code workflow and downloaded 130 SVG vector exports into the repository.
- Removed all Material `Icons.*` usage, added fixed-size `FigmaIcon`/`FigmaVector` renderers, and rebuilt the notched bottom navigation with its exported Figma vectors.
- Added CSS-equivalent Figma color, type, spacing, radius, and shadow tokens plus an enforceable asset contract for future agents.
- Added Gemini REST integration with build-time API-key injection, URL Context/Google Search link classification, structured notebook writing, SQLite schema v3 persistence, and local fallback behavior.
- Rebuilt the base Home screen against exact node `2159:12771`, removed the non-Figma notebook CTA, and matched the fixed 390 px layout, content, spacing, image crops, chips, category rows, and bottom navigation.
- Downloaded and namespaced the 18 exact Home assets under `assets/icons/figma_2159/` and `assets/images/figma_2159/`; the active screen no longer consumes legacy Home/search/navigation assets.
- Rendered Home on the Android emulator at physical 1170x2568 / logical 390x856 and compared it with the 390x856 Figma export. After accounting for the native Android 24 px status bar versus the Figma iOS 44 px status bar, the aligned content-region mean absolute RGB difference is approximately 3.68/3.84/3.05 out of 255. Remaining platform-only differences are the status-bar glyphs/time, device corners, and Android navigation gesture bar.
- Implemented exact Home toast node `2159:13227` and connected it to the real Add link result: `LinkAnalysisScreen` returns the saved SQLite record, `AppShell` shows the 4-second success state, and “Mở” navigates to that saved link. The aligned full content comparison is approximately 4.14/4.00/3.81 RGB difference; the toast-only region is approximately 10.48/8.96/9.52.
- Replaced the inactive Notebook list's decorated container with an equivalent Material surface, removing the three debug runtime assertions emitted whenever `IndexedStack` built the hidden screen.
- `flutter analyze`: clean.
- `flutter test`: passing.

## Screen map

- `lib/screens/home/home_screen.dart`: active Figma `2159:12771` (base Home) and `2159:13227` (add-link toast); legacy `2143:5988` retired for these states
- `lib/screens/add_link/add_link_screen.dart`: Figma `2143:7101`
- `lib/screens/folder/category_screen.dart`: Figma `2143:6203`
- `lib/screens/link/link_detail_screen.dart`: Figma `2143:6066`
- `lib/screens/notebook/notebook_screen.dart`: Figma `2143:5270`
- `lib/screens/notebook/create_notebook_screen.dart`: Figma `2143:5058`
- `lib/screens/notebook/notebook_detail_screen.dart`: Figma `2143:4945`
- `lib/screens/notebook/ai_suggestions_screen.dart`: Figma `2143:5513`

## Next work

1. Implement the remaining Home states from exact nodes `2159:13303` and `2159:13676`; fetch each node context and its namespaced assets before editing.
2. Rebuild the remaining screens against section `2159:12770`, starting with Link detail `2159:12980` or Add link `2159:13180`, while preserving the current local-first interactions.
3. Continue frame-by-frame 390x844/856 emulator captures. Do not compensate in Flutter layout for native Android/iOS status-bar, device-corner, or home-indicator differences.
4. Preserve and re-test SQLite, Gemini offline fallback, sharing, and the existing demo script while replacing only the visual/content contract.

## Important context

- Brand tokens live in `lib/core/theme/app_theme.dart`.
- App state is exposed with `StoreScope`; persisted mutations live in `MnemeStore` and `LocalDatabase`.
- Figma asset URLs expire, so referenced raster assets are committed locally.
- Home comparison artifacts were kept in `/tmp` rather than committed; regenerate them from node `2159:12771` when revisiting the screen.
- Do not add authentication for this showcase build.
