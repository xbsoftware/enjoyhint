import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StepController } from "../src/StepController";
import { OverlayRenderer } from "../src/overlay/OverlayRenderer";
import { LABEL_TOGGLE_BUTTON_SIZE_PX } from "../src/overlay/labelOverlapToggle";
import {
  getLegacyStepRenderDelay,
  LEGACY_LABEL_ARROW_DELAY_MS,
  LEGACY_OVERSIZED_LABEL_DELAY_MS,
} from "../src/stepTiming";
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

  it("skips a step when onBeforeStart returns false without rendering it", () => {
    addTarget("first");
    addTarget("second");
    const onNext = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          selector: ".first",
          event: "next",
          eventType: "next",
          description: "Skip me",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".second",
          event: "next",
          eventType: "next",
          description: "Keep me",
        }),
      ],
      { onNext },
    );

    controller.run();
    advanceStepPresentation();

    expect(controller.getCurrentStep()).toBe(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Keep me");
  });

  it("chain-skips consecutive steps that return false from onBeforeStart", () => {
    addTarget("first");
    addTarget("second");
    addTarget("third");
    const onNext = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          selector: ".first",
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".second",
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".third",
          event: "next",
          eventType: "next",
          description: "Land here",
        }),
      ],
      { onNext },
    );

    controller.run();
    advanceStepPresentation();

    expect(controller.getCurrentStep()).toBe(2);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Land here");
  });

  it("finishes the tour when onBeforeStart returns false on the last remaining step", () => {
    addTarget();
    const onNext = vi.fn();
    const onEnd = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
      ],
      { onNext, onEnd },
    );

    controller.run();

    expect(onNext).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoyhint")).toBeNull();
  });

  it("still renders the step when onBeforeStart returns undefined", () => {
    addTarget();
    const onBeforeStart = vi.fn(() => undefined);
    const controller = new StepController([
      makeStep({ event: "next", eventType: "next", onBeforeStart }),
    ]);

    controller.run();
    advanceStepRender();

    expect(onBeforeStart).toHaveBeenCalledTimes(1);
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

  it("immediately clears the arrow and spotlight when advancing to a targetless step", () => {
    addTarget("first");
    const controller = new StepController([
      makeStep({ selector: ".first", event: "next", eventType: "next" }),
      makeStep({ selector: "", event: "next", eventType: "next" }),
    ]);

    controller.run();
    advanceStepPresentation();
    expect(document.querySelector("#enjoyhint_arrpw_line")).not.toBeNull();

    controller.trigger("next");
    advanceStepRender();

    expect(document.querySelector("#enjoyhint_arrpw_line")).toBeNull();
    const hole = document.querySelector<SVGRectElement>("rect[data-enjoyhint-spotlight-hole]");
    expect(Number(hole?.getAttribute("width"))).toBe(0);
    expect(Number(hole?.getAttribute("height"))).toBe(0);
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

  it("renders a targetless next step with no spotlight hole and centered label", () => {
    const onEnd = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          selector: "",
          event: "next",
          eventType: "next",
          description: "Targetless welcome",
        }),
      ],
      { onEnd },
    );

    controller.run();
    advanceStepPresentation();

    expect(onEnd).not.toHaveBeenCalled();
    expect(controller.getCurrentStep()).toBe(0);

    const label = document.querySelector<HTMLElement>("#enjoyhint_label");
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain("Targetless welcome");
    expect(label?.style.backgroundColor).not.toBe("rgb(39, 42, 38)");

    const viewportW = window.innerWidth || document.documentElement.clientWidth;
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const labelLeft = Number.parseFloat(label!.style.left);
    const labelTop = Number.parseFloat(label!.style.top);
    expect(labelLeft).toBeGreaterThan(viewportW * 0.1);
    expect(labelLeft).toBeLessThan(viewportW * 0.9);
    expect(labelTop).toBeGreaterThan(viewportH * 0.1);
    expect(labelTop).toBeLessThan(viewportH * 0.9);

    const hole = document.querySelector("rect[data-enjoyhint-spotlight-hole]");
    const holeW = Number(hole?.getAttribute("width") ?? "-1");
    const holeH = Number(hole?.getAttribute("height") ?? "-1");
    expect(holeW).toBe(0);
    expect(holeH).toBe(0);

    expect(document.querySelector("#enjoyhint_arrpw_line")).toBeNull();
    expect(document.querySelector(".enjoyhint_next_btn")).toBeTruthy();
  });

  it("applies init nextButton/skipButton/prevButton across steps and field-merges step overrides", () => {
    addTarget();
    const controller = new StepController(
      [
        makeStep({ event: "next", eventType: "next", description: "First" }),
        makeStep({
          event: "next",
          eventType: "next",
          description: "Second",
          nextButton: { text: "OK" },
        }),
      ],
      {
        nextButton: { text: "Continue", className: "global-next" },
        skipButton: { text: "Exit", className: "global-skip" },
        prevButton: { text: "Back", className: "global-prev" },
      },
    );

    controller.run();
    advanceStepPresentation();

    const next = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const skip = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");
    expect(next?.textContent).toBe("Continue");
    expect(next?.classList.contains("global-next")).toBe(true);
    expect(skip?.textContent).toBe("Exit");
    expect(skip?.classList.contains("global-skip")).toBe(true);

    controller.trigger("next");
    advanceStepPresentation();

    const next2 = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const prev = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");
    expect(next2?.textContent).toBe("OK");
    expect(next2?.classList.contains("global-next")).toBe(true);
    expect(prev?.textContent).toBe("Back");
    expect(prev?.classList.contains("global-prev")).toBe(true);

    controller.destroy();
  });

  it("advances a targetless next step via Next trigger", () => {
    addTarget();
    const controller = new StepController([
      makeStep({
        selector: "",
        event: "next",
        eventType: "next",
        description: "Intro",
      }),
      makeStep({ event: "next", eventType: "next", description: "Click me" }),
    ]);

    controller.run();
    advanceStepPresentation();
    expect(controller.getCurrentStep()).toBe(0);

    controller.trigger("next");
    advanceStepPresentation();
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("advances a targetless custom step on matching trigger", () => {
    const controller = new StepController([
      makeStep({
        selector: "",
        event: "proceed",
        eventType: "custom",
        description: "Wait for trigger",
      }),
      makeStep({
        selector: "",
        event: "next",
        eventType: "next",
        description: "After",
      }),
    ]);

    controller.run();
    advanceStepPresentation();
    controller.trigger("other");
    expect(controller.getCurrentStep()).toBe(0);

    controller.trigger("proceed");
    advanceStepPresentation();
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("advances a targetless key step on document keydown", () => {
    const controller = new StepController([
      makeStep({
        selector: "",
        event: "key",
        keyCode: 13,
        description: "Press enter",
      }),
    ]);

    controller.run();
    advanceStepPresentation();

    document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
    expect(controller.getCurrentStep()).toBe(0);

    document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 13 }));
    expect(controller.getCurrentStep()).toBe(1);
  });

  it("does not auto-advance a targetless auto step", () => {
    const controller = new StepController([
      makeStep({
        selector: "",
        event: "click",
        eventType: "auto",
        description: "Should stay",
      }),
    ]);

    controller.run();
    advanceStepPresentation();
    expect(controller.getCurrentStep()).toBe(0);
  });

  it("still finishes when a non-empty selector is missing", () => {
    const onEnd = vi.fn();
    const controller = new StepController(
      [makeStep({ selector: ".does-not-exist", event: "next", eventType: "next" })],
      { onEnd },
    );

    controller.run();
    advanceStepRender();

    expect(onEnd).toHaveBeenCalled();
  });

  describe("label overlap toggle", () => {
    // jsdom defaults to a 1024x768 window; restore that after each test so
    // viewport overrides below don't leak into other tests in this file.
    afterEach(() => {
      window.innerWidth = 1024;
      window.innerHeight = 768;
    });

    it("shows the toggle button when the label overlaps the spotlight", () => {
      // A tiny viewport plus a small margin forces the "oversized" centered
      // label path, which sits directly on top of the spotlight/target.
      window.innerWidth = 300;
      window.innerHeight = 300;
      addTarget();
      const controller = new StepController([makeStep({ margin: 4 })]);

      controller.run();
      advanceStepRender();
      // The toggle is configured together with the next/prev/skip buttons,
      // in the same zero-delay timeout that runs right after the label
      // itself starts presenting - flush that tick before asserting.
      vi.advanceTimersByTime(1);

      const button = document.querySelector<HTMLElement>(".enjoyhint_label_toggle_btn");
      expect(button?.classList.contains("enjoyhint_hide")).toBe(false);

      controller.destroy();
    });

    it("does not show the toggle button when the label does not overlap the spotlight", () => {
      window.innerWidth = 1280;
      window.innerHeight = 800;
      addTarget();
      const controller = new StepController([makeStep()]);

      controller.run();
      advanceStepRender();
      vi.advanceTimersByTime(1);

      const button = document.querySelector<HTMLElement>(".enjoyhint_label_toggle_btn");
      expect(button?.classList.contains("enjoyhint_hide")).toBe(true);

      controller.destroy();
    });

    it("keeps the toggle button clear of the positioned next/prev/skip button row", () => {
      window.innerWidth = 300;
      window.innerHeight = 300;
      addTarget();
      const renderer = new OverlayRenderer();
      const configureSpy = vi.spyOn(renderer, "configureLabelOverlapToggle");
      const controller = new StepController([makeStep({ margin: 4 })], {}, undefined, undefined, renderer);

      controller.run();
      advanceStepRender();
      vi.advanceTimersByTime(1);

      const rowRect = renderer.getButtonRowRect();
      expect(rowRect).toBeDefined();

      const lastCall = configureSpy.mock.calls.at(-1)?.[0];
      expect(lastCall?.overlaps).toBe(true);

      const half = LABEL_TOGGLE_BUTTON_SIZE_PX / 2;
      const toggleRect = {
        top: lastCall!.anchorY - half,
        bottom: lastCall!.anchorY + half,
        left: lastCall!.anchorX - half,
        right: lastCall!.anchorX + half,
      };
      const overlapsRow =
        toggleRect.left < rowRect!.right &&
        toggleRect.right > rowRect!.left &&
        toggleRect.top < rowRect!.bottom &&
        toggleRect.bottom > rowRect!.top;

      expect(overlapsRow).toBe(false);

      controller.destroy();
    });

    it("keeps the toggle button clear of the mirrored close button in RTL", () => {
      window.innerWidth = 300;
      window.innerHeight = 300;
      addTarget();
      const renderer = new OverlayRenderer(document.body, undefined, "rtl");
      const configureSpy = vi.spyOn(renderer, "configureLabelOverlapToggle");
      const controller = new StepController(
        [makeStep({ margin: 4 })],
        { dir: "rtl" },
        undefined,
        undefined,
        renderer,
      );

      controller.run();
      advanceStepRender();
      vi.advanceTimersByTime(1);

      const lastCall = configureSpy.mock.calls.at(-1)?.[0];
      expect(lastCall?.overlaps).toBe(true);
      expect(lastCall?.viewportWidth).toBe(300);

      // The close button lives in the top-left corner in RTL - the toggle
      // must not be positioned on top of it.
      const closeButtonRect = { top: 0, right: 60, bottom: 60, left: 0 };
      const half = LABEL_TOGGLE_BUTTON_SIZE_PX / 2;
      const toggleRect = {
        top: lastCall!.anchorY - half,
        bottom: lastCall!.anchorY + half,
        left: lastCall!.anchorX - half,
        right: lastCall!.anchorX + half,
      };
      const overlapsCloseButton =
        toggleRect.left < closeButtonRect.right &&
        toggleRect.right > closeButtonRect.left &&
        toggleRect.top < closeButtonRect.bottom &&
        toggleRect.bottom > closeButtonRect.top;

      expect(overlapsCloseButton).toBe(false);

      controller.destroy();
    });

    it("resets the label to visible when moving to the next step", () => {
      window.innerWidth = 300;
      window.innerHeight = 300;
      addTarget();
      const controller = new StepController([
        makeStep({ margin: 4, event: "next", eventType: "next" }),
        makeStep({ margin: 4, selector: ".target" }),
      ]);

      controller.run();
      advanceStepRender();
      // Both steps use the same tiny-viewport/small-margin setup, so both
      // take the "oversized" label path (450ms presentation delay instead
      // of the usual 400ms) - wait for the real label element to replace
      // the in-flight measurement placeholder before interacting with it.
      vi.advanceTimersByTime(LEGACY_OVERSIZED_LABEL_DELAY_MS);

      document.querySelector<HTMLElement>(".enjoyhint_label_toggle_btn")!.click();
      let label = document.querySelector<HTMLElement>(".enjoy_hint_label")!;
      expect(label.style.opacity).toBe("0");

      controller.trigger("next");
      advanceStepRender();
      vi.advanceTimersByTime(LEGACY_OVERSIZED_LABEL_DELAY_MS);

      label = document.querySelector<HTMLElement>(".enjoy_hint_label")!;
      expect(label.style.opacity).toBe("");

      controller.destroy();
    });
  });
});
