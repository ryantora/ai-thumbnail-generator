import { useRef } from "react";
import { PromptForm } from "./components/PromptForm";
import { PresetSelector } from "./components/PresetSelector";
import { ThumbnailPreview } from "./components/ThumbnailPreview";
import { QuickEditor } from "./components/QuickEditor";
import { useThumbnailGeneration } from "./hooks/useThumbnailGeneration";
import { useThumbnailStore } from "./lib/store";
import { THUMBNAIL_W, THUMBNAIL_H } from "./constants/presets";
import "./index.css";

export default function App() {
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const { generate, cancel } = useThumbnailGeneration(hiddenCanvasRef);
  const error = useThumbnailStore((s) => s.error);
  const stage = useThumbnailStore((s) => s.stage);

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      <canvas ref={hiddenCanvasRef} width={THUMBNAIL_W} height={THUMBNAIL_H} className="hidden" />

      {/* Top nav */}
      <nav className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-xs font-black">
            ▶
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">ThumbAI</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          claude-sonnet · flux-schnell · canvas api
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Thumbnail Generator
          </h1>
          <p className="text-sm text-white/40 max-w-md">
            Multi-stage AI pipeline — Claude builds the strategy, FLUX renders the background, Canvas composites the final image.
          </p>
        </div>

        <div className="grid grid-cols-[400px_1fr] gap-10 items-start">
          {/* Left panel */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-6">
              <PromptForm onGenerate={generate} />
              <div className="border-t border-white/[0.06]" />
              <PresetSelector />
            </div>

            <QuickEditor hiddenCanvasRef={hiddenCanvasRef} />

            {stage === "error" && error && (
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-xs leading-relaxed">
                {error}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <ThumbnailPreview hiddenCanvasRef={hiddenCanvasRef} onCancel={cancel} />

            {/* Pipeline indicator */}
            <div className="flex items-center gap-3 px-1">
              {["Strategy", "Image", "Composite", "Done"].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      stage === "done" ? "bg-emerald-500" :
                      stage === "error" ? "bg-red-500" :
                      "bg-white/10"
                    }`} />
                    <span className="text-xs text-white/25 font-mono">{s}</span>
                  </div>
                  {i < 3 && <div className="w-6 h-px bg-white/5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}