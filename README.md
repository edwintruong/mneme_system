# Mneme

Modern React & TypeScript rewrite of Mneme — an AI-powered smart bookmarking and knowledge organizer showcase app built to match the Mneme Figma design system (Tokens 2159 Edition).

## Overview

- **Local-First & Showcase**: Runs out-of-the-box with no login required, with persistent local storage mirroring SQLite-style tables for categories, folders, links, and notebooks.
- **Gemini AI Integration**: Server-side Gemini 2.5 Flash API proxies (`/api/gemini/analyze-url` and `/api/gemini/create-notebook`) for intelligent link analysis, URL summarization, automated category & folder tagging, and multi-source notebook synthesis.
- **Offline & Fallback Ready**: If no Gemini API key is configured or network is disconnected, the app seamlessly provides local fallback categorization and synthesis.
- **Design Tokens**: Precision-aligned with Figma nodes for Home, Categories, Folders, Link Details, Add Link intake, 5-stage AI analysis, Notebooks, Source Selection, AI Suggestions, and Semantic Fuzzy Search.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm start
```
