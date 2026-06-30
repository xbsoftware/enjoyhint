import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../src/EventBus";

describe("EventBus", () => {
  it("trigger invokes registered listeners", () => {
    const bus = new EventBus();
    const fn = vi.fn();

    bus.on("data_loaded", fn);
    bus.trigger("data_loaded");

    expect(fn).toHaveBeenCalledOnce();
  });

  it("off removes listeners only for the given event", () => {
    const bus = new EventBus();
    const dataLoaded = vi.fn();
    const stepComplete = vi.fn();

    bus.on("data_loaded", dataLoaded);
    bus.on("step_complete", stepComplete);
    bus.off("data_loaded");
    bus.trigger("data_loaded");
    bus.trigger("step_complete");

    expect(dataLoaded).not.toHaveBeenCalled();
    expect(stepComplete).toHaveBeenCalledOnce();
  });

  it("off removes all listeners for the event", () => {
    const bus = new EventBus();
    const first = vi.fn();
    const second = vi.fn();

    bus.on("data_loaded", first);
    bus.on("data_loaded", second);
    bus.off("data_loaded");
    bus.trigger("data_loaded");

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });
});
