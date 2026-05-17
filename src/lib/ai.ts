import type { ThumbnailStrategy, PresetKey } from "../types";
import {
  STRATEGY_SYSTEM_PROMPT,
  buildStrategyUserPrompt,
  buildImagePrompt,
} from "./prompts";

// ─── Groq: strategy generation (free, no region restrictions) ─────────────────
// Get a free key at https://console.groq.com → "Create API Key"
// Uses llama-3.1-8b-instant — extremely fast and free.
 
async function callGroq(system: string, user: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_GROQ_API_KEY in .env.local");
 
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 1000,
      temperature: 0.9,
    }),
  });
 
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Groq API error: ${res.status}`);
  }
 
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
 
function parseStrategyJSON(raw: string): ThumbnailStrategy {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as ThumbnailStrategy;
}
 
export async function generateStrategy(
  videoTitle: string,
  preset: PresetKey,
  styleNotes: string,
  retries = 3
): Promise<ThumbnailStrategy> {
  const userPrompt = buildStrategyUserPrompt(videoTitle, preset, styleNotes);
  let lastErr: Error | null = null;
 
  for (let i = 0; i < retries; i++) {
    try {
      const raw = await callGroq(STRATEGY_SYSTEM_PROMPT, userPrompt);
      return parseStrategyJSON(raw);
    } catch (err) {
      lastErr = err as Error;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr ?? new Error("Strategy generation failed after retries");
}
// ─── Pollinations.ai: image generation (completely free, no key needed) ────────
// Docs: https://pollinations.ai
 
// ─── Pollinations.ai: image generation (completely free, no key needed) ────────
 
function pollinationsUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&seed=${seed}&nologo=true&model=flux`;
}
 
function waitForImage(src: string, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
 
    const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
    signal?.addEventListener("abort", onAbort);
 
    img.onload = () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(src);
    };
    img.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      reject(new Error("Image failed to load"));
    };
 
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    img.src = src;
  });
}
 
export async function generateBackgroundImage(
  strategy: ThumbnailStrategy,
  preset: PresetKey,
  signal?: AbortSignal
): Promise<string> {
  const prompt = buildImagePrompt(strategy.imagePrompt, preset);
  const maxRetries = 3;
 
  for (let i = 0; i < maxRetries; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    try {
      const seed = Math.floor(Math.random() * 99999);
      const url = pollinationsUrl(prompt, seed);
      return await waitForImage(url, signal);
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err;
      // Wait a bit before retrying
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
 
  // All retries failed — return empty string so canvas uses gradient fallback
  return "";
}