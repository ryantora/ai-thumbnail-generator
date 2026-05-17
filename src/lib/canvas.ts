import type { ThumbnailStrategy, ThumbnailPreset } from "../types/index";
import { THUMBNAIL_W, THUMBNAIL_H } from "../constants/presets";

// ── Helpers ────────────────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
 
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
 
// ── Layer draw functions ───────────────────────────────────────────────────────
 
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgImage: HTMLImageElement | null
): void {
  if (bgImage) {
    // Cover-fit the image to fill the full canvas
    const scale = Math.max(THUMBNAIL_W / bgImage.width, THUMBNAIL_H / bgImage.height);
    const w = bgImage.width * scale;
    const h = bgImage.height * scale;
    const x = (THUMBNAIL_W - w) / 2;
    const y = (THUMBNAIL_H - h) / 2;
    ctx.drawImage(bgImage, x, y, w, h);
  } else {
    const grad = ctx.createLinearGradient(0, 0, THUMBNAIL_W, THUMBNAIL_H);
    grad.addColorStop(0, "#0a0a1a");
    grad.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, THUMBNAIL_W, THUMBNAIL_H);
  }
}
 
export function drawOverlay(ctx: CanvasRenderingContext2D): void {
  // Light vignette on top
  const top = ctx.createLinearGradient(0, 0, 0, THUMBNAIL_H * 0.5);
  top.addColorStop(0, "rgba(0,0,0,0.35)");
  top.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, THUMBNAIL_W, THUMBNAIL_H);
 
  // Stronger gradient only at the bottom third where text sits
  const bottom = ctx.createLinearGradient(0, THUMBNAIL_H * 0.55, 0, THUMBNAIL_H);
  bottom.addColorStop(0, "rgba(0,0,0,0)");
  bottom.addColorStop(1, "rgba(0,0,0,0.82)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 0, THUMBNAIL_W, THUMBNAIL_H);
}
 
export function drawTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  preset: ThumbnailPreset,
  composition: ThumbnailStrategy["composition"]
): number {
  const fontSize = 112;
  const lineHeight = fontSize * 1.05;
  const maxWidth =
    composition === "text_left" || composition === "text_right"
      ? THUMBNAIL_W * 0.52
      : THUMBNAIL_W - 120;
  const x =
    composition === "text_right" ? THUMBNAIL_W * 0.46 : 60;
 
  ctx.font = `${preset.fontWeight} ${fontSize}px ${preset.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
 
  const lines = wrapText(ctx, title.toUpperCase(), maxWidth);
  const totalHeight = lines.length * lineHeight;
  const startY = THUMBNAIL_H - 80 - totalHeight;
 
  for (let i = 0; i < lines.length; i++) {
    const y = startY + i * lineHeight;
    // shadow pass
    ctx.shadowColor = preset.shadowColor;
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = preset.titleColor;
    ctx.fillText(lines[i], x, y);
  }
 
  // reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
 
  return startY + lines.length * lineHeight;
}
 
export function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  subtitle: string,
  afterY: number,
  accentColor: string
): void {
  if (!subtitle) return;
  ctx.font = "bold 38px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(subtitle, 60, afterY + 12);
}
 
export function drawAccentBar(
  ctx: CanvasRenderingContext2D,
  accentColor: string
): void {
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, THUMBNAIL_H - 8, THUMBNAIL_W, 8);
}
 
// ── Main compositor ────────────────────────────────────────────────────────────
 
export function composeThumbnail(
  canvas: HTMLCanvasElement,
  bgImage: HTMLImageElement | null,
  strategy: ThumbnailStrategy,
  preset: ThumbnailPreset
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
 
  ctx.clearRect(0, 0, THUMBNAIL_W, THUMBNAIL_H);
  drawBackground(ctx, bgImage);
  drawOverlay(ctx);
  const afterTitleY = drawTitle(ctx, strategy.title, preset, strategy.composition);
  drawSubtitle(ctx, strategy.subtitle, afterTitleY, preset.accentColor);
  drawAccentBar(ctx, preset.accentColor);
}
 
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
 
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvasToDataURL(canvas);
  link.click();
}
 
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // fall back to gradient, don't crash
    img.src = src;
  });
}