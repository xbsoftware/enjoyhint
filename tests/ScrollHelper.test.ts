import { afterEach, describe, expect, it, vi } from "vitest";
import { computeScrollTarget, scrollToElement } from "../src/ScrollHelper";

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

describe("computeScrollTarget", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies -200px offset to element top", () => {
    const el = {
      getBoundingClientRect: () => ({ top: 500, bottom: 540 }),
    } as Element;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(100);

    expect(computeScrollTarget(el)).toBe(400);
  });
});

describe("scrollToElement", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("animates scroll over the requested duration and finishes at the legacy target", () => {
    const clock = installControlledAnimationClock();
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const onAfter = vi.fn();
    const el = {
      getBoundingClientRect: () => ({ top: 500, bottom: 540 }),
    } as Element;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(100);

    scrollToElement(el, 250, onAfter);

    clock.advance(0);
    expect(onAfter).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith({ top: 100, behavior: "auto" });

    clock.advance(125);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 250, behavior: "auto" });
    expect(onAfter).not.toHaveBeenCalled();

    clock.advance(125);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 400, behavior: "auto" });
    expect(onAfter).toHaveBeenCalledOnce();
  });

  it("uses auto scroll behavior when speed is zero", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const el = {
      getBoundingClientRect: () => ({ top: 450, bottom: 490 }),
    } as Element;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(25);

    scrollToElement(el, 0);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 275,
      behavior: "auto",
    });
  });

  it("can be cancelled before the animation completes", () => {
    const clock = installControlledAnimationClock();
    const onAfter = vi.fn();
    const el = {
      getBoundingClientRect: () => ({ top: 500, bottom: 540 }),
    } as Element;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(100);

    const cancel = scrollToElement(el, 250, onAfter);
    cancel();
    clock.advance(250);

    expect(onAfter).not.toHaveBeenCalled();
  });
});

function installControlledAnimationClock(): ControlledAnimationClock {
  const clock = new ControlledAnimationClock();

  vi.stubGlobal("requestAnimationFrame", clock.requestAnimationFrame);
  vi.stubGlobal("cancelAnimationFrame", clock.cancelAnimationFrame);
  vi.spyOn(performance, "now").mockImplementation(() => clock.time);

  return clock;
}
