# Mneme

Flutter mobile showcase app generated from the Mneme Figma design. It runs without authentication and stores demo content locally in SQLite.

## Run

```bash
flutter pub get
flutter run
```

## Gemini-powered demo

Use a restricted Gemini API key from Google AI Studio. The key is injected at build time and is never committed:

```bash
export GEMINI_API_KEY="your-key"
flutter run --dart-define=GEMINI_API_KEY="$GEMINI_API_KEY"
```

Optional model override:

```bash
flutter run \
  --dart-define=GEMINI_API_KEY="$GEMINI_API_KEY" \
  --dart-define=GEMINI_MODEL="gemini-3.7-flash"
```

With a key, Mneme uses Gemini URL Context and Google Search to read/classify links and write structured notebooks. Without a key, network, or successful Gemini response, the app stays runnable with its local demo fallback. See [docs/GEMINI.md](docs/GEMINI.md) for security and architecture details.

See [docs/PROGRESS.md](docs/PROGRESS.md) for the implementation map, completed flows, and the next handoff tasks.
