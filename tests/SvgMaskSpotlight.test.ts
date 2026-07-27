import { describe, expect, it } from "vitest";
import {
  LEGACY_INITIAL_SPOTLIGHT_STATE,
  SvgMaskSpotlight,
  computeTargetSpotlightState,
  sampleSpotlightGeometry,
  toSpotlightHoleRect,
} from "../src/overlay/SvgMaskSpotlight";
import { svgFragmentUrl } from "../src/overlay/svgFragmentUrl";

describe("SvgMaskSpotlight", () => {
  it("creates SVG mask with spotlight hole", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const spotlight = new SvgMaskSpotlight(svg, "rgba(0,0,0,0.6)");

    spotlight.update({ shape: "rect", x: 50, y: 50, width: 100, height: 60, radius: 4 });

    const mask = svg.querySelector("mask[id^='enjoyhint-spotlight-mask-']");
    expect(mask).not.toBeNull();
    expect(svg.querySelector("mask rect[data-enjoyhint-spotlight-hole]")).not.toBeNull();
    const overlay = svg.querySelector<SVGRectElement>("rect[mask]");
    expect(overlay?.getAttribute("mask")).toBe(svgFragmentUrl(mask!.id));
  });

  it("updates a rounded rect spotlight hole", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const spotlight = new SvgMaskSpotlight(svg, "rgba(0,0,0,0.6)");

    spotlight.update({ shape: "rect", x: 12, y: 24, width: 80, height: 40, radius: 6 });

    const hole = svg.querySelector<SVGRectElement>("mask rect[data-enjoyhint-spotlight-hole]");
    expect(hole?.getAttribute("x")).toBe("12");
    expect(hole?.getAttribute("y")).toBe("24");
    expect(hole?.getAttribute("width")).toBe("80");
    expect(hole?.getAttribute("height")).toBe("40");
    expect(hole?.getAttribute("rx")).toBe("6");
    expect(hole?.getAttribute("ry")).toBe("6");
    expect(hole?.getAttribute("fill")).toBe("black");
  });

  it("renders circle steps as a legacy-style rounded rect hole", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const spotlight = new SvgMaskSpotlight(svg, "rgba(0,0,0,0.6)");

    spotlight.update({ shape: "circle", x: 20, y: 30, width: 50, height: 50, radius: 25 });

    const hole = svg.querySelector<SVGRectElement>("mask rect[data-enjoyhint-spotlight-hole]");
    expect(hole?.getAttribute("x")).toBe("20");
    expect(hole?.getAttribute("y")).toBe("30");
    expect(hole?.getAttribute("width")).toBe("50");
    expect(hole?.getAttribute("height")).toBe("50");
    expect(hole?.getAttribute("rx")).toBe("25");
    expect(hole?.getAttribute("ry")).toBe("25");
  });

  it("interpolates from the previous spotlight state instead of always restarting offscreen", () => {
    const from = { centerX: 200, centerY: 150, width: 120, height: 80, radius: 8 };
    const to = computeTargetSpotlightState({
      shape: "circle",
      x: 300,
      y: 220,
      width: 60,
      height: 60,
      radius: 30,
    });
    const midpoint = sampleSpotlightGeometry(from, to, 0.5);
    const hole = toSpotlightHoleRect(midpoint);

    expect(hole.x).toBe(midpoint.centerX - Math.round(midpoint.width / 2));
    expect(hole.y).toBe(midpoint.centerY - Math.round(midpoint.height / 2));
    expect(midpoint.centerX).toBe(265);
    expect(midpoint.centerY).toBe(200);
    expect(midpoint).not.toEqual(LEGACY_INITIAL_SPOTLIGHT_STATE);
  });
});
