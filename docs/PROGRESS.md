# Mneme implementation progress

Last updated: 2026-08-26

## Current milestone

The first runnable Flutter showcase milestone is complete. The app is local-first, requires no login, and follows the Figma node `2143:4235` visual system.

## Completed

- Inspected the Figma UI section and mapped its major flows: Home/Search, Add link, Category/Folder, Link detail, Notebook creation/detail, and AI suggestions.
- Confirmed `kit/` currently contains empty placeholder directories only.
- Created the Android/iOS Flutter project with one Dart file per screen.
- Added SQLite persistence and seeded demo data for categories, folders, links, and notebooks.
- Added exact raster assets exported from Figma under `assets/images/`.
- Implemented working demo actions: search, add/classify a link, create a folder, open/delete/favorite a link, create a notebook, and accept an AI suggestion.
- `flutter analyze`: clean.
- `flutter test`: passing.

## Screen map

- `lib/screens/home/home_screen.dart`: Figma `2143:5988`
- `lib/screens/add_link/add_link_screen.dart`: Figma `2143:7101`
- `lib/screens/folder/category_screen.dart`: Figma `2143:6203`
- `lib/screens/link/link_detail_screen.dart`: Figma `2143:6066`
- `lib/screens/notebook/notebook_screen.dart`: Figma `2143:5270`
- `lib/screens/notebook/create_notebook_screen.dart`: Figma `2143:5058`
- `lib/screens/notebook/notebook_detail_screen.dart`: Figma `2143:4945`
- `lib/screens/notebook/ai_suggestions_screen.dart`: Figma `2143:5513`

## Next work

1. Run the app on a 390x844 emulator and compare every happy-path screen against its Figma screenshot.
2. Refine spacing/typography and test smaller Android device overflow.
3. Add the secondary Figma states: notebook analysis progress, multi-select edit, rename/tag sheets, empty search/filter, and share/delete confirmation states.
4. Replace the inferred demo script once the missing pasted script content is available.

## Important context

- Brand tokens live in `lib/core/theme/app_theme.dart`.
- App state is exposed with `StoreScope`; persisted mutations live in `MnemeStore` and `LocalDatabase`.
- Figma asset URLs expire, so referenced raster assets are committed locally.
- Do not add authentication for this showcase build.
