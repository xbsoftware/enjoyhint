import { describe, expect, it } from "vitest";
import {
  LabelOverlapToggleService,
  LABEL_HIDE_MARGIN_PX,
  LABEL_OVERLAP_AREA_THRESHOLD_PX2,
  LABEL_TOGGLE_BUTTON_SIZE_PX,
} from "../src/overlay/LabelOverlapToggleService";

describe("labelOverlapToggle", () => {
  describe("computeOverlapArea", () => {
    it("returns 0 for rects that do not touch", () => {
      const a = { top: 0, right: 10, bottom: 10, left: 0 };
      const b = { top: 20, right: 30, bottom: 30, left: 20 };

      expect(LabelOverlapToggleService.computeOverlapArea(a, b)).toBe(0);
    });

    it("returns the intersection area for partially overlapping rects", () => {
      const a = { top: 0, right: 10, bottom: 10, left: 0 };
      const b = { top: 5, right: 15, bottom: 15, left: 5 };

      expect(LabelOverlapToggleService.computeOverlapArea(a, b)).toBe(25);
    });

    it("returns the full area when one rect contains the other", () => {
      const outer = { top: 0, right: 100, bottom: 100, left: 0 };
      const inner = { top: 10, right: 20, bottom: 20, left: 10 };

      expect(LabelOverlapToggleService.computeOverlapArea(outer, inner)).toBe(100);
    });
  });

  describe("doesLabelOverlapSpotlight", () => {
    it("returns false when there is no overlap", () => {
      const label = { top: 0, right: 10, bottom: 10, left: 0 };
      const spotlight = { top: 20, right: 30, bottom: 30, left: 20, centerX: 25, centerY: 25 };

      expect(LabelOverlapToggleService.doesLabelOverlapSpotlight(label, spotlight)).toBe(false);
    });

    it("returns false for an edge-touch overlap below the threshold", () => {
      const label = { top: 0, right: 10, bottom: 10, left: 0 };
      // Overlaps spotlight by a 1x1px sliver (area 1), far below the threshold.
      const spotlight = { top: 9, right: 20, bottom: 20, left: 9, centerX: 14, centerY: 14 };

      expect(LabelOverlapToggleService.doesLabelOverlapSpotlight(label, spotlight)).toBe(false);
    });

    it("returns true when overlap area exceeds the threshold", () => {
      const label = { top: 0, right: 100, bottom: 100, left: 0 };
      const spotlight = { top: 50, right: 150, bottom: 150, left: 50, centerX: 100, centerY: 100 };

      expect(LabelOverlapToggleService.computeOverlapArea(label, spotlight)).toBeGreaterThan(LABEL_OVERLAP_AREA_THRESHOLD_PX2);
      expect(LabelOverlapToggleService.doesLabelOverlapSpotlight(label, spotlight)).toBe(true);
    });
  });

  describe("computeToggleButtonPosition", () => {
    const spotlight = { top: 100, right: 200, bottom: 200, left: 100, centerX: 150, centerY: 150 };
    const viewport = { width: 800, height: 600 };
    // Far away from the spotlight in every scenario below, so it never
    // participates in collisions unless a test deliberately widens it.
    const tinyLabel = { top: 0, right: 10, bottom: 10, left: 0 };

    it("anchors on the spotlight's right edge when the label is to the left", () => {
      const labelRect = { top: 100, right: 50, bottom: 200, left: 0 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      expect(position).toEqual({ x: 230, y: 150 });
    });

    it("anchors on the spotlight's left edge when the label is to the right", () => {
      const labelRect = { top: 100, right: 500, bottom: 200, left: 450 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      expect(position).toEqual({ x: 70, y: 150 });
    });

    it("anchors on the spotlight's bottom edge when the label is above", () => {
      const labelRect = { top: 0, right: 200, bottom: 50, left: 100 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      expect(position).toEqual({ x: 150, y: 230 });
    });

    it("anchors on the spotlight's top edge when the label is below", () => {
      const labelRect = { top: 350, right: 200, bottom: 400, left: 100 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      expect(position).toEqual({ x: 150, y: 70 });
    });

    it("supports a custom offset", () => {
      const labelRect = { top: 100, right: 50, bottom: 200, left: 0 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport, offsetPx: 20 });

      expect(position).toEqual({ x: 220, y: 150 });
    });

    it("falls back to another spotlight edge when the preferred edge is covered by a wide label", () => {
      // Wide enough to sit under both the right AND left candidate points,
      // but stops well above the spotlight's bottom edge.
      const labelRect = { top: 100, right: 260, bottom: 200, left: 0 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      expect(position).toEqual({ x: 150, y: 230 });
    });

    it("falls back to just outside the label when the label covers all four spotlight edges", () => {
      const labelRect = { top: 0, right: 260, bottom: 260, left: 0 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport });

      // Prefer the label's right edge (spotlight-right is covered by the label).
      expect(position).toEqual({ x: 290, y: 130 });
      const half = LABEL_TOGGLE_BUTTON_SIZE_PX / 2;
      const buttonRect = {
        top: position.y - half,
        right: position.x + half,
        bottom: position.y + half,
        left: position.x - half,
      };
      expect(LabelOverlapToggleService.computeOverlapArea(buttonRect, labelRect)).toBe(0);
    });

    it("never lands in the top-right corner in ltr, which is reserved for the close button", () => {
      // Blocks all four spotlight edges but stops short of the extreme
      // top-left corner, and a bottom band blocks both bottom corners.
      // Label-edge candidates on the right remain clear. The top-right
      // corner is never a candidate at all.
      const labelRect = { top: 40, right: 260, bottom: 260, left: 40 };
      const avoidRects = [{ top: 560, right: 800, bottom: 600, left: 0 }];

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport, avoidRects, dir: "ltr" });

      expect(position.x).toBeLessThan(viewport.width - 40);
      // Confirm we did not pick the reserved top-right corner.
      expect(!(position.x > viewport.width / 2 && position.y < viewport.height / 2)).toBe(true);
    });

    it("never lands in the top-left corner in rtl, which is reserved for the close button", () => {
      const labelRect = { top: 40, right: 260, bottom: 260, left: 40 };
      const avoidRects = [{ top: 560, right: 800, bottom: 600, left: 0 }];

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect, spotlight, viewport, avoidRects, dir: "rtl" });

      expect(position.x).toBeGreaterThan(40);
    });

    it("avoids extra rects such as the next/prev/skip button row", () => {
      const avoidRects = [{ top: 130, right: 260, bottom: 170, left: 200 }];

      const position = LabelOverlapToggleService.computeToggleButtonPosition({ labelRect: tinyLabel, spotlight, viewport, avoidRects });

      expect(position).toEqual({ x: 70, y: 150 });
    });

    it("supports a custom button size", () => {
      const position = LabelOverlapToggleService.computeToggleButtonPosition({
        labelRect: tinyLabel,
        spotlight,
        viewport,
        buttonSize: 40,
      });

      expect(position).toEqual({ x: 230, y: 150 });
    });

    it("places the button outside the label when spotlight edges are covered by it", () => {
      // Oversized centered label covering the spotlight completely - the
      // common case where spotlight-edge anchors sit *inside* the label.
      const coveredLabel = { top: 100, right: 288, bottom: 280, left: 32 };
      const coveredSpotlight = {
        top: 160,
        right: 200,
        bottom: 240,
        left: 80,
        centerX: 140,
        centerY: 200,
      };
      const narrowViewport = { width: 320, height: 480 };

      const position = LabelOverlapToggleService.computeToggleButtonPosition({
        labelRect: coveredLabel,
        spotlight: coveredSpotlight,
        viewport: narrowViewport,
      });
      const half = LABEL_TOGGLE_BUTTON_SIZE_PX / 2;
      const buttonRect = {
        top: position.y - half,
        right: position.x + half,
        bottom: position.y + half,
        left: position.x - half,
      };

      expect(LabelOverlapToggleService.computeOverlapArea(buttonRect, coveredLabel)).toBe(0);
      expect(LabelOverlapToggleService.computeOverlapArea(buttonRect, coveredSpotlight)).toBe(0);
    });

    it("clears the label even when viewport corners are occupied by other buttons", () => {
      const coveredLabel = { top: 80, right: 280, bottom: 300, left: 40 };
      const coveredSpotlight = {
        top: 140,
        right: 200,
        bottom: 240,
        left: 100,
        centerX: 150,
        centerY: 190,
      };
      const narrowViewport = { width: 320, height: 400 };
      // Block every viewport corner the algorithm might fall back to.
      const avoidRects = [
        { top: 0, right: 60, bottom: 60, left: 0 },
        { top: 0, right: 320, bottom: 60, left: 260 },
        { top: 340, right: 60, bottom: 400, left: 0 },
        { top: 340, right: 320, bottom: 400, left: 260 },
      ];

      const position = LabelOverlapToggleService.computeToggleButtonPosition({
        labelRect: coveredLabel,
        spotlight: coveredSpotlight,
        viewport: narrowViewport,
        avoidRects,
      });
      const half = LABEL_TOGGLE_BUTTON_SIZE_PX / 2;
      const buttonRect = {
        top: position.y - half,
        right: position.x + half,
        bottom: position.y + half,
        left: position.x - half,
      };

      expect(LabelOverlapToggleService.computeOverlapArea(buttonRect, coveredLabel)).toBe(0);
      for (const avoid of avoidRects) {
        expect(LabelOverlapToggleService.computeOverlapArea(buttonRect, avoid)).toBe(0);
      }
    });
  });

  describe("computeLabelHideOffsetPx", () => {
    it("adds the default margin past the label's right edge", () => {
      expect(LabelOverlapToggleService.computeLabelHideOffsetPx({ left: 100, width: 200 })).toBe(100 + 200 + LABEL_HIDE_MARGIN_PX);
    });

    it("supports a custom margin", () => {
      expect(LabelOverlapToggleService.computeLabelHideOffsetPx({ left: 50, width: 80 }, { marginPx: 10 })).toBe(140);
    });

    it("clears the right viewport edge when dir is rtl", () => {
      expect(
        LabelOverlapToggleService.computeLabelHideOffsetPx(
          { left: 100, width: 200 },
          { dir: "rtl", viewportWidth: 800 },
        ),
      ).toBe(800 - 100 + LABEL_HIDE_MARGIN_PX);
    });

    it("uses custom margin for rtl", () => {
      expect(
        LabelOverlapToggleService.computeLabelHideOffsetPx(
          { left: 50, width: 80 },
          { dir: "rtl", viewportWidth: 500, marginPx: 10 },
        ),
      ).toBe(500 - 50 + 10);
    });
  });
});
