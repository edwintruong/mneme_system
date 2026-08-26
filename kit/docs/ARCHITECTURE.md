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

Gemini actions flow through `GeminiService` → `generateContent` REST (`URL Context` + `Google Search` + structured JSON) → `MnemeStore` validation/fallback → SQLite. Link metadata includes AI tags; notebook sections are persisted as JSON in `notebooks.content`. The UI never calls the Gemini transport directly.

## Product constraints

- No login or remote backend in showcase mode.
- Demo content must survive app restart.
- Never commit a Gemini key. The showcase key is accepted only through `--dart-define=GEMINI_API_KEY=...`; production requires a backend/mobile-safe integration because compile-time values can be extracted from an APK.
- Figma-exported raster assets belong under `assets/images`; exact vector exports belong under `assets/icons/figma`. Never leave an expiring Figma URL in Dart.
- Do not use `Icons.*`, `Icon`, or a hand-authored SVG as a visual substitute. Use `FigmaIcon`/`FigmaVector` with the committed bytes exported from the exact node.
- `figma_tokens.dart` is the Flutter equivalent of the Figma/CSS variable layer. Reuse its color, typography, spacing, radius, and shadow values before adding literals.
