import { describe, expect, it } from "vitest";
import { LabelPlacementService } from "../src/overlay/LabelPlacementService";

const baseShape = {
  type: "rect" as const,
  width: 100,
  height: 80,
};

describe("LabelPlacementService.computeLabelPlacement", () => {
  it("selects right_center when the right side has the largest fitting area", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 200, centerY: 400 },
    });

    expect(placement.side).toBe("right_center");
    expect(placement.label).toEqual({ x: 330, y: 275, width: 200, height: 80 });
    expect(placement.arrow).toEqual({
      xFrom: 430,
      yFrom: 355,
      xTo: 270,
      yTo: 400,
      byTopSide: "ver",
    });
  });

  it("selects left_center when the left side has the largest fitting area", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 800, centerY: 400 },
    });

    expect(placement.side).toBe("left_center");
    expect(placement.label).toEqual({ x: 470, y: 275, width: 200, height: 80 });
    expect(placement.arrow).toEqual({
      xFrom: 570,
      yFrom: 355,
      xTo: 730,
      yTo: 400,
      byTopSide: "ver",
    });
  });

  it("selects center_top when the area above the shape is best", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 500, centerY: 700 },
    });

    expect(placement.side).toBe("center_top");
    expect(placement.label).toEqual({ x: 400, y: 430, width: 200, height: 80 });
    expect(placement.arrow).toEqual({
      xFrom: 500,
      yFrom: 510,
      xTo: 500,
      yTo: 640,
      byTopSide: "hor",
    });
  });

  it("selects center_bottom when the area below the shape is best", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 500, centerY: 100 },
    });

    expect(placement.side).toBe("center_bottom");
    expect(placement.label).toEqual({ x: 400, y: 290, width: 200, height: 80 });
    expect(placement.arrow).toEqual({
      xFrom: 500,
      yFrom: 290,
      xTo: 500,
      yTo: 160,
      byTopSide: "hor",
    });
  });

  it("falls back to centered oversized placement when no area can fit the label", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 500, height: 500 },
      label: { width: 600, height: 400 },
      shape: { ...baseShape, centerX: 250, centerY: 250, height: 100 },
    });

    expect(placement.side).toBe("oversized");
    expect(placement.label).toEqual({ x: 0, y: 10, width: 600, height: 400 });
    // xTo/yTo are left at their unset (0, 0) default here: this side has no
    // real target-facing anchor, and the arrow is hidden entirely for the
    // "oversized" side by the renderer, so these values are never drawn.
    expect(placement.arrow).toEqual({
      xFrom: 490,
      yFrom: 250,
      xTo: 0,
      yTo: 0,
      byTopSide: "hor",
    });
  });

  it("keeps labels inside the viewport when left placement would overflow", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 375, height: 649 },
      label: { width: 240, height: 20 },
      shape: { ...baseShape, centerX: 368.45, centerY: 144, width: 120, height: 48 },
    });

    expect(placement.label.x).toBeGreaterThanOrEqual(10);
    expect(placement.label.y).toBeGreaterThanOrEqual(10);
    expect(placement.label.x + 240).toBeLessThanOrEqual(375);
    expect(placement.label.y + 20).toBeLessThanOrEqual(649);
  });

  it("keeps the label-side arrow endpoint within the viewport margin", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 375, height: 649 },
      label: { width: 240, height: 20 },
      shape: { ...baseShape, centerX: 368.45, centerY: 144, width: 120, height: 48 },
    });

    expect(placement.arrow.xFrom).toBeGreaterThanOrEqual(10);
    expect(placement.arrow.xFrom).toBeLessThanOrEqual(365);
    expect(placement.arrow.yFrom).toBeGreaterThanOrEqual(10);
    expect(placement.arrow.yFrom).toBeLessThanOrEqual(639);
  });

  it("points the arrow at the exact target edge instead of clamping it into the viewport margin", () => {
    // The target sits close enough to the right edge that a naive margin clamp
    // would pull the arrowhead away from the real target position. The label
    // is wide enough that neither side has room for it (matching legacy's
    // plain width check), so center_bottom is selected and xTo lands exactly
    // on the target's center.
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 375, height: 649 },
      label: { width: 320, height: 20 },
      shape: { ...baseShape, centerX: 368.45, centerY: 144, width: 120, height: 48 },
    });

    expect(placement.side).toBe("center_bottom");
    expect(placement.arrow.xTo).toBeCloseTo(368.45, 2);
  });

  it("selects a side using the plain (legacy) width check, then clamps it fully on-screen", () => {
    // Legacy's side-selection area check compares against the label's plain
    // width only (no extra positioning gap); the fixed +/-80px gap only
    // shows up afterwards, in the leftPosition/rightPosition formulas. A
    // side can therefore be legitimately selected even though its raw
    // position formula would overflow - the existing viewport clamp (further
    // below) is what keeps it fully visible, matching legacy's area check
    // while still avoiding an off-screen label.
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 260, height: 800 },
      label: { width: 100, height: 40 },
      shape: { type: "rect", width: 100, height: 750, centerX: 200, centerY: 400 },
    });

    expect(placement.side).toBe("left_center");
    expect(placement.label.x).toBeGreaterThanOrEqual(10);
    expect(placement.label.x + 100).toBeLessThanOrEqual(260);
  });

  it("does not fall back to the oversized/no-arrow placement just because a revisit narrowed the available space differently", () => {
    // Real repro: revisiting the same step after navigating forward and back
    // (example1's "click .btn-success" step at 600x470) leaves the target at
    // a different scroll-clamped position than the first visit. Legacy picks
    // a side placement (with arrow) here; rejecting every side and falling
    // back to the oversized/no-arrow placement - which the plain-width check
    // (matching legacy) avoids - would make the same step look inconsistent
    // across visits.
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 600, height: 470 },
      label: { width: 311.703125, height: 114.21875 },
      shape: { type: "rect", centerX: 225.953125, centerY: 219.484375, width: 94, height: 48 },
    });

    expect(placement.side).not.toBe("oversized");
    expect(placement.arrow.xTo).not.toBe(0);
    expect(placement.label.x).toBeGreaterThanOrEqual(0);
    expect(placement.label.x + placement.label.width).toBeLessThanOrEqual(600);
  });

  it("caps a side label's width instead of clamping it into the arrow's target-facing endpoint", () => {
    // Same repro as above: the label's natural width (311.7) doesn't fit in
    // the ~237px actually available to the right of the target on a 600px
    // viewport. Clamping the label's X position back on-screen (the old
    // behavior) pushes the label so far left that it overlaps xTo, making
    // the rendered arrow a near-zero-length stub sitting inside the label.
    // The label's width should be capped to the available space instead, so
    // the label stays at its natural (unclamped) position with a real gap
    // to the arrow's target-facing endpoint.
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 600, height: 470 },
      label: { width: 311.703125, height: 114.21875 },
      shape: { type: "rect", centerX: 225.953125, centerY: 219.484375, width: 94, height: 48 },
    });

    expect(placement.side).toBe("right_center");
    expect(placement.label.width).toBeLessThan(311.703125);
    expect(placement.label.x + placement.label.width).toBeLessThanOrEqual(600);
    // The arrow's target-facing endpoint must stay clear of the label box -
    // otherwise the arrow renders as a broken sliver overlapping the label.
    expect(placement.arrow.xTo).toBeLessThan(placement.label.x);
  });

  it("uses legacy circle half-dimensions for vertical label offsets", () => {
    const placement = LabelPlacementService.computeLabelPlacement({
      viewport: { width: 375, height: 649 },
      label: { width: 105, height: 18 },
      shape: { type: "circle", centerX: 220, centerY: 144, width: 120, height: 120, radius: 60 },
    });

    expect(placement.label.y).toBe(304);
    expect(placement.arrow.yFrom).toBe(304);
  });
});
