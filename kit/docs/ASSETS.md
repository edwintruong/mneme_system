# Figma asset contract

All visual assets originate from Figma file `8T9Olnto5GDBzUjXyP1ybY`. Migration assets are downloaded from exact nodes in active section `2159:12770`; no SVG path is authored in this repository.

## Locations

- Raster fills and illustrations: `assets/images/`
- Vector layers and icons: `assets/icons/figma/`
- Active-section raster fills: `assets/images/figma_2159/`
- Active-section vectors: `assets/icons/figma_2159/`
- Dart asset names and fixed-size renderer: `lib/widgets/figma_icon.dart`
- Design/CSS-equivalent tokens: `lib/core/theme/figma_tokens.dart`

## Naming

Legacy files use `<screen>_<semantic-layer>.svg`. Active-section files use `<node-id-with-underscore>_<semantic-layer>.<ext>`, for example `2159_12771_search.svg`. When Figma exposes only a generic layer name such as `Huge-icon`, inspect the exported bytes and screenshot before assigning a semantic Dart constant.

## Active Home `2159:12771`

Vectors committed from this exact node:

- `2159_12771_plus.svg`: floating add button.
- `2159_12771_more_vertical.svg`: exact 2.5x12.5 three-dot glyph; the Home frame rotates it to the visible horizontal state.
- `2159_12771_search.svg`, `2159_12771_filter.svg`: search card.
- `2159_12771_nav_bg.svg`, `2159_12771_nav_home.svg`, `2159_12771_nav_notebook.svg`, `2159_12771_nav_activity.svg`, `2159_12771_nav_profile.svg`: Home bottom navigation.
- `2159_12771_status_right.svg`: Figma iOS status reference only; the app continues to use the native platform status bar.

Raster bytes committed from this exact node:

- `2159_12771_avatar.png`.
- `2159_12771_recent_crepe.png`, `2159_12771_recent_prompt.png`, `2159_12771_recent_movie.png`.
- `2159_12771_category_study.png`, `2159_12771_category_travel.png`, `2159_12771_category_movie.png`, `2159_12771_category_cake.png`.

## Home toast `2159:13227`

All 19 assets returned by this exact node are committed with the `2159_13227_` prefix. SHA-256 verification confirms its 18 shared Home assets are byte-identical to the corresponding `2159_12771_` files, so the common Home implementation safely reuses the base constants. The unique `2159_13227_success.svg` is registered as `FigmaAssets.homeAddedSuccess` and rendered by the toast.

Remaining gap: nodes `2159:13303` and `2159:13676` have not yet been read or exported. Their assets must not be inferred from existing Home states.

## Implementation rules

1. Call Figma design context on the exact target node before changing a screen.
2. Download every referenced SVG immediately because MCP asset URLs expire.
3. Commit the exact downloaded bytes. Never redraw paths or inline an invented SVG.
4. Render with both width and height fixed through `FigmaIcon` or `FigmaVector`.
5. Reuse a semantic constant from `FigmaAssets`; do not reference an arbitrary filename throughout screen code.
6. Do not reintroduce Material `Icons.*`. `kit/scripts/check.sh` enforces this rule.
