import type { SpotlightRect, TextDirection } from "../types";

export interface OverlapRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Below this intersection area, a label/spotlight overlap is treated as a
 * harmless edge-touch (e.g. 1px of clamped rounding) rather than a real
 * visual obstruction, so the toggle button doesn't flicker in and out.
 */
export const LABEL_OVERLAP_AREA_THRESHOLD_PX2 = 200;

/** Button-center offset: 12px edge gap plus the toggle's approximate outer radius. */
const DEFAULT_TOGGLE_BUTTON_OFFSET_PX = 30;

/** Extra clearance added past the label's own width when sliding it off-screen. */
export const LABEL_HIDE_MARGIN_PX = 24;

/** Outer diameter (px) of the round toggle button, including its 2px border. */
export const LABEL_TOGGLE_BUTTON_SIZE_PX = 36;

/** Minimum gap (px) kept between the button and the viewport edge. */
const VIEWPORT_CLAMP_MARGIN_PX = 8;

export function computeOverlapArea(a: OverlapRect, b: OverlapRect): number {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

export function doesLabelOverlapSpotlight(
  labelRect: OverlapRect,
  spotlightRect: OverlapRect,
  thresholdPx2 = LABEL_OVERLAP_AREA_THRESHOLD_PX2,
): boolean {
  return computeOverlapArea(labelRect, spotlightRect) > thresholdPx2;
}

type EdgeDirection = "right" | "left" | "bottom" | "top";
type CornerName = "bottom-right" | "bottom-left" | "top-left" | "top-right";

function rectFromCenter(x: number, y: number, size: number): OverlapRect {
  const half = size / 2;
  return { top: y - half, right: x + half, bottom: y + half, left: x - half };
}

function clampRectToViewport(
  rect: OverlapRect,
  viewport: { width: number; height: number },
  margin: number,
): OverlapRect {
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  const maxLeft = Math.max(margin, viewport.width - margin - width);
  const maxTop = Math.max(margin, viewport.height - margin - height);
  const left = Math.min(Math.max(margin, rect.left), maxLeft);
  const top = Math.min(Math.max(margin, rect.top), maxTop);
  return { top, right: left + width, bottom: top + height, left };
}

function centerOf(rect: OverlapRect): { x: number; y: number } {
  return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
}

export interface ToggleButtonPositionInput {
  /** The current label's own bounding box - always avoided. */
  labelRect: OverlapRect;
  spotlight: SpotlightRect;
  /** Other on-screen elements to steer clear of, e.g. the next/prev/skip button row. */
  avoidRects?: OverlapRect[];
  buttonSize?: number;
  viewport: { width: number; height: number };
  offsetPx?: number;
  dir?: TextDirection;
}

/**
 * Finds a spot for the toggle button that clears the spotlight, the label,
 * and any other rects supplied (e.g. the button row) simultaneously.
 *
 * Strategy, in priority order:
 * 1. Just outside the spotlight edge opposite the label
 * 2. The other three spotlight edges
 * 3. Just outside the label's own edges (needed when an oversized
 *    dark-background label covers the spotlight entirely — spotlight-edge
 *    anchors then sit *inside* the label)
 * 4. Viewport corners (close corner skipped — top-right in LTR, top-left in RTL)
 *
 * Among candidates, whichever has the least (ideally zero) overlap wins.
 */
export function computeToggleButtonPosition(input: ToggleButtonPositionInput): { x: number; y: number } {
  const offsetPx = input.offsetPx ?? DEFAULT_TOGGLE_BUTTON_OFFSET_PX;
  const buttonSize = input.buttonSize ?? LABEL_TOGGLE_BUTTON_SIZE_PX;
  const half = buttonSize / 2;
  const avoidRects: OverlapRect[] = [input.labelRect, input.spotlight, ...(input.avoidRects ?? [])];

  const labelCenterX = (input.labelRect.left + input.labelRect.right) / 2;
  const labelCenterY = (input.labelRect.top + input.labelRect.bottom) / 2;
  const dx = input.spotlight.centerX - labelCenterX;
  const dy = input.spotlight.centerY - labelCenterY;

  const spotlightEdgeAnchor = (direction: EdgeDirection): { x: number; y: number } => {
    switch (direction) {
      case "right":
        return { x: input.spotlight.right + offsetPx, y: input.spotlight.centerY };
      case "left":
        return { x: input.spotlight.left - offsetPx, y: input.spotlight.centerY };
      case "bottom":
        return { x: input.spotlight.centerX, y: input.spotlight.bottom + offsetPx };
      case "top":
        return { x: input.spotlight.centerX, y: input.spotlight.top - offsetPx };
    }
  };

  // For oversized labels the dark box itself is what we must clear — place
  // the button just outside the label, not the (covered) spotlight.
  const labelEdgeAnchor = (direction: EdgeDirection): { x: number; y: number } => {
    switch (direction) {
      case "right":
        return { x: input.labelRect.right + offsetPx, y: labelCenterY };
      case "left":
        return { x: input.labelRect.left - offsetPx, y: labelCenterY };
      case "bottom":
        return { x: labelCenterX, y: input.labelRect.bottom + offsetPx };
      case "top":
        return { x: labelCenterX, y: input.labelRect.top - offsetPx };
    }
  };

  const preferredDirection: EdgeDirection =
    Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? "right" : "left") : dy >= 0 ? "bottom" : "top";
  const remainingDirections = (["right", "left", "bottom", "top"] as EdgeDirection[]).filter(
    (direction) => direction !== preferredDirection,
  );

  const dir: TextDirection = input.dir ?? "ltr";

  // The close-button corner is deliberately excluded — top-right in LTR,
  // top-left in RTL.
  const cornerAnchor = (corner: CornerName): { x: number; y: number } => {
    switch (corner) {
      case "bottom-right":
        return {
          x: input.viewport.width - VIEWPORT_CLAMP_MARGIN_PX - half,
          y: input.viewport.height - VIEWPORT_CLAMP_MARGIN_PX - half,
        };
      case "bottom-left":
        return {
          x: VIEWPORT_CLAMP_MARGIN_PX + half,
          y: input.viewport.height - VIEWPORT_CLAMP_MARGIN_PX - half,
        };
      case "top-left":
        return { x: VIEWPORT_CLAMP_MARGIN_PX + half, y: VIEWPORT_CLAMP_MARGIN_PX + half };
      case "top-right":
        return {
          x: input.viewport.width - VIEWPORT_CLAMP_MARGIN_PX - half,
          y: VIEWPORT_CLAMP_MARGIN_PX + half,
        };
    }
  };

  const cornerCandidates: CornerName[] =
    dir === "rtl"
      ? ["bottom-right", "bottom-left", "top-right"]
      : ["bottom-right", "bottom-left", "top-left"];

  const candidates: Array<{ x: number; y: number }> = [
    spotlightEdgeAnchor(preferredDirection),
    ...remainingDirections.map(spotlightEdgeAnchor),
    labelEdgeAnchor(preferredDirection),
    ...remainingDirections.map(labelEdgeAnchor),
    ...cornerCandidates.map(cornerAnchor),
  ];

  const evaluate = (anchor: { x: number; y: number }) => {
    const rect = clampRectToViewport(
      rectFromCenter(anchor.x, anchor.y, buttonSize),
      input.viewport,
      VIEWPORT_CLAMP_MARGIN_PX,
    );
    const score = avoidRects.reduce((sum, avoidRect) => sum + computeOverlapArea(rect, avoidRect), 0);
    return { position: centerOf(rect), score };
  };

  let best = evaluate(candidates[0]);
  for (const candidate of candidates.slice(1)) {
    if (best.score === 0) {
      break;
    }

    const result = evaluate(candidate);
    if (result.score < best.score) {
      best = result;
    }
  }

  return best.position;
}

/**
 * Distance (px) to translate a label off-screen so it clears the viewport
 * edge, given its current left position and width.
 */
export function computeLabelHideOffsetPx(
  label: { left: number; width: number },
  options: {
    marginPx?: number;
    dir?: TextDirection;
    viewportWidth?: number;
  } = {},
): number {
  const marginPx = options.marginPx ?? LABEL_HIDE_MARGIN_PX;
  const dir = options.dir ?? "ltr";
  if (dir === "rtl") {
    const viewportWidth = options.viewportWidth ?? 0;
    return viewportWidth - label.left + marginPx;
  }
  return label.left + label.width + marginPx;
}
