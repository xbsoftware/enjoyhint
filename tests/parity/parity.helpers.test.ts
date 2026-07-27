import { describe, expect, it } from "vitest";
import {
  expectPlacementParity,
  isRectInsideViewport,
  rectsClose,
  type ElementSnapshot,
  type PlacementSnapshot,
} from "./parity.helpers";

describe("isRectInsideViewport", () => {
  const viewport = { width: 375, height: 649 };

  it("detects rects that extend past the left edge", () => {
    expect(isRectInsideViewport({ x: -12, y: 270, width: 186, height: 20 }, viewport)).toBe(
      false,
    );
  });

  it("accepts rects that fit fully inside the viewport", () => {
    expect(isRectInsideViewport({ x: 10, y: 270, width: 186, height: 20 }, viewport)).toBe(true);
  });
});

describe("rectsClose", () => {
  it("compares placement rects within tolerance", () => {
    expect(
      rectsClose({ x: 10, y: 270, width: 186, height: 20 }, { x: 11, y: 271, width: 186, height: 20 }),
    ).toBe(true);
  });
});

describe("expectPlacementParity", () => {
  const viewport = { width: 1280, height: 800 };

  function makeButtonSnapshot(className: string, rect: ElementSnapshot["rect"]): ElementSnapshot {
    return {
      text: "Next",
      className,
      rect,
      computed: {
        display: "block",
        visibility: "visible",
        opacity: "1",
        pointerEvents: "all",
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        right: "auto",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
    };
  }

  function makeSnapshot(nextRect: ElementSnapshot["rect"], skipRect: ElementSnapshot["rect"]): PlacementSnapshot {
    const label: ElementSnapshot = {
      text: "Low target placement",
      className: "enjoy_hint_label",
      rect: { x: 365, y: 302, width: 164, height: 27 },
      computed: {
        display: "block",
        visibility: "visible",
        opacity: "1",
        pointerEvents: "none",
        left: "365px",
        top: "302px",
        right: "529px",
        width: "164px",
        height: "27px",
      },
    };
    return {
      currentStep: 0,
      label,
      arrow: {
        d: "M470,328 Q470,544 305,544",
        style: null,
        rect: { x: 305, y: 328, width: 165, height: 216 },
      },
      buttons: {
        next: makeButtonSnapshot("enjoyhint_next_btn", nextRect),
        prev: null,
        skip: makeButtonSnapshot("enjoyhint_skip_btn", skipRect),
        close: null,
      },
    };
  }

  it("does not require button position parity when the legacy button overlaps the legacy arrow", () => {
    // Legacy has a real bug: the button row can land on top of the arrow
    // connecting the label to the target. The new implementation
    // intentionally repositions the row away from the arrow, so this
    // divergence must not fail parity.
    const legacy = makeSnapshot(
      { x: 470, y: 368, width: 104, height: 44 },
      { x: 580, y: 368, width: 104, height: 44 },
    );
    const newer = makeSnapshot(
      { x: 470, y: 252, width: 104, height: 44 },
      { x: 580, y: 252, width: 104, height: 44 },
    );

    expect(() => expectPlacementParity(legacy, newer, viewport)).not.toThrow();
  });

  it("exempts the whole button row from position parity even for buttons that don't individually touch the arrow", () => {
    // "skip" sits at x=580, entirely clear of the arrow's bounding box
    // (x 305-470) on its own, but it moves together with "next" as one
    // row, so it must be exempted too once any button in the row collides.
    const legacy = makeSnapshot(
      { x: 470, y: 368, width: 104, height: 44 },
      { x: 580, y: 368, width: 104, height: 44 },
    );
    const newer = makeSnapshot(
      { x: 470, y: 252, width: 104, height: 44 },
      { x: 580, y: 252, width: 104, height: 44 },
    );

    expect(() => expectPlacementParity(legacy, newer, viewport)).not.toThrow();
  });

  it("still requires button position parity when the legacy row does not overlap the arrow", () => {
    const legacy = makeSnapshot(
      { x: 470, y: 252, width: 104, height: 44 },
      { x: 580, y: 252, width: 104, height: 44 },
    );
    const newer = makeSnapshot(
      { x: 470, y: 260, width: 104, height: 44 },
      { x: 580, y: 260, width: 104, height: 44 },
    );

    expect(() => expectPlacementParity(legacy, newer, viewport)).toThrow();
  });
});
