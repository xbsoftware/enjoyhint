export const LEGACY_DEFAULT_SCROLL_SPEED_MS = 250;
export const LEGACY_RENDER_DELAY_OFFSET_MS = 20;
export const LEGACY_ANIMATION_TIME_MS = 800;
export const LEGACY_LABEL_ARROW_DELAY_MS = LEGACY_ANIMATION_TIME_MS / 2;

export function getLegacyStepRenderDelay(scrollSpeed = LEGACY_DEFAULT_SCROLL_SPEED_MS): number {
  return scrollSpeed + LEGACY_RENDER_DELAY_OFFSET_MS;
}
