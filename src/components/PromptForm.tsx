import { useThumbnailStore } from "../lib/store";

type Props = { onGenerate: () => void };

export function PromptForm({ onGenerate }: Props) {
  const videoTitle = useThumbnailStore((s) => s.videoTitle);
  const styleNotes = useThumbnailStore((s) => s.styleNotes);
  const stage = useThumbnailStore((s) => s.stage);
  const setVideoTitle = useThumbnailStore((s) => s.setVideoTitle);
  const setStyleNotes = useThumbnailStore((s) => s.setStyleNotes);

  const isLoading = stage === "strategy" || stage === "image" || stage === "compositing";
  const canSubmit = !isLoading && videoTitle.trim().length > 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">
          Video Title
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSubmit && onGenerate()}
          placeholder="e.g. I Built the World's Fastest PC…"
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">
          Style Notes{" "}
          <span className="normal-case font-normal text-white/15">(optional)</span>
        </label>
        <input
          type="text"
          value={styleNotes}
          onChange={(e) => setStyleNotes(e.target.value)}
          placeholder="e.g. dramatic, dark energy, shock factor"
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
          disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed
          enabled:bg-gradient-to-r enabled:from-red-600 enabled:to-orange-500 enabled:text-white enabled:hover:opacity-85 enabled:active:scale-[0.99]"
      >
        {isLoading ? "Generating…" : "Generate Thumbnail"}
      </button>
    </div>
  );
}
