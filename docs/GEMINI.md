# Gemini integration

Mneme uses the Gemini `generateContent` REST endpoint for non-interactive AI tasks. The default model is `gemini-3.7-flash`; override it with `--dart-define=GEMINI_MODEL=...` when needed.

## Configuration

```bash
export GEMINI_API_KEY="your-key"
flutter run --dart-define=GEMINI_API_KEY="$GEMINI_API_KEY"
```

`GEMINI_API_KEY` is read with `String.fromEnvironment`, sent only through the `x-goog-api-key` request header, and never stored in SQLite. Do not paste a real key into Dart, Gradle, documentation, or a committed `.env` file.

The compiled mobile binary still contains any `--dart-define` value. This is acceptable only for the local showcase. A production release must call Gemini through a controlled backend or use an appropriate mobile-safe Google/Firebase integration. Use a Gemini-restricted authorization key for the demo and rotate it after recording.

## Flows

### Link classification

`LinkAnalysisScreen` starts `GeminiService.analyzeUrl`. Gemini receives the shared URL, uses URL Context and Google Search when supported, and returns structured JSON containing title, summary, category, folder, source, and tags. `MnemeStore` persists the result in SQLite.

### Notebook generation

`SelectSourcesScreen` passes exact selected link IDs. Gemini reads up to 12 URLs and returns a notebook title, description, and 3-6 structured sections. The full sections are serialized into the SQLite `notebooks.content` column and rendered by `NotebookDetailScreen`.

### Offline/error behavior

Missing keys, timeouts, blocked URLs, quota errors, and invalid model responses fall back to deterministic local content. The UI explicitly reports whether Gemini or the local fallback produced the result.

## Relevant files

- `lib/services/gemini_service.dart`: REST transport, tools, schemas, parsing, errors.
- `lib/state/mneme_store.dart`: fallback policy and SQLite persistence.
- `lib/data/local_database.dart`: schema version 3 migration.
- `test/gemini_service_test.dart`: request/response contract without spending API quota.
