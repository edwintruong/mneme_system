# Mneme agent instructions

1. Read `docs/PROGRESS.md` before changing code.
2. Read `kit/docs/ARCHITECTURE.md` and `kit/docs/FIGMA_MAP.md` before implementing a new screen.
3. Keep each full screen in its own Dart file under `lib/screens/<feature>/`.
4. Reuse `AppColors`, common widgets, `StoreScope`, and SQLite models; do not duplicate tokens or build a second state layer.
5. Preserve the no-login, local-first showcase behavior.
6. Before every milestone commit, update `docs/PROGRESS.md` and run `kit/scripts/check.sh`.
7. Use commit messages in the exact form `feat(scope): one or two sentence summary`.

The repository-level shell convention is defined by `/home/dodero/.codex/RTK.md`.
