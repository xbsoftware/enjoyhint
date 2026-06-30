import { afterEach, describe, expect, it, vi } from "vitest";
import { OverlayRenderer } from "../../src/overlay/OverlayRenderer";
import {
  LEGACY_INITIAL_SPOTLIGHT_STATE,
  LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS,
  computeTargetSpotlightState,
  sampleSpotlightGeometry,
  toSpotlightHoleRect,
  type SvgMaskSpotlightUpdate,
} from "../../src/overlay/SvgMaskSpotlight";

interface SpotlightGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

function readSvgSpotlight(
  container: HTMLElement,
  from = LEGACY_INITIAL_SPOTLIGHT_STATE,
  target: SvgMaskSpotlightUpdate,
  progress: number,
): SpotlightGeometry {
  const hole = container.querySelector<SVGRectElement>("rect[data-enjoyhint-spotlight-hole]");
  if (!hole) {
    throw new Error("Expected SVG spotlight hole to be rendered");
  }

  const expected = toSpotlightHoleRect(
    sampleSpotlightGeometry(from, computeTargetSpotlightState(target), progress),
  );

  expect({
    x: Number(hole.getAttribute("x")),
    y: Number(hole.getAttribute("y")),
    width: Number(hole.getAttribute("width")),
    height: Number(hole.getAttribute("height")),
    radius: Number(hole.getAttribute("rx")),
  }).toEqual(expected);

  return expected;
}

class ControlledAnimationClock {
  private frameId = 0;
  private readonly callbacks = new Map<number, FrameRequestCallback>();
  time = 0;

  requestAnimationFrame = (callback: FrameRequestCallback): number => {
    this.frameId += 1;
    this.callbacks.set(this.frameId, callback);
    return this.frameId;
  };

  cancelAnimationFrame = (id: number): void => {
    this.callbacks.delete(id);
  };

  advance(ms: number): void {
    this.time += ms;
    const callbacks = Array.from(this.callbacks.values());
    this.callbacks.clear();

    for (const callback of callbacks) {
      callback(this.time);
    }
  }
}

describe("spotlight animation geometry parity", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("matches the legacy Kinetic rect spotlight geometry contract through OverlayRenderer animation", () => {
    const clock = installControlledAnimationClock();
    const renderer = new OverlayRenderer();
    const target: SvgMaskSpotlightUpdate = {
      shape: "rect",
      x: 120,
      y: 80,
      width: 160,
      height: 90,
      radius: 12,
    };

    renderer.renderSpotlight(target);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 0)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 0)),
    );

    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS / 2);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 0.5)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 0.5)),
    );

    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS / 2);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 1)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 1)),
    );

    renderer.destroy();
  });

  it("matches the legacy Kinetic circle spotlight geometry contract through OverlayRenderer animation", () => {
    const clock = installControlledAnimationClock();
    const renderer = new OverlayRenderer();
    const target: SvgMaskSpotlightUpdate = {
      shape: "circle",
      x: 250,
      y: 110,
      width: 70,
      height: 70,
      radius: 35,
    };

    renderer.renderSpotlight(target);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 0)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 0)),
    );

    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS / 2);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 0.5)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 0.5)),
    );

    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS / 2);
    expect(readSvgSpotlight(document.body, LEGACY_INITIAL_SPOTLIGHT_STATE, target, 1)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(LEGACY_INITIAL_SPOTLIGHT_STATE, computeTargetSpotlightState(target), 1)),
    );

    renderer.destroy();
  });

  it("animates from the previous step geometry on subsequent spotlight renders", () => {
    const clock = installControlledAnimationClock();
    const renderer = new OverlayRenderer();
    const firstTarget: SvgMaskSpotlightUpdate = {
      shape: "rect",
      x: 100,
      y: 100,
      width: 120,
      height: 60,
      radius: 8,
    };
    const secondTarget: SvgMaskSpotlightUpdate = {
      shape: "circle",
      x: 300,
      y: 220,
      width: 60,
      height: 60,
      radius: 30,
    };

    renderer.renderSpotlight(firstTarget);
    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS);

    renderer.renderSpotlight(secondTarget);
    const previousState = computeTargetSpotlightState(firstTarget);
    expect(readSvgSpotlight(document.body, previousState, secondTarget, 0)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(previousState, computeTargetSpotlightState(secondTarget), 0)),
    );

    clock.advance(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS / 2);
    expect(readSvgSpotlight(document.body, previousState, secondTarget, 0.5)).toEqual(
      toSpotlightHoleRect(sampleSpotlightGeometry(previousState, computeTargetSpotlightState(secondTarget), 0.5)),
    );

    renderer.destroy();
  });
});

function installControlledAnimationClock(): ControlledAnimationClock {
  const clock = new ControlledAnimationClock();

  vi.stubGlobal("requestAnimationFrame", clock.requestAnimationFrame);
  vi.stubGlobal("cancelAnimationFrame", clock.cancelAnimationFrame);
  vi.spyOn(performance, "now").mockImplementation(() => clock.time);

  return clock;
}
