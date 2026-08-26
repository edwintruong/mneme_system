# Continuation prompt

You are taking over the Mneme Flutter repo at `/home/dodero/competition/mneme_system`. Continue from `docs/PROGRESS.md`; first read `AGENTS.md`, `/home/dodero/.codex/RTK.md`, `docs/GEMINI.md`, `kit/docs/ARCHITECTURE.md`, `kit/docs/FIGMA_MAP.md`, and `kit/docs/ASSETS.md`.

The active source of truth is the Figma file `8T9Olnto5GDBzUjXyP1ybY`, section node `2159:12770` (URL: `https://www.figma.com/design/8T9Olnto5GDBzUjXyP1ybY/mneme?node-id=2159-12770&m=dev`). The old section `2143:4235` is legacy reference only. Before editing any screen, load the `figma-design-to-code` skill, then call Figma `get_design_context` for that screen's exact node. Do not infer from a neighboring frame.

Screen/node map for the active section:

- Home: `2159:12771`, `2159:13227` (toast), `2159:13303`, `2159:13676`
- Link detail: `2159:12980`
- Add link: `2159:13180` (success/toast state is represented by Home `2159:13227`)
- Category list: `2159:13036`; create-folder sheet: `2159:13091`
- Empty folder: `2159:13158`; folder detail list: `2159:13174`
- Notebook detail: `2159:12842`; notebook list: `2159:12891`
- Create notebook source choice: `2159:13626`; source selection: `2159:13570`; AI analysis: `2159:13602`
- Notebook content: `2159:13374`; AI suggestions list: `2159:13407`; AI suggestion detail: `2159:13479`
- Search empty: `2159:13796`; search result variants: `2159:13747`, `2159:13763`; open-link confirmation: `2159:13778`

Pixel/design contract:

1. Treat each frame as a fixed 390 px wide mobile contract. Match its exact text, order, spacing, radius, color, typography, image crop, and visible states. Do not add helpful UI, Gemini badges, extra CTA, or navigation that is absent from the target frame.
2. Download every vector/icon/image used by a frame from its own Figma context/assets response and commit the bytes locally. Keep new assets namespaced by node, e.g. `assets/icons/figma_2159/2159_12771_search.svg`; never reuse an old `2143` asset unless the SVG bytes are verified identical. Never use `Icons.*`, `Icon(`, emoji, hand-authored SVG paths, or a visually similar substitute.
3. Preserve the local SQLite demo, all existing happy-path interactions, Gemini API-key injection/offline fallback, and no-login requirement. Gemini must never be hard-coded with a key and must not change the visual contract.
4. Reuse shared Flutter components/tokens only when their rendered result exactly matches the Figma component. Otherwise create a screen-specific component with the Figma node id in its name/comment. Keep one Dart screen per major frame/state.
5. Use the Figma exported frame as the visual reference. When possible, run the app at 390x844/856, capture screenshots, and compare against the corresponding Figma export; record any environment-only difference (status bar/home indicator) explicitly instead of compensating with fake content.

Execution and handoff:

- Use `rtk` before every shell command as required by `/home/dodero/.codex/RTK.md`.
- Work in small milestones. After each meaningful milestone run `rtk flutter analyze`, `rtk flutter test`, and `rtk bash kit/scripts/check.sh`.
- Update `docs/PROGRESS.md`, `kit/docs/FIGMA_MAP.md`, and `kit/docs/ASSETS.md` with the exact node/asset mapping and remaining gaps.
- Commit locally after each milestone using exactly `feat(scope): [one or two sentence summary]` (do not push). Keep unrelated user changes intact.
- If context becomes large, write the current state to `docs/PROGRESS.md` before compacting so another agent can resume without guessing.
- Do not claim pixel-perfect completion until the relevant frame has been rendered and compared; if an emulator is unavailable, say so and leave the comparison checklist/progress entry.
