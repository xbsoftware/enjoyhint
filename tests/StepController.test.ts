import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StepController } from "../src/StepController";
import { getLegacyStepRenderDelay, LEGACY_LABEL_ARROW_DELAY_MS } from "../src/stepTiming";
import type { NormalizedStep } from "../src/types";

function makeStep(overrides: Partial<NormalizedStep> = {}): NormalizedStep {
  return {
    selector: ".target",
    event: "click",
    description: "Click me",
    ...overrides,
  };
}

function addTarget(className = "target"): HTMLElement {
  const element = document.createElement("button");
  element.className = className;
  document.body.append(element);
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 100,
    y: 120,
    top: 120,
    right: 180,
    bottom: 160,
    left: 100,
    width: 80,
    height: 40,
    toJSON: () => ({}),
  });
  return element;
}

function advanceStepRender(scrollSpeed = 250): void {
  vi.advanceTimersByTime(getLegacyStepRenderDelay(scrollSpeed));
}

function advanceStepPresentation(scrollSpeed = 250): void {
  advanceStepRender(scrollSpeed);
  vi.advanceTimersByTime(LEGACY_LABEL_ARROW_DELAY_MS);
}

describe("StepController", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    vi.useFakeTimers();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  it("runs a click step and advances on target click", () => {
    const target = addTarget();
    const controller = new StepController([makeStep()]);

    controller.run();
    advanceStepRender();
    target.dispatchEvent(new Event("click"));

    expect(controller.getCurrentStep()).toBe(1);
  });

  it("advances a next step when trigger next is called", () => {
    addTarget();
    const controller = new StepController([makeStep({ event: "next", eventType: "next" })]);

    controller.run();
    advanceStepRender();
    controller.trigger("next");

    expect(controller.getCurrentStep()).toBe(1);
  });

  it("advances a custom step only when the matching custom trigger fires", () => {
    addTarget();
    const controller = new StepController([
      makeStep({ event: "done", eventType: "custom" }),
      makeStep({ event: "next", eventType: "next" }),
    ]);

    controller.run();
    advanceStepRender();
    controller.trigger("other");
    expect(controller.getCurrentStep()).toBe(0);

    controller.trigger("done");
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("advances a key step when the configured key is pressed", () => {
    const target = addTarget();
    const controller = new StepController([makeStep({ event: "key", keyCode: 13 })]);

    controller.run();
    advanceStepRender();
    target.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
    expect(controller.getCurrentStep()).toBe(0);

    target.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 13 }));
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("waits for timeout before rendering, then auto-advances without user input", () => {
    addTarget();
    const controller = new StepController([makeStep({ event: "click", eventType: "auto", timeout: 25 })]);

    controller.run();
    expect(controller.getCurrentStep()).toBe(0);

    vi.advanceTimersByTime(25);
    advanceStepRender();
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("auto click steps invoke HTMLElement.click for legacy parity", () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "auto_checkbox";
    document.body.append(checkbox);
    vi.spyOn(checkbox, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 120,
      top: 120,
      right: 120,
      bottom: 140,
      left: 100,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    });
    const clickSpy = vi.spyOn(checkbox, "click");

    const controller = new StepController([
      makeStep({ selector: "#auto_checkbox", event: "click", eventType: "auto" }),
    ]);

    controller.run();
    advanceStepRender();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(checkbox.checked).toBe(true);
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("calls onBeforeStart before rendering the step", () => {
    addTarget();
    const onBeforeStart = vi.fn(() => {
      expect(document.querySelector(".enjoyhint")).toBeNull();
    });
    const controller = new StepController([makeStep({ onBeforeStart })]);

    controller.run();

    expect(onBeforeStart).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoyhint")).toBeNull();

    advanceStepRender();
    expect(document.querySelector(".enjoyhint")).toBeInstanceOf(HTMLElement);
  });

  it("stops on skip, calls callbacks, removes overlay, and restores body overflow", () => {
    addTarget();
    document.body.style.overflow = "auto";
    const onSkip = vi.fn();
    const onEnd = vi.fn();
    const controller = new StepController([makeStep()], { onSkip, onEnd });

    controller.run();
    expect(document.body.style.overflow).toBe("hidden");

    controller.trigger("skip");

    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onEnd).not.toHaveBeenCalled();
    expect(document.querySelector(".enjoyhint")).toBeNull();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores body overflow when the tour advances past the last step", () => {
    addTarget();
    document.body.style.overflow = "scroll";
    const onEnd = vi.fn();
    const controller = new StepController([makeStep({ event: "next", eventType: "next" })], { onEnd });

    controller.run();
    advanceStepRender();
    controller.trigger("next");

    expect(controller.getCurrentStep()).toBe(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("removes previous step handlers so one event cannot advance twice", () => {
    const first = addTarget("first");
    addTarget("second");
    const controller = new StepController([
      makeStep({ selector: ".first", event: "click" }),
      makeStep({ selector: ".second", event: "next", eventType: "next" }),
    ]);

    controller.run();
    advanceStepRender();
    first.dispatchEvent(new Event("click"));
    first.dispatchEvent(new Event("click"));

    expect(controller.getCurrentStep()).toBe(1);
  });

  it("uses fresh target geometry after the legacy scroll render delay", () => {
    const target = addTarget();
    vi.mocked(target.getBoundingClientRect)
      .mockReturnValueOnce({
        x: 100,
        y: 1000,
        top: 1000,
        right: 180,
        bottom: 1040,
        left: 100,
        width: 80,
        height: 40,
        toJSON: () => ({}),
      })
      .mockReturnValue({
        x: 100,
        y: 120,
        top: 120,
        right: 180,
        bottom: 160,
        left: 100,
        width: 80,
        height: 40,
        toJSON: () => ({}),
      });
    const controller = new StepController([makeStep({ margin: 0, scrollAnimationSpeed: 250 })]);

    controller.run();
    vi.advanceTimersByTime(200);
    expect(document.querySelector(".enjoyhint")?.classList.contains("enjoyhint_hide")).toBe(true);
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();

    advanceStepRender(250);

    const blockers = document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events");
    expect(blockers[0]?.style.height).toBe("120px");
  });

  it("does not render after destroy during a pending scroll", () => {
    const target = addTarget();
    vi.mocked(target.getBoundingClientRect).mockReturnValue({
      x: 100,
      y: 1000,
      top: 1000,
      right: 180,
      bottom: 1040,
      left: 100,
      width: 80,
      height: 40,
      toJSON: () => ({}),
    });
    const controller = new StepController([makeStep({ scrollAnimationSpeed: 250 })]);

    controller.run();
    controller.destroy();
    advanceStepRender(250);

    expect(document.querySelector(".enjoyhint")).toBeNull();
  });

  it("stops when a parent MD-DIALOG dispatches dialogClosing", () => {
    document.body.innerHTML = '<md-dialog><button class="target">Go</button></md-dialog>';
    const target = document.querySelector<HTMLElement>(".target")!;
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 120,
      top: 120,
      right: 180,
      bottom: 160,
      left: 100,
      width: 80,
      height: 40,
      toJSON: () => ({}),
    });
    const dialog = document.querySelector("md-dialog")!;
    const onSkip = vi.fn();
    const controller = new StepController([makeStep()], { onSkip });

    controller.run();
    advanceStepRender();
    dialog.dispatchEvent(new Event("dialogClosing"));

    expect(onSkip).toHaveBeenCalledOnce();
    expect(document.querySelector(".enjoyhint")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("calls onNext at the start of each rendered step", () => {
    addTarget("first");
    addTarget("second");
    const onNext = vi.fn();
    const controller = new StepController(
      [
        makeStep({ selector: ".first", event: "next", eventType: "next" }),
        makeStep({ selector: ".second", event: "next", eventType: "next" }),
      ],
      { onNext },
    );

    controller.run();
    expect(onNext).toHaveBeenCalledTimes(1);

    advanceStepRender();
    controller.trigger("next");
    expect(onNext).toHaveBeenCalledTimes(2);
  });

  it("reruns from the requested step index", () => {
    addTarget("first");
    addTarget("second");
    const controller = new StepController([
      makeStep({ selector: ".first", event: "next", eventType: "next" }),
      makeStep({ selector: ".second", event: "next", eventType: "next" }),
    ]);

    controller.run();
    advanceStepRender();
    controller.reRunScript(1);
    advanceStepRender();

    expect(controller.getCurrentStep()).toBe(1);
    expect(document.querySelector(".enjoyhint")).not.toBeNull();
  });

  it("positions the label and renders an arrow for the current step", () => {
    addTarget();
    const controller = new StepController([makeStep({ arrowColor: "tomato" })]);

    controller.run();
    advanceStepPresentation();

    const label = document.querySelector<HTMLElement>(".enjoy_hint_label");
    const arrow = document.querySelector<SVGPathElement>("#enjoyhint_arrpw_line");
    expect(label?.style.left).not.toBe("");
    expect(label?.style.top).not.toBe("");
    expect(arrow?.getAttribute("d")).toMatch(/^M/);
    expect(arrow?.getAttribute("style")).toContain("tomato");
  });

  it("fades label and arrow during step transitions", () => {
    addTarget("first");
    addTarget("second");
    const controller = new StepController([
      makeStep({ selector: ".first", event: "next", eventType: "next", description: "First step" }),
      makeStep({ selector: ".second", event: "next", eventType: "next", description: "Second step" }),
    ]);

    controller.run();
    advanceStepPresentation();
    controller.trigger("next");
    advanceStepRender();

    expect(document.querySelector(".enjoyhint")?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("First step");

    vi.advanceTimersByTime(LEGACY_LABEL_ARROW_DELAY_MS);
    expect(document.querySelector(".enjoyhint")?.classList.contains("enjoyhint_svg_transparent")).toBe(false);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Second step");
    expect(document.querySelector("#enjoyhint_arrpw_line")).not.toBeNull();
  });

  it("clears the previous step presentation and collapses spotlight before scrolling", () => {
    addTarget("first");
    const second = addTarget("second");
    vi.mocked(second.getBoundingClientRect).mockReturnValue({
      x: 100,
      y: 1000,
      top: 1000,
      right: 180,
      bottom: 1040,
      left: 100,
      width: 80,
      height: 40,
      toJSON: () => ({}),
    });
    const controller = new StepController([
      makeStep({ selector: ".first", event: "next", eventType: "next" }),
      makeStep({ selector: ".second", event: "next", eventType: "next", scrollAnimationSpeed: 2500 }),
    ]);

    controller.run();
    advanceStepRender();
    controller.trigger("next");

    expect(document.querySelector(".enjoy_hint_label")).toBeNull();
    expect(document.querySelector("#enjoyhint_arrpw_line")).toBeNull();
    const hole = document.querySelector<SVGRectElement>("rect[data-enjoyhint-spotlight-hole]");
    expect(Number(hole?.getAttribute("width"))).toBe(0);

    vi.advanceTimersByTime(2500);
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();
  });

  it("leaves a large clickable hole for circle spotlights", () => {
    const target = addTarget("mini_button");
    vi.mocked(target.getBoundingClientRect).mockReturnValue({
      x: 200,
      y: 300,
      top: 300,
      right: 260,
      bottom: 330,
      left: 200,
      width: 60,
      height: 30,
      toJSON: () => ({}),
    });

    const controller = new StepController([
      makeStep({ selector: ".mini_button", shape: "circle", radius: 80, event: "next", eventType: "next" }),
    ]);

    controller.run();
    advanceStepPresentation();

    const blockers = document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events");
    const holeLeft = Number.parseInt(blockers[2]?.style.width ?? "0", 10);
    const holeTop = Number.parseInt(blockers[0]?.style.height ?? "0", 10);
    const holeRight = Number.parseInt(blockers[3]?.style.left ?? "0", 10);
    const holeBottom = Number.parseInt(blockers[1]?.style.top ?? "0", 10);

    expect(holeRight - holeLeft).toBe(160);
    expect(holeBottom - holeTop).toBe(160);
    expect(document.querySelector("canvas")).toBeNull();
  });
});
