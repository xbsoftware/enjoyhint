import type { NormalizedStep, SpotlightRect } from "../types";

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

export class GeometryService {
  public static computeSpotlightRect(input: SpotlightInput): SpotlightRect {
    const margin = input.margin ?? GeometryService.LEGACY_DEFAULT_MARGIN;
    const origin = GeometryService.getElementOrigin(input);
    const centerX = origin.left + input.width / 2;
    const centerY = origin.top + input.height / 2;
    const offsets = GeometryService.getSpotlightOffsets(input);

    if (input.shape === "circle") {
      return GeometryService.applyMargin(
        GeometryService.computeCircleSpotlightRect(input, centerX, centerY, offsets),
        margin,
      );
    }

    return GeometryService.applyMargin(
      GeometryService.computeRectSpotlightRect(input, centerX, centerY, offsets),
      margin,
    );
  }

  /**
   * Runtime spotlight geometry from a normalized step and target rect.
   * Preserves StepController / legacy enjoyhint.js formulas (default rect margin 10).
   */
  public static computeStepSpotlight(step: NormalizedStep, targetRect: DOMRect): SpotlightRect {
    const centerX = targetRect.left + Math.round(targetRect.width / 2);
    const centerY = targetRect.top + Math.round(targetRect.height / 2);

    if (step.shape === "circle") {
      let circleCenterX = targetRect.left + Math.round(targetRect.width / 2);
      let circleCenterY = targetRect.top + Math.round(targetRect.height / 2);
      let radius = step.radius ?? Math.round(Math.max(targetRect.width, targetRect.height) / 2) + 5;
      const offsets = {
        top: step.top ?? 0,
        bottom: step.bottom ?? 0,
        left: step.left ?? 0,
        right: step.right ?? 0,
      };
      const half = radius;
      const sides = {
        top: circleCenterY - half + offsets.top,
        bottom: circleCenterY + half - offsets.bottom,
        left: circleCenterX - half + offsets.left,
        right: circleCenterX + half - offsets.right,
      };
      const width = sides.right - sides.left;
      const height = sides.bottom - sides.top;
      radius = Math.round(Math.min(width, height) / 2);
      circleCenterX = sides.left + Math.round(width / 2);
      circleCenterY = sides.top + Math.round(height / 2);

      return {
        top: circleCenterY - radius,
        right: circleCenterX + radius,
        bottom: circleCenterY + radius,
        left: circleCenterX - radius,
        centerX: circleCenterX,
        centerY: circleCenterY,
      };
    }

    const shapeMargin = step.margin !== undefined ? step.margin : 10;
    const width = targetRect.width + shapeMargin;
    const height = targetRect.height + shapeMargin;
    const halfWidth = Math.round(width / 2);
    const halfHeight = Math.round(height / 2);
    const sides = {
      top: centerY - halfHeight + (step.top ?? 0),
      right: centerX + halfWidth - (step.right ?? 0),
      bottom: centerY + halfHeight - (step.bottom ?? 0),
      left: centerX - halfWidth + (step.left ?? 0),
    };
    const nextWidth = sides.right - sides.left;
    const nextHeight = sides.bottom - sides.top;
    const nextCenterX = sides.left + Math.round(nextWidth / 2);
    const nextCenterY = sides.top + Math.round(nextHeight / 2);
    const nextHalfWidth = Math.round(nextWidth / 2);
    const nextHalfHeight = Math.round(nextHeight / 2);

    return {
      top: nextCenterY - nextHalfHeight,
      right: nextCenterX + nextHalfWidth,
      bottom: nextCenterY + nextHalfHeight,
      left: nextCenterX - nextHalfWidth,
      centerX: nextCenterX,
      centerY: nextCenterY,
    };
  }

  public static positionBlockers(rect: BlockerRect): BlockerStyles {
    return {
      top: {
        position: "absolute",
        top: "0px",
        left: "0px",
        height: GeometryService.px(rect.top),
      },
      left: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: GeometryService.px(rect.left),
      },
      right: {
        position: "absolute",
        top: "0px",
        left: GeometryService.px(rect.right),
      },
      bottom: {
        position: "absolute",
        top: GeometryService.px(rect.bottom),
        left: "0px",
      },
    };
  }

  private static readonly LEGACY_DEFAULT_MARGIN = 20;

  private static px(value: number): string {
    return `${value}px`;
  }

  private static getElementOrigin(input: SpotlightInput): { left: number; top: number } {
    return {
      left: input.elementLeft ?? input.left ?? 0,
      top: input.elementTop ?? input.top ?? 0,
    };
  }

  private static getSpotlightOffsets(input: SpotlightInput): Required<SpotlightOffsets> {
    const canUseTopLeftAsOffsets = input.elementLeft !== undefined || input.elementTop !== undefined;

    return {
      top: (canUseTopLeftAsOffsets ? input.top : undefined) ?? input.offsets?.top ?? 0,
      right: input.right ?? input.offsets?.right ?? 0,
      bottom: input.bottom ?? input.offsets?.bottom ?? 0,
      left: (canUseTopLeftAsOffsets ? input.left : undefined) ?? input.offsets?.left ?? 0,
    };
  }

  private static computeRectSpotlightRect(
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

  private static computeCircleSpotlightRect(
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

  private static applyMargin(rect: SpotlightRect, margin: number): SpotlightRect {
    return {
      top: rect.top - margin,
      right: rect.right + margin,
      bottom: rect.bottom + margin,
      left: rect.left - margin,
      centerX: rect.centerX,
      centerY: rect.centerY,
    };
  }
}
