import { describe, expect, it } from "vitest";
import { EventBlockers } from "../src/overlay/EventBlockers";

describe("EventBlockers", () => {
  it("applies blocker styles around a spotlight rectangle", () => {
    const blockers = Array.from({ length: 4 }, () => document.createElement("div"));
    const eventBlockers = new EventBlockers(blockers);

    eventBlockers.apply({ top: 100, left: 50, right: 300, bottom: 400 });

    expect(blockers[0]?.style.position).toBe("absolute");
    expect(blockers[0]?.style.top).toBe("0px");
    expect(blockers[0]?.style.left).toBe("0px");
    expect(blockers[0]?.style.height).toBe("100px");

    expect(blockers[1]?.style.position).toBe("absolute");
    expect(blockers[1]?.style.top).toBe("400px");
    expect(blockers[1]?.style.left).toBe("0px");
    expect(blockers[1]?.style.width).toBe("");
    expect(blockers[1]?.style.height).toBe("");

    expect(blockers[2]?.style.position).toBe("absolute");
    expect(blockers[2]?.style.top).toBe("0px");
    expect(blockers[2]?.style.left).toBe("0px");
    expect(blockers[2]?.style.width).toBe("50px");
    expect(blockers[2]?.style.height).toBe("");

    expect(blockers[3]?.style.position).toBe("absolute");
    expect(blockers[3]?.style.top).toBe("0px");
    expect(blockers[3]?.style.left).toBe("300px");
    expect(blockers[3]?.style.width).toBe("");
    expect(blockers[3]?.style.height).toBe("");
  });

  it("preserves inherited fixed dimensions on bottom and right blockers like legacy", () => {
    const blockers = Array.from({ length: 4 }, () => {
      const blocker = document.createElement("div");
      blocker.style.width = "2000px";
      blocker.style.height = "1500px";
      return blocker;
    });
    const eventBlockers = new EventBlockers(blockers);

    eventBlockers.apply({ top: 100, left: 50, right: 300, bottom: 400 });

    expect(blockers[1]?.style.top).toBe("400px");
    expect(blockers[1]?.style.width).toBe("2000px");
    expect(blockers[1]?.style.height).toBe("1500px");
    expect(blockers[3]?.style.left).toBe("300px");
    expect(blockers[3]?.style.width).toBe("2000px");
    expect(blockers[3]?.style.height).toBe("1500px");
  });
});
