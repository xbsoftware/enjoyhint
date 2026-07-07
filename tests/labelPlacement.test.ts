import { describe, expect, it } from "vitest";
import { computeLabelPlacement } from "../src/overlay/labelPlacement";

const baseShape = {
  type: "rect" as const,
  width: 100,
  height: 80,
};

describe("computeLabelPlacement", () => {
  it("selects right_center when the right side has the largest fitting area", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 200, centerY: 400 },
    });

    expect(placement.side).toBe("right_center");
    expect(placement.label).toEqual({ x: 330, y: 275 });
    expect(placement.arrow).toEqual({
      xFrom: 430,
      yFrom: 355,
      xTo: 270,
      yTo: 400,
      byTopSide: "ver",
    });
  });

  it("selects left_center when the left side has the largest fitting area", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 800, centerY: 400 },
    });

    expect(placement.side).toBe("left_center");
    expect(placement.label).toEqual({ x: 470, y: 275 });
    expect(placement.arrow).toEqual({
      xFrom: 570,
      yFrom: 355,
      xTo: 730,
      yTo: 400,
      byTopSide: "ver",
    });
  });

  it("selects center_top when the area above the shape is best", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 500, centerY: 700 },
    });

    expect(placement.side).toBe("center_top");
    expect(placement.label).toEqual({ x: 400, y: 430 });
    expect(placement.arrow).toEqual({
      xFrom: 500,
      yFrom: 510,
      xTo: 500,
      yTo: 640,
      byTopSide: "hor",
    });
  });

  it("selects center_bottom when the area below the shape is best", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 500, centerY: 100 },
    });

    expect(placement.side).toBe("center_bottom");
    expect(placement.label).toEqual({ x: 400, y: 290 });
    expect(placement.arrow).toEqual({
      xFrom: 500,
      yFrom: 290,
      xTo: 500,
      yTo: 160,
      byTopSide: "hor",
    });
  });

  it("falls back to centered oversized placement when no area can fit the label", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 500, height: 500 },
      label: { width: 600, height: 400 },
      shape: { ...baseShape, centerX: 250, centerY: 250, height: 100 },
    });

    expect(placement.side).toBe("oversized");
    expect(placement.label).toEqual({ x: 20, y: 20 });
    expect(placement.arrow).toEqual({
      xFrom: 620,
      yFrom: 250,
      xTo: 0,
      yTo: 0,
      byTopSide: "hor",
    });
  });

  it("keeps labels inside the viewport when the preferred side would overflow", () => {
    const placement = computeLabelPlacement({
      viewport: { width: 1000, height: 800 },
      label: { width: 200, height: 80 },
      shape: { ...baseShape, centerX: 500, centerY: 760 },
    });

    expect(placement.label.y).toBeLessThanOrEqual(800 - 80 - 20);
    expect(placement.label.y).toBeGreaterThanOrEqual(20);
  });
});
