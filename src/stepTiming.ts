export const LEGACY_DEFAULT_SCROLL_SPEED_MS = 250;
export const LEGACY_RENDER_DELAY_OFFSET_MS = 20;
export const LEGACY_ANIMATION_TIME_MS = 800;
export const LEGACY_LABEL_ARROW_DELAY_MS = LEGACY_ANIMATION_TIME_MS / 2;
/** Legacy hardcodes 450ms for oversized label cleanup (after arrow draw at 400ms). */
export const LEGACY_OVERSIZED_LABEL_DELAY_MS = 450;

export function getLegacyStepRenderDelay(scrollSpeed = LEGACY_DEFAULT_SCROLL_SPEED_MS): number {
  return scrollSpeed + LEGACY_RENDER_DELAY_OFFSET_MS;
}
