import { useEffect, useRef } from "react";
import { useThumbnailStore } from "../lib/store";
import { composeThumbnail, loadImage, canvasToDataURL } from "../lib/canvas";
// Fallback PRESETS to avoid missing-module compile error.
// If you have a real presets module, replace this with the correct import path.
const PRESETS: Record<string, any> = {};
import { downloadCanvas } from "../lib/canvas";

type Props = {
  hiddenCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function QuickEditor({ hiddenCanvasRef }: Props) {
  const editTitle = useThumbnailStore((s) => s.editTitle);
  const editSubtitle = useThumbnailStore((s) => s.editSubtitle);
  const setEditTitle = useThumbnailStore((s) => s.setEditTitle);
  const setEditSubtitle = useThumbnailStore((s) => s.setEditSubtitle);
  const preset = useThumbnailStore((s) => s.preset);
  const stage = useThumbnailStore((s) => s.stage);
  const activeId = useThumbnailStore((s) => s.activeVariantId);
  const variants = useThumbnailStore((s) => s.variants);
  const updateVariantDataUrl = useThumbnailStore((s) => s.updateVariantDataUrl);
  const activeVariant = variants.find((v) => v.id === activeId);

  const redrawTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-composite whenever edit fields change (debounced)
  useEffect(() => {
    if (!activeVariant || stage !== "done") return;
    if (redrawTimeout.current) clearTimeout(redrawTimeout.current);
    redrawTimeout.current = setTimeout(async () => {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) return;
      const bgImage = activeVariant.imageUrl
        ? await loadImage(activeVariant.imageUrl).catch(() => null)
        : null;
      const p = PRESETS[preset];
      const updatedStrategy = {
        ...activeVariant.strategy,
        title: editTitle || activeVariant.strategy.title,
        subtitle: editSubtitle,
      };
      composeThumbnail(canvas, bgImage, updatedStrategy, p);
      updateVariantDataUrl(activeVariant.id, canvasToDataURL(canvas));
    }, 300);
  }, [editTitle, editSubtitle]);

  if (stage !== "done" || !activeVariant) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="border-t border-zinc-800 pt-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          Quick Edit
        </p>
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title override"
            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          <input
            type="text"
            value={editSubtitle}
            onChange={(e) => setEditSubtitle(e.target.value)}
            placeholder="Subtitle override"
            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() =>
            hiddenCanvasRef.current &&
            downloadCanvas(
              hiddenCanvasRef.current,
              `thumbnail-${Date.now()}.png`
            )
          }
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 transition-colors"
        >
          ⬇ Download PNG
        </button>
        <button
          onClick={() => useThumbnailStore.getState().reset()}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {activeVariant.strategy && (
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs space-y-1.5">
          <p className="text-zinc-500 font-semibold uppercase tracking-widest">
            AI Strategy
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Emotion:</span>{" "}
            {activeVariant.strategy.emotion}
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Composition:</span>{" "}
            {activeVariant.strategy.composition.replace("_", " ")}
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Palette:</span>{" "}
            {activeVariant.strategy.colors.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
