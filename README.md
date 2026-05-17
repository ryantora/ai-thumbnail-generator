AI YouTube Thumbnail Generator
A production-quality React + TypeScript app that generates YouTube thumbnails via a multi-stage AI pipeline — completely free to run.

Tech Stack:
React 18, TypeScript, Tailwind CSS v4
State Management:
Zustand Store
Generation: Groq API (LLaMA 3.1 8B Instant), Hugging Face Inference API (FLUX.1-schnell)
Canvas CompositorHTML5 Canvas API
Build Tool: Vite

Architecture:

User Input

Stage 1 — Strategy (Groq / LLaMA 3.1 8B)
Generates: title, subtitle, emotion, composition,
color palette, image prompt

Stage 2 — Image Generation (Hugging Face / FLUX)
Input:  refined imagePrompt from strategy
Output: 1280×720 background image blob

Stage 3 — Canvas Compositor
Layers: background → gradient overlay → title text
→ subtitle → accent bar                     │
Output: 1280×720 PNG download 



Project Structure:

components/

PromptForm.tsx             # Title + style notes input

PresetSelector.tsx         # Gaming / Tech / Vlog presets

ThumbnailPreview.tsx       # Canvas display + loading overlay

LoadingOverlay.tsx         # Spinner with cancel support

QuickEditor.tsx            # Live text override + download


hooks/

useThumbnailGeneration.ts  # Full pipeline orchestration

lib/

ai.ts                      # Groq + Hugging Face API clients

canvas.ts                  # Decomposed canvas draw functions

prompts.ts                 # Prompt templates

store.ts                   # Zustand global state


constants/

presets.ts                 # Preset definitions + canvas dimensions

types/

index.ts                   # All TypeScript types


Setup:

bashnpm install

cp .env.local

npm run dev

API Keys (both free)

.env.local

VITE_GROQ_API_KEY=your_groq_key_here

VITE_HF_TOKEN=your_huggingface_token_here


Key Engineering Features

Multi-stage AI pipeline — Groq handles fast text strategy, FLUX handles image synthesis

Fully typed — ThumbnailStrategy, ThumbnailPreset, GenerationStage, ThumbnailVariant types throughout

Zustand state management — single store with actions, no useState explosion

AbortController — request cancellation on new generation or component unmount, prevents race conditions

Retry with backoff — 3-attempt retry with exponential backoff on Groq API calls

Decomposed canvas — drawBackground, drawOverlay, drawTitle, drawSubtitle, drawAccentBar as isolated pure functions

Live quick-edit — debounced re-composite on every keystroke, instant preview updates

