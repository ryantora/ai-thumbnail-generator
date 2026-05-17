import type { ThumbnailPreset, PresetKey } from "../types/index";

export const PRESETS: Record<PresetKey, ThumbnailPreset> = {
  gaming: {
    label: "Gaming",
    icon: "🎮",
    titleColor: "#FFE000",
    shadowColor: "#FF0000",
    accentColor: "#FF0000",
    fontFamily: "Impact, 'Arial Narrow', sans-serif",
    fontWeight: "900",
    bgStyle:
      "epic gaming setup dark room RGB neon lights dramatic cinematic, high contrast, moody atmosphere",
  },
  tech: {
    label: "Tech",
    icon: "💻",
    titleColor: "#00D4FF",
    shadowColor: "#003A8C",
    accentColor: "#0099FF",
    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
    fontWeight: "800",
    bgStyle:
      "futuristic technology abstract digital holographic blue glow dark background cinematic",
  },
  vlog: {
    label: "Vlog",
    icon: "🎬",
    titleColor: "#FFFFFF",
    shadowColor: "#C0392B",
    accentColor: "#FF6B35",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontWeight: "700",
    bgStyle:
      "lifestyle photography vibrant warm tones golden hour bokeh cinematic composition travel adventure",
  },
};

export const THUMBNAIL_W = 1280;
export const THUMBNAIL_H = 720;
export const DISPLAY_SCALE = 0.5;
