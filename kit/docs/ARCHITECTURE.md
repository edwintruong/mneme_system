# Mneme Flutter architecture

## Layers

- `core/theme`: tokens translated from Figma.
- `models`: immutable domain records used by UI and persistence.
- `data`: SQLite creation, schema, migrations, and demo seed.
- `state`: `MnemeStore` mutations and `StoreScope` dependency access.
- `widgets`: small visual primitives shared across multiple screens.
- `screens/<feature>`: one route/screen per Dart file.

## Data flow

Screen action → `MnemeStore` mutation → SQLite write → `load()` → `notifyListeners()` → subscribed screens rebuild through `StoreScope`.

Android external shares enter through `MainActivity` (`ACTION_SEND` / `text/plain`), cross the `mneme/share` method channel in `ShareIntentBridge`, and open `AddLinkScreen` from `AppShell` for both cold and warm app states.

## Product constraints

- No login or remote backend in showcase mode.
- Demo content must survive app restart.
- Any Figma-exported raster used in committed code must be stored under `assets/images`; never leave an expiring Figma URL in Dart.
- Common Material icons are allowed only where their glyph clearly matches the Figma icon.
