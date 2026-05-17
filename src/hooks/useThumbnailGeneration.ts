import { useRef, useCallback } from "react";
import { useThumbnailStore } from "../lib/store";
import { generateStrategy, generateBackgroundImage } from "../lib/ai";
import { composeThumbnail, loadImage, canvasToDataURL } from "../lib/canvas";
import { PRESETS, THUMBNAIL_W, THUMBNAIL_H } from "../constants/presets";
import type { ThumbnailVariant } from "../types";

export function useThumbnailGeneration(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const abortRef = useRef<AbortController | null>(null);
  const store = useThumbnailStore();

  const generate = useCallback(async () => {
    if (!store.videoTitle.trim()) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    store.reset();
    // Re-set form values that were cleared by reset
    useThumbnailStore.setState({
      videoTitle: store.videoTitle,
      styleNotes: store.styleNotes,
      preset: store.preset,
    });

    try {
      // ── Stage 1: strategy ───────────────────────────────────────────────────
      store.setStage("strategy", "Analysing topic and building strategy…");
      const strategy = await generateStrategy(
        store.videoTitle,
        store.preset,
        store.styleNotes
      );
      if (signal.aborted) return;

      const variantId = crypto.randomUUID();
      const variant: ThumbnailVariant = {
        id: variantId,
        strategy,
        imageUrl: null,
        dataUrl: null,
      };
      store.addVariant(variant);
      store.setEditTitle(strategy.title);
      store.setEditSubtitle(strategy.subtitle);

      // ── Stage 2: image generation ───────────────────────────────────────────
      store.setStage("image", "Generating background image…");
      const imageUrl = await generateBackgroundImage(
        strategy,
        store.preset,
        signal
      );
      if (signal.aborted) return;

      // ── Stage 3: compositing ────────────────────────────────────────────────
      store.setStage("compositing", "Compositing thumbnail…");
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not available");

      const bgImage = await loadImage(imageUrl).catch(() => null);
      if (signal.aborted) return;

      const preset = PRESETS[store.preset];
      composeThumbnail(canvas, bgImage, strategy, preset);
      const dataUrl = canvasToDataURL(canvas);

      store.updateVariantDataUrl(variantId, dataUrl);
      store.setStage("done", "");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      store.setError((err as Error).message || "Generation failed");
    }
  }, [store, canvasRef]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    store.setStage("idle");
  }, [store]);

  return { generate, cancel };
}
