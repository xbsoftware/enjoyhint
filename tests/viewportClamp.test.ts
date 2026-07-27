import { describe, expect, it } from "vitest";
import { ViewportClampService } from "../src/overlay/ViewportClampService";

describe("ViewportClampService.clampRectToViewport", () => {
  const viewport = { width: 375, height: 649 };

  it("keeps a fully fitting rect inside the viewport margins", () => {
    expect(ViewportClampService.clampRectToViewport(42, 270, 186, 20, viewport)).toEqual({
      x: 42,
      y: 270,
    });
  });

  it("clamps a rect that would overflow the left edge", () => {
    expect(ViewportClampService.clampRectToViewport(-12, 270, 240, 20, viewport)).toEqual({
      x: 10,
      y: 270,
    });
  });

  it("clamps a rect that would overflow the bottom edge", () => {
    expect(ViewportClampService.clampRectToViewport(100, 640, 200, 20, viewport)).toEqual({
      x: 100,
      y: 619,
    });
  });
});

describe("ViewportClampService.clampPointToViewport", () => {
  it("keeps arrow endpoints inside the viewport", () => {
    expect(ViewportClampService.clampPointToViewport(-5, 700, { width: 375, height: 649 })).toEqual({
      x: 10,
      y: 639,
    });
  });
});
