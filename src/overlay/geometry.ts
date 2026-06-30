import type { SpotlightRect } from "../types";

interface SpotlightOffsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface SpotlightInput {
  left?: number;
  top?: number;
  elementLeft?: number;
  elementTop?: number;
  width: number;
  height: number;
  margin?: number;
  shape?: "rect" | "circle";
  radius?: number;
  right?: number;
  bottom?: number;
  offsets?: SpotlightOffsets;
}

export interface BlockerRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type BlockerStyles = Record<"top" | "left" | "right" | "bottom", Record<string, string>>;

const LEGACY_DEFAULT_MARGIN = 20;

const px = (value: number): string => `${value}px`;

export function computeSpotlightRect(input: SpotlightInput): SpotlightRect {
  const margin = input.margin ?? LEGACY_DEFAULT_MARGIN;
  const origin = getElementOrigin(input);
  const centerX = origin.left + input.width / 2;
  const centerY = origin.top + input.height / 2;
  const offsets = getSpotlightOffsets(input);

  if (input.shape === "circle") {
    return applyMargin(computeCircleSpotlightRect(input, centerX, centerY, offsets), margin);
  }

  return applyMargin(computeRectSpotlightRect(input, centerX, centerY, offsets), margin);
}

export function positionBlockers(rect: BlockerRect): BlockerStyles {
  return {
    top: {
      position: "absolute",
      top: "0px",
      left: "0px",
      height: px(rect.top),
    },
    left: {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: px(rect.left),
    },
    right: {
      position: "absolute",
      top: "0px",
      left: px(rect.right),
    },
    bottom: {
      position: "absolute",
      top: px(rect.bottom),
      left: "0px",
    },
  };
}

function getElementOrigin(input: SpotlightInput): { left: number; top: number } {
  return {
    left: input.elementLeft ?? input.left ?? 0,
    top: input.elementTop ?? input.top ?? 0,
  };
}

function getSpotlightOffsets(input: SpotlightInput): Required<SpotlightOffsets> {
  const canUseTopLeftAsOffsets = input.elementLeft !== undefined || input.elementTop !== undefined;

  return {
    top: (canUseTopLeftAsOffsets ? input.top : undefined) ?? input.offsets?.top ?? 0,
    right: input.right ?? input.offsets?.right ?? 0,
    bottom: input.bottom ?? input.offsets?.bottom ?? 0,
    left: (canUseTopLeftAsOffsets ? input.left : undefined) ?? input.offsets?.left ?? 0,
  };
}

function computeRectSpotlightRect(
  input: SpotlightInput,
  centerX: number,
  centerY: number,
  offsets: Required<SpotlightOffsets>,
): SpotlightRect {
  const halfWidth = Math.round(input.width / 2);
  const halfHeight = Math.round(input.height / 2);
  const sides = {
    top: centerY - halfHeight + offsets.top,
    right: centerX + halfWidth - offsets.right,
    bottom: centerY + halfHeight - offsets.bottom,
    left: centerX - halfWidth + offsets.left,
  };
  const width = sides.right - sides.left;
  const height = sides.bottom - sides.top;
  const nextCenterX = sides.left + Math.round(width / 2);
  const nextCenterY = sides.top + Math.round(height / 2);
  const nextHalfWidth = Math.round(width / 2);
  const nextHalfHeight = Math.round(height / 2);

  return {
    top: nextCenterY - nextHalfHeight,
    right: nextCenterX + nextHalfWidth,
    bottom: nextCenterY + nextHalfHeight,
    left: nextCenterX - nextHalfWidth,
    centerX: nextCenterX,
    centerY: nextCenterY,
  };
}

function computeCircleSpotlightRect(
  input: SpotlightInput,
  centerX: number,
  centerY: number,
  offsets: Required<SpotlightOffsets>,
): SpotlightRect {
  const baseRadius = input.radius ?? Math.min(input.width, input.height) / 2;
  const sides = {
    top: centerY - baseRadius + offsets.top,
    right: centerX + baseRadius - offsets.right,
    bottom: centerY + baseRadius - offsets.bottom,
    left: centerX - baseRadius + offsets.left,
  };
  const width = sides.right - sides.left;
  const height = sides.bottom - sides.top;
  const radius = Math.round(Math.min(width, height) / 2);
  const nextCenterX = sides.left + Math.round(width / 2);
  const nextCenterY = sides.top + Math.round(height / 2);

  return {
    top: nextCenterY - radius,
    right: nextCenterX + radius,
    bottom: nextCenterY + radius,
    left: nextCenterX - radius,
    centerX: nextCenterX,
    centerY: nextCenterY,
  };
}

function applyMargin(rect: SpotlightRect, margin: number): SpotlightRect {
  return {
    top: rect.top - margin,
    right: rect.right + margin,
    bottom: rect.bottom + margin,
    left: rect.left - margin,
    centerX: rect.centerX,
    centerY: rect.centerY,
  };
}
