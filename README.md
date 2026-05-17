AI YouTube Thumbnail Generator
A production-quality React + TypeScript app that generates YouTube thumbnails via a multi-stage AI pipeline — completely free to run.
Tech Stack
LayerTechnologyFrontendReact 18, TypeScript, Tailwind CSS v4State ManagementZustandStrategy GenerationGroq API (LLaMA 3.1 8B Instant)Image GenerationHugging Face Inference API (FLUX.1-schnell)Canvas CompositorHTML5 Canvas APIBuild ToolVite
Architecture
User Input
  │
  ▼
┌──────────────────────────────────────────────────────┐
│  Stage 1 — Strategy (Groq / LLaMA 3.1 8B)           │
│  Generates: title, subtitle, emotion, composition,   │
│             color palette, image prompt              │
└──────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────┐
│  Stage 2 — Image Generation (Hugging Face / FLUX)    │
│  Input:  refined imagePrompt from strategy           │
│  Output: 1280×720 background image blob              │
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
│   ├── PromptForm.tsx             # Title + style notes input
│   ├── PresetSelector.tsx         # Gaming / Tech / Vlog presets
│   ├── ThumbnailPreview.tsx       # Canvas display + loading overlay
│   ├── LoadingOverlay.tsx         # Spinner with cancel support
│   └── QuickEditor.tsx            # Live text override + download
├── hooks/
│   └── useThumbnailGeneration.ts  # Full pipeline orchestration
├── lib/
│   ├── ai.ts                      # Groq + Hugging Face API clients
│   ├── canvas.ts                  # Decomposed canvas draw functions
│   ├── prompts.ts                 # Prompt templates
│   └── store.ts                   # Zustand global state
├── constants/
│   └── presets.ts                 # Preset definitions + canvas dimensions
└── types/
    └── index.ts                   # All TypeScript types
Setup
bashnpm install
cp .env.example .env.local
# Fill in your free API keys (see below)
npm run dev
API Keys (both free)
Groq — Strategy Generation

Go to console.groq.com
Click Create API Key
Add to .env.local as VITE_GROQ_API_KEY

Free tier: 14,400 requests/day, no credit card needed.
Hugging Face — Image Generation

Go to huggingface.co/settings/tokens
Click New token → Role: Read
Add to .env.local as VITE_HF_TOKEN

Free tier: generous rate limits, no credit card needed.
.env.local
bashVITE_GROQ_API_KEY=your_groq_key_here
VITE_HF_TOKEN=your_huggingface_token_here
Key Engineering Features

Multi-stage AI pipeline — Groq handles fast text strategy, FLUX handles image synthesis; cleanly separated concerns
Fully typed — ThumbnailStrategy, ThumbnailPreset, GenerationStage, ThumbnailVariant types throughout
Zustand state management — single store with actions, no useState explosion
AbortController — request cancellation on new generation or component unmount, prevents race conditions
Retry with backoff — 3-attempt retry with exponential backoff on Groq API calls
Decomposed canvas — drawBackground, drawOverlay, drawTitle, drawSubtitle, drawAccentBar as isolated pure functions
Blob URL image loading — HuggingFace images fetched as blobs so canvas can draw them without CORS taint
Graceful fallback — if image generation fails, canvas falls back to a styled dark gradient so the app never crashes
Live quick-edit — debounced re-composite on every keystroke, instant preview updates
