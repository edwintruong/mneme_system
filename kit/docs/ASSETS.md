# Figma asset contract

All visual assets originate from Figma file `8T9Olnto5GDBzUjXyP1ybY`. The current export set was downloaded from the exact screen nodes listed in `FIGMA_MAP.md`; no SVG path was authored in this repository.

## Locations

- Raster fills and illustrations: `assets/images/`
- Vector layers and icons: `assets/icons/figma/`
- Dart asset names and fixed-size renderer: `lib/widgets/figma_icon.dart`
- Design/CSS-equivalent tokens: `lib/core/theme/figma_tokens.dart`

## Naming

Files use `<screen>_<semantic-layer>.svg`. When Figma exposes only a generic layer name such as `Huge-icon`, keep the stable export order as `<screen>_icon_<n>.svg`; inspect the SVG bytes before assigning it a semantic Dart constant.

## Implementation rules

1. Call Figma design context on the exact target node before changing a screen.
2. Download every referenced SVG immediately because MCP asset URLs expire.
3. Commit the exact downloaded bytes. Never redraw paths or inline an invented SVG.
4. Render with both width and height fixed through `FigmaIcon` or `FigmaVector`.
5. Reuse a semantic constant from `FigmaAssets`; do not reference an arbitrary filename throughout screen code.
6. Do not reintroduce Material `Icons.*`. `kit/scripts/check.sh` enforces this rule.
