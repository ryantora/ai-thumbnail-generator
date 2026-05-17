export type PresetKey = "gaming" | "tech" | "vlog";

export type ThumbnailPreset = {
  label: string;
  icon: string;
  titleColor: string;
  shadowColor: string;
  accentColor: string;
  fontFamily: string;
  fontWeight: string;
  bgStyle: string;
};

export type ThumbnailStrategy = {
  title: string;
  subtitle: string;
  emotion: string;
  composition: "text_bottom" | "text_left" | "text_right" | "text_center";
  colors: string[];
  imagePrompt: string;
};

export type GenerationStage =
  | "idle"
  | "strategy"
  | "image"
  | "compositing"
  | "done"
  | "error";

export type ThumbnailVariant = {
  id: string;
  strategy: ThumbnailStrategy;
  imageUrl: string | null;
  dataUrl: string | null;
};

export type ThumbnailState = {
  videoTitle: string;
  styleNotes: string;
  preset: PresetKey;
  stage: GenerationStage;
  stageMessage: string;
  error: string;
  variants: ThumbnailVariant[];
  activeVariantId: string | null;
  editTitle: string;
  editSubtitle: string;
};