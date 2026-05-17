AI YouTube Thumbnail Generator
A production-quality React + TypeScript app that generates YouTube thumbnails via a multi-stage AI pipeline.
Architecture
User Input
  │
  ▼
┌──────────────────────────────────────────────────────┐
│  Stage 1 — Strategy (Claude claude-sonnet-4-20250514)         │
│  Generates: title, subtitle, emotion, composition,   │
│             color palette, FLUX image prompt          │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│  Stage 2 — Image Generation (Fal.ai / FLUX Schnell)  │
│  Input:  refined imagePrompt from Claude strategy    │
│  Output: 1280×720 background image URL               │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│  Stage 3 — Canvas Compositor                         │
│  Layers: background → gradient overlay → title text  │
│          → subtitle → accent bar                     │
│  Output: 1280×720 PNG download                       │
└──────────────────────────────────────────────────────┘
Project Structure
src/
├── components/
│   ├── PromptForm.tsx          # Title + style notes input
│   ├── PresetSelector.tsx      # Gaming / Tech / Vlog presets
│   ├── ThumbnailPreview.tsx    # Canvas display + loading overlay
│   ├── LoadingOverlay.tsx      # Spinner with cancel support
│   └── QuickEditor.tsx         # Live text override + download
├── hooks/
│   └── useThumbnailGeneration.ts  # Full pipeline orchestration
├── lib/
│   ├── ai.ts                   # Claude + Fal API clients
│   ├── canvas.ts               # Decomposed canvas draw functions
│   ├── prompts.ts              # Prompt templates
│   └── store.ts                # Zustand global state
├── constants/
│   └── presets.ts              # Preset definitions + canvas dimensions
└── types/
    └── index.ts                # All TypeScript types
Setup
bashnpm install
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY and VITE_FAL_KEY
npm run dev
Key Features

Multi-stage AI pipeline: Claude for strategy → FLUX for image generation
Proper TypeScript: Fully typed including ThumbnailStrategy, ThumbnailPreset, GenerationStage
Zustand state management: Clean store with actions, no useState explosion
AbortController: Request cancellation on new generation or component unmount
Retry logic: 3-attempt retry with exponential backoff on Claude API calls
Decomposed canvas: drawBackground, drawOverlay, drawTitle, drawSubtitle, drawAccentBar
Live quick-edit: Debounced re-composite on every keystroke
API key safety: Keys proxied through Vite dev server; production should use a backend route

Production Considerations
In production, move AI calls to a backend route (/api/generate-strategy, /api/generate-image) so API keys are never exposed in the browser bundle. The Vite dev proxy in vite.config.ts handles this in development.