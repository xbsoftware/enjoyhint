import { describe, expect, it } from "vitest";
import { normalizeStep } from "../src/StepNormalizer";

describe("normalizeStep", () => {
  it("parses legacy shorthand click step", () => {
    const step = normalizeStep({ "click .new_btn": "Click the button" });

    expect(step).toEqual({
      selector: ".new_btn",
      event: "click",
      description: "Click the button",
    });
  });

  it("parses next event type from shorthand", () => {
    const step = normalizeStep({ "next #block": "Hello" });

    expect(step.event).toBe("next");
    expect(step.eventType).toBe("next");
    expect(step.selector).toBe("#block");
    expect(step.description).toBe("Hello");
  });

  it("parses custom event type from shorthand", () => {
    const step = normalizeStep({ "custom_event .el": "Wait for data" });

    expect(step.event).toBe("custom_event");
    expect(step.eventType).toBe("custom");
  });

  it("parses explicit step config", () => {
    const step = normalizeStep({
      selector: ".btn",
      event: "click",
      description: "Click me",
      shape: "circle",
      radius: 30,
      showPrev: false,
      event_selector: ".other",
    });

    expect(step.selector).toBe(".btn");
    expect(step.event).toBe("click");
    expect(step.shape).toBe("circle");
    expect(step.radius).toBe(30);
    expect(step.showPrev).toBe(false);
    expect(step.eventSelector).toBe(".other");
  });

  it("maps snake_case event_selector", () => {
    const step = normalizeStep({
      selector: ".x",
      event: "click",
      description: "x",
      event_selector: "#y",
    });

    expect(step.eventSelector).toBe("#y");
  });

  it("keeps selector empty for object-form steps without selector", () => {
    const step = normalizeStep({
      event: "next",
      description: "Welcome with no target",
    });

    expect(step.selector).toBe("");
    expect(step.event).toBe("next");
    expect(step.eventType).toBeUndefined();
    expect(step.description).toBe("Welcome with no target");
  });

  it("sets eventType next when provided explicitly without selector", () => {
    const step = normalizeStep({
      event: "next",
      event_type: "next",
      description: "Welcome",
    });

    expect(step.selector).toBe("");
    expect(step.eventType).toBe("next");
  });
});
