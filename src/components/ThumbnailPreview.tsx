import { useEffect, useRef } from "react";
import { useThumbnailStore } from "../lib/store";
import { composeThumbnail } from "../lib/canvas";
import { PRESETS, THUMBNAIL_W, THUMBNAIL_H } from "../constants/presets";
import { LoadingOverlay } from "./LoadingOverlay";

type Props = {
  hiddenCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCancel: () => void;
};

export function ThumbnailPreview({ hiddenCanvasRef, onCancel }: Props) {
  const displayRef = useRef<HTMLCanvasElement>(null);

  const stage = useThumbnailStore((s) => s.stage);
  const stageMessage = useThumbnailStore((s) => s.stageMessage);
  const activeId = useThumbnailStore((s) => s.activeVariantId);
  const variants = useThumbnailStore((s) => s.variants);
  const activeVariant = variants.find((v) => v.id === activeId);

  const isLoading =
    stage === "strategy" || stage === "image" || stage === "compositing";

  // Mirror the hidden canvas onto the display canvas
  useEffect(() => {
    const src = hiddenCanvasRef.current;
    const dst = displayRef.current;
    if (!src || !dst) return;
    const ctx = dst.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, dst.width, dst.height);
    ctx.drawImage(src, 0, 0, dst.width, dst.height);
  }, [activeVariant?.dataUrl, hiddenCanvasRef]);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
        Preview
      </label>
      <div className="relative rounded-xl overflow-hidden border border-zinc-700 aspect-video bg-zinc-900">
        <canvas
          ref={displayRef}
          width={640}
          height={360}
          className="w-full h-full block"
        />
        {isLoading && (
          <LoadingOverlay message={stageMessage} onCancel={onCancel} />
        )}
        {stage === "idle" && !activeVariant && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 text-sm gap-1">
            <span className="text-3xl">▶</span>
            <span>Your thumbnail appears here</span>
          </div>
        )}
      </div>
    </div>
  );
}
