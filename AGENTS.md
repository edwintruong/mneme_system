# Mneme agent instructions

1. Read `docs/PROGRESS.md` before changing code.
2. Read `kit/docs/ARCHITECTURE.md` and `kit/docs/FIGMA_MAP.md` before implementing a new screen.
3. Keep each full screen in its own file under `src/screens/`.
4. Reuse the tokens in `src/index.css`, the shared components in `src/components/`, and the
   `MnemeProvider` state; do not duplicate tokens or build a second state layer.
5. Never render an icon from an icon library. Every glyph must be an SVG exported from Figma,
   committed under `public/assets/icons/`, and registered in `src/components/common/FigmaIcon.tsx`.
   If a design needs a glyph that has not been exported yet, export it from Figma first.
6. Preserve the no-login, local-first showcase behavior.
7. Before every milestone commit, update `docs/PROGRESS.md` and run `npm run build`.
8. Use commit messages in the exact form `feat(scope): one or two sentence summary`.

The repository-level shell convention is defined by `/home/dodero/.codex/RTK.md`.
