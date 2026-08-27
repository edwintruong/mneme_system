# Figma asset contract

All visual assets originate from Figma file `8T9Olnto5GDBzUjXyP1ybY`. Active migration assets come
from section `2159:12770`; no SVG path is authored in this repository.

## Locations

- Active-section raster fills: `public/assets/images/figma_2159/`
- Active-section vectors: `public/assets/icons/figma_2159/`
- Legacy vectors awaiting replacement: `public/assets/icons/figma/`
- SVG registry and fixed-size renderer: `src/components/common/FigmaIcon.tsx`
- Design tokens: `src/index.css`

Active-section files use `<node-id-with-underscore>_<semantic-layer>.<ext>`, for example
`2159_12771_search.svg`. Check a raster's MIME type before choosing its extension. When Figma uses a
generic layer name, inspect the bytes and screenshot before assigning a semantic name.

## Completed node exports

### Home `2159:12771`

- Ten vectors cover the status bar, search/filter controls, overflow glyph, add button, and bottom
  navigation.
- Eight JPEGs cover the avatar, three recently saved images, and four categories.
- `2159_12771_more_vertical.svg` is intrinsically 2.5x12.5 and is rotated 90 degrees by the frame.
- `2159_12771_nav_bg.svg` exports at 390x75 even though one node measurement reports 428px.

### Home toast `2159:13227`

The unique success vector is `2159_13227_success.svg`. Its other assets are byte-identical to the
base Home exports and are reused.

### Notebook list `2159:12891`

The node-specific navigation, add, banner, NotebookLM, and cover assets are stored under the
`2159_12891_` prefix and registered where they are glyphs.

### Add link `2159:13180`

The node-specific back, overflow, link, clear, badge, image-badge, and dropdown vectors are stored
under the `2159_13180_` prefix.

### Link detail `2159:12980`

The exact cover JPEG and twelve node vectors are committed under the `2159_12980_` prefix: back,
share, star, copy, tag-add, layers, TikTok, saved-clock, overflow, mobile signal, Wi-Fi, and battery.
SHA-256 checks against the current MCP asset URLs confirmed that the handoff's first nine files and
cover are byte-identical; the three status vectors were then downloaded from the same node.

### Category list `2159:13036` and create-folder sheet `2159:13091`

The category node contributes the exact cropped folder PNG, four JPEG link thumbnails, and eight
vectors for header/search/filter/add/metadata controls. The sheet state reuses byte-identical base
assets and adds `2159_13091_close.svg` from its own node.

### Folder states `2159:13158` and `2159:13174`

The empty state contributes its chain illustration plus exact back, overflow, and add-circle
vectors. The populated state contributes five JPEG thumbnails and node-specific header, search,
filter, add, separator-dot, and overflow vectors.

### Notebook detail `2159:12842`

The cover gradient, NotebookLM mark, back/overflow controls, star, edit, AI sparkle, both dropdown
states, share, and open-book actions are stored as eleven node-specific SVG exports. The raw back
chevron and overflow vectors are rotated by their Figma instances; no CSS-authored glyph replaces
them.

### Create notebook `2159:13626`

The node contributes the transparent source-collage and folder rasters plus exact 30px back,
24px chevron, and status exports. The screen reproduces the node's multiple crop windows over the
original high-resolution transparent images instead of baking approximate thumbnails.

### Source selection `2159:13570`

The shared source JPEG and node-specific back, search, filter, selected/empty radio, metadata dot,
and three progress-step vectors are committed under the node prefix. The same exact thumbnail is
cropped by CSS in each repeated Figma row; no stock or seed image substitutes for it.

## Implementation rules

1. Load the Figma design-to-code skill and call design context on the exact target node before
   changing a screen.
2. Download every referenced asset immediately because MCP URLs expire.
3. Compare shared-looking exports byte-for-byte before reusing an existing file.
4. Commit exact downloaded bytes. Never redraw paths or inline invented SVG.
5. Register every glyph in `FigmaIcon` with both intrinsic width and height.
6. Run `npm run build`, the production server, and `kit/scripts/figma_compare.py`; inspect the
   generated difference mask in addition to the numeric score.
