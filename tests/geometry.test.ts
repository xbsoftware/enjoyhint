import { describe, expect, it } from "vitest";
import { computeSpotlightRect, positionBlockers } from "../src/overlay/geometry";

describe("geometry", () => {
  it("computes rect spotlight from element bounds and margin", () => {
    const rect = computeSpotlightRect({
      left: 100,
      top: 200,
      width: 80,
      height: 40,
      margin: 10,
      shape: "rect",
    });

    expect(rect.left).toBe(90);
    expect(rect.top).toBe(190);
    expect(rect.right).toBe(190);
    expect(rect.bottom).toBe(250);
    expect(rect.centerX).toBe(140);
    expect(rect.centerY).toBe(220);
  });

  it("uses legacy default margin when margin is omitted", () => {
    const rect = computeSpotlightRect({
      left: 100,
      top: 200,
      width: 80,
      height: 40,
      shape: "rect",
    });

    expect(rect.left).toBe(80);
    expect(rect.top).toBe(180);
    expect(rect.right).toBe(200);
    expect(rect.bottom).toBe(260);
    expect(rect.centerX).toBe(140);
    expect(rect.centerY).toBe(220);
  });

  it("applies normalized step offsets to rect spotlight bounds", () => {
    const rect = computeSpotlightRect({
      elementLeft: 100,
      elementTop: 200,
      width: 80,
      height: 40,
      margin: 0,
      shape: "rect",
      top: 5,
      right: 10,
      bottom: 15,
      left: 20,
    });

    expect(rect.left).toBe(120);
    expect(rect.top).toBe(205);
    expect(rect.right).toBe(170);
    expect(rect.bottom).toBe(225);
    expect(rect.centerX).toBe(145);
    expect(rect.centerY).toBe(215);
  });

  it("computes circle spotlight from radius and normalized step offsets", () => {
    const rect = computeSpotlightRect({
      elementLeft: 100,
      elementTop: 200,
      width: 80,
      height: 40,
      margin: 0,
      shape: "circle",
      radius: 30,
      top: 5,
      right: 20,
      bottom: 15,
      left: 10,
    });

    expect(rect.left).toBe(120);
    expect(rect.top).toBe(200);
    expect(rect.right).toBe(150);
    expect(rect.bottom).toBe(230);
    expect(rect.centerX).toBe(135);
    expect(rect.centerY).toBe(215);
  });

  it("positions four blockers around spotlight", () => {
    const styles = positionBlockers({ top: 100, left: 50, right: 300, bottom: 400 });

    expect(styles).toEqual({
      top: {
        position: "absolute",
        top: "0px",
        left: "0px",
        height: "100px",
      },
      left: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "50px",
      },
      right: {
        position: "absolute",
        top: "0px",
        left: "300px",
      },
      bottom: {
        position: "absolute",
        top: "400px",
        left: "0px",
      },
    });
  });
});
