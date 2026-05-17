import type { PresetKey } from "../types/index";
import { PRESETS } from "../constants/presets";

export const STRATEGY_SYSTEM_PROMPT = `
You are a professional YouTube thumbnail strategist with deep expertise in CTR optimization.

Your task: given a video topic and style preset, generate a thumbnail strategy.

Rules for title:
- 2–4 words maximum
- Emotionally charged (shock, curiosity, hype, fear, awe)
- Uppercase-friendly
- Avoid generic filler like "AMAZING", "INSANE", "THIS"
- Mobile-readable at thumbnail size

Rules for imagePrompt:
- Cinematic composition, empty lower-third for text overlay
- Specify: lighting, color mood, focal point, depth of field
- High contrast, photorealistic quality
- Avoid faces unless specified
- Always end with: "empty lower third space for text overlay, 16:9 ratio, 4k quality"

Return ONLY valid JSON. No markdown, no preamble, no explanation.

Schema:
{
  "title": string,
  "subtitle": string,
  "emotion": string,
  "composition": "text_bottom" | "text_left" | "text_right" | "text_center",
  "colors": string[],
  "imagePrompt": string
}
`.trim();

export function buildStrategyUserPrompt(
  videoTitle: string,
  preset: PresetKey,
  styleNotes: string
): string {
  const p = PRESETS[preset];
  return `
Video topic: "${videoTitle}"
Style preset: ${preset} (${p.label}) — ${p.bgStyle}
Style notes from creator: ${styleNotes || "none"}

Generate a thumbnail strategy. The imagePrompt must be optimized for Stable Diffusion / FLUX image generation.
`.trim();
}

export function buildImagePrompt(basePrompt: string, preset: PresetKey): string {
  const p = PRESETS[preset];
  return `${basePrompt}, ${p.bgStyle}, cinematic lighting, high contrast, professional photography, no text, no watermark, empty lower third space for text overlay, 16:9 ratio, 4k quality`;
}
