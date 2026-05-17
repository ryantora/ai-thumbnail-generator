import { create } from "zustand";
import { type ThumbnailState,type ThumbnailVariant, type GenerationStage, type PresetKey } from "../types/index";

type Actions = {
  setVideoTitle: (v: string) => void;
  setStyleNotes: (v: string) => void;
  setPreset: (p: PresetKey) => void;
  setStage: (s: GenerationStage, msg?: string) => void;
  setError: (e: string) => void;
  addVariant: (v: ThumbnailVariant) => void;
  updateVariantDataUrl: (id: string, dataUrl: string) => void;
  setActiveVariant: (id: string) => void;
  setEditTitle: (t: string) => void;
  setEditSubtitle: (s: string) => void;
  reset: () => void;
};

const initialState: ThumbnailState = {
  videoTitle: "",
  styleNotes: "",
  preset: 'gaming',
  stage: "idle",
  stageMessage: "",
  error: "",
  variants: [],
  activeVariantId: null,
  editTitle: "",
  editSubtitle: "",
};

export const useThumbnailStore = create<ThumbnailState & Actions>((set) => ({
  ...initialState,

  setVideoTitle: (videoTitle) => set({ videoTitle }),
  setStyleNotes: (styleNotes) => set({ styleNotes }),
  setPreset: (preset) => set({ preset }),

  setStage: (stage, stageMessage = "") => set({ stage, stageMessage }),
  setError: (error) => set({ error, stage: "error" }),

  addVariant: (v) =>
    set((s) => ({
      variants: [...s.variants, v],
      activeVariantId: s.activeVariantId ?? v.id,
    })),

  updateVariantDataUrl: (id, dataUrl) =>
    set((s) => ({
      variants: s.variants.map((v) => (v.id === id ? { ...v, dataUrl } : v)),
    })),

  setActiveVariant: (activeVariantId) =>
    set((s) => {
      const v = s.variants.find((x) => x.id === activeVariantId);
      return {
        activeVariantId,
        editTitle: v?.strategy.title ?? "",
        editSubtitle: v?.strategy.subtitle ?? "",
      };
    }),

  setEditTitle: (editTitle) => set({ editTitle }),
  setEditSubtitle: (editSubtitle) => set({ editSubtitle }),

  reset: () => set(initialState),
}));
