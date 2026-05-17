import { PRESETS } from "../constants/presets";
import { useThumbnailStore } from "../lib/store";
import  type { PresetKey } from "../types/index";

export function PresetSelector() {
  const preset = useThumbnailStore((s) => s.preset);
  const setPreset = useThumbnailStore((s) => s.setPreset);

  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
        Style Preset
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
          const p = PRESETS[key];
          const active = preset === key;
          return (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150 border
                ${active
                  ? "border-red-500 bg-red-500/10 text-red-400"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                }`}
            >
              {p.icon} {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
