import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EnjoyHint } from "../src/EnjoyHint";
import { getLegacyStepRenderDelay } from "../src/stepTiming";

function advanceStepRender(scrollSpeed = 250): void {
  vi.advanceTimersByTime(getLegacyStepRenderDelay(scrollSpeed));
}

describe("EnjoyHint facade", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  it("exposes set, run, getCurrentStep, trigger aliases, rejects empty step configuration", () => {
    const hint = new EnjoyHint({});

    expect(typeof hint.set).toBe("function");
    expect(typeof hint.setSteps).toBe("function");
    expect(typeof hint.setScript).toBe("function");
    expect(typeof hint.run).toBe("function");
    expect(typeof hint.resume).toBe("function");
    expect(typeof hint.getCurrentStep).toBe("function");
    expect(typeof hint.trigger).toBe("function");
    expect(typeof hint.reRunScript).toBe("function");
    expect(typeof hint.clear).toBe("function");
    expect(typeof hint.destroy).toBe("function");
    expect(hint.getCurrentStep()).toBe(0);

    expect(() => hint.setScript([])).toThrow(
      "Configurations list isn't correct.",
    );
    expect(() => hint.set([])).toThrow("Configurations list isn't correct.");
  });

  it("wires set aliases and step progression through StepController", () => {
    const hint = new EnjoyHint({});
    document.body.innerHTML =
      '<button class="a">A</button><button class="b">B</button>';
    document.querySelectorAll("button").forEach((button, index) => {
      vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
        x: 100 + index * 100,
        y: 120,
        top: 120,
        right: 180 + index * 100,
        bottom: 160,
        left: 100 + index * 100,
        width: 80,
        height: 40,
        toJSON: () => ({}),
      });
    });

    hint.setSteps([{ "next .a": "step 1" }, { "next .b": "step 2" }]);
    hint.run();
    advanceStepRender();

    expect(hint.getCurrentStep()).toBe(0);
    hint.trigger("next");
    expect(hint.getCurrentStep()).toBe(1);
  });
});
