import { describe, expect, it } from "vitest";
import { EnjoyHint } from "../src/EnjoyHint";

describe("EnjoyHint API skeleton", () => {
  it("exposes set, run, getCurrentStep, trigger aliases", () => {
    const hint = new EnjoyHint({});

    expect(typeof hint.set).toBe("function");
    expect(typeof hint.setSteps).toBe("function");
    expect(typeof hint.setScript).toBe("function");
    expect(typeof hint.run).toBe("function");
    expect(typeof hint.resume).toBe("function");
    expect(typeof hint.getCurrentStep).toBe("function");
    expect(typeof hint.trigger).toBe("function");
    expect(typeof hint.clear).toBe("function");
    expect(typeof hint.destroy).toBe("function");
    expect(hint.getCurrentStep()).toBe(0);
  });

  it("trigger next advances current step index", () => {
    const hint = new EnjoyHint({});

    hint.set([{ "next .a": "step 1" }, { "next .b": "step 2" }]);
    hint.run();

    expect(hint.getCurrentStep()).toBe(0);

    hint.trigger("next");

    expect(hint.getCurrentStep()).toBe(1);
  });
});
