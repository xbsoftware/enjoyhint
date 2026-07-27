import { afterEach, describe, expect, it } from "vitest";
import { OverlayRenderer } from "../../src/overlay/OverlayRenderer";
import { computeLegacyButtonPositions } from "./legacyPlacement";

describe("button placement legacy parity", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("uses the legacy button distance formula", () => {
    const positions = computeLegacyButtonPositions({
      labelX: 760,
      labelY: 302,
      labelWidth: 214,
      labelHeight: 26,
      xFrom: 868,
      yFrom: 302,
      xTo: 1035,
      yTo: 144,
      viewportWidth: 1280,
      nextWidth: 100,
      prevWidth: 100,
      skipWidth: 100,
      nextVisible: true,
      prevVisible: false,
    });

    expect(positions.prev).toEqual({ left: 10, top: 368 });
    expect(positions.next).toEqual({ left: 10, top: 368 });
    expect(positions.skip).toEqual({ left: 120, top: 368 });
  });

  it("pins buttons to the mobile corner using legacy coordinates", () => {
    const positions = computeLegacyButtonPositions({
      labelX: 200,
      labelY: 300,
      labelWidth: 250,
      labelHeight: 100,
      xFrom: 180,
      yFrom: 250,
      xTo: 220,
      yTo: 350,
      viewportWidth: 375,
      nextWidth: 39,
      prevWidth: 39,
      skipWidth: 0,
      nextVisible: true,
      prevVisible: true,
      isMobileViewport: true,
    });

    expect(positions).toEqual({
      prev: { left: 10, top: 10 },
      next: { left: 59, top: 10 },
      skip: { left: 108, top: 10 },
    });
  });

  it("matches the legacy formula through OverlayRenderer on desktop", () => {
    const renderer = new OverlayRenderer();
    renderer.mount();
    renderer.showNext();
    renderer.hidePrev();
    renderer.showSkip();

    const input = {
      labelX: 760,
      labelY: 302,
      labelWidth: 214,
      labelHeight: 26,
      xFrom: 868,
      yFrom: 302,
      xTo: 1035,
      yTo: 144,
      viewportWidth: 1280,
    };

    renderer.positionButtons(input);

    const legacy = computeLegacyButtonPositions({
      ...input,
      nextWidth: 100,
      prevWidth: 100,
      skipWidth: 100,
      nextVisible: true,
      prevVisible: false,
    });

    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const skipButton = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");

    expect(Number.parseFloat(nextButton?.style.left ?? "0")).toBe(legacy.next.left);
    expect(Number.parseFloat(nextButton?.style.top ?? "0")).toBe(legacy.next.top);
    expect(Number.parseFloat(skipButton?.style.left ?? "0")).toBe(legacy.skip.left);
    expect(Number.parseFloat(skipButton?.style.top ?? "0")).toBe(legacy.skip.top);

    renderer.destroy();
  });
});
