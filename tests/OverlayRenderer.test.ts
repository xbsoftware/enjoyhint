import { afterEach, describe, expect, it, vi } from "vitest";
import { OverlayRenderer } from "../src/overlay/OverlayRenderer";

describe("OverlayRenderer", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("mounts and controls the overlay shell", () => {
    const renderer = new OverlayRenderer();
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const onSkip = vi.fn();

    renderer.onNextClick(onNext);
    renderer.onPrevClick(onPrev);
    renderer.onSkipClick(onSkip);
    renderer.mount();

    const root = document.querySelector(".enjoyhint");
    expect(root).toBeInstanceOf(HTMLElement);
    expect(root?.classList.contains("enjoyhint_hide")).toBe(true);
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(root?.querySelector("#kinetic_container")).toBeInstanceOf(HTMLElement);
    expect(root?.querySelector("canvas")).toBeNull();
    expect(root?.querySelector(".enjoyhint_svg_wrapper")).toBeInstanceOf(HTMLElement);
    const marker = root?.querySelector("svg.enjoyhint_svg defs marker");
    expect(marker).toBeInstanceOf(Element);
    expect(marker?.tagName.toLowerCase()).toBe("marker");
    expect(root?.querySelectorAll(".enjoyhint_disable_events")).toHaveLength(4);

    const closeButton = root?.querySelector<HTMLElement>(".enjoyhint_close_btn");
    expect(closeButton?.style.top).toBe("10px");
    expect(closeButton?.style.right).toBe("10px");

    renderer.show();
    expect(root?.classList.contains("enjoyhint_hide")).toBe(false);

    root?.querySelector<HTMLElement>(".enjoyhint_next_btn")?.click();
    root?.querySelector<HTMLElement>(".enjoyhint_prev_btn")?.click();
    root?.querySelector<HTMLElement>(".enjoyhint_skip_btn")?.click();
    root?.querySelector<HTMLElement>(".enjoyhint_close_btn")?.click();

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onSkip).toHaveBeenCalledTimes(2);
    expect(root?.classList.contains("enjoyhint_hide")).toBe(true);

    renderer.destroy();
    expect(document.querySelector(".enjoyhint")).toBeNull();
  });

  it("creates the label container on demand", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();

    const labelContainer = renderer.getLabelContainer();

    expect(labelContainer).toBeInstanceOf(HTMLElement);
    expect(labelContainer.className).toBe("enjoy_hint_label");
    expect(labelContainer.id).toBe("enjoyhint_label");
    expect(document.querySelectorAll(".enjoy_hint_label")).toHaveLength(1);
    expect(renderer.getLabelContainer()).toBe(labelContainer);

    renderer.destroy();
  });

  it("toggles next, previous, and skip button visibility", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const prevButton = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");
    const skipButton = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");

    renderer.hideNext();
    renderer.hidePrev();
    renderer.hideSkip();
    expect(nextButton?.classList.contains("enjoyhint_hide")).toBe(true);
    expect(prevButton?.classList.contains("enjoyhint_hide")).toBe(true);
    expect(skipButton?.classList.contains("enjoyhint_hide")).toBe(true);

    renderer.showNext();
    renderer.showPrev();
    renderer.showSkip();
    expect(nextButton?.classList.contains("enjoyhint_hide")).toBe(false);
    expect(prevButton?.classList.contains("enjoyhint_hide")).toBe(false);
    expect(skipButton?.classList.contains("enjoyhint_hide")).toBe(false);

    renderer.destroy();
  });

  it("stops blocker click propagation immediately", () => {
    const renderer = new OverlayRenderer();
    const laterListener = vi.fn();

    renderer.mount();
    const blocker = document.querySelector<HTMLElement>(".enjoyhint_disable_events");
    blocker?.addEventListener("click", laterListener);
    blocker?.click();

    expect(laterListener).not.toHaveBeenCalled();

    renderer.destroy();
  });

  it("renders a spotlight with an SVG mask", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.renderSpotlight({ shape: "rect", x: 50, y: 60, width: 100, height: 80, radius: 4 }, { immediate: true });

    const root = document.querySelector(".enjoyhint");
    expect(root?.querySelector("canvas")).toBeNull();
    const mask = root?.querySelector("#kinetic_container svg mask[id^='enjoyhint-spotlight-mask-']");
    expect(mask).not.toBeNull();
    expect(root?.querySelector("svg mask rect[data-enjoyhint-spotlight-hole]")).not.toBeNull();
    expect(root?.querySelector(`[mask="url(#${mask?.id})"]`)).not.toBeNull();

    renderer.destroy();
  });

  it("updates blocker positions when rendering a spotlight", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.renderSpotlight({ shape: "rect", x: 50, y: 60, width: 100, height: 80, radius: 4 }, { immediate: true });

    const blockers = document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events");
    expect(blockers).toHaveLength(4);
    expect(blockers[0]?.style.height).toBe("60px");
    expect(blockers[1]?.style.top).toBe("140px");
    expect(blockers[2]?.style.width).toBe("50px");
    expect(blockers[3]?.style.left).toBe("150px");

    renderer.renderSpotlight({ shape: "circle", x: 20, y: 30, width: 40, height: 40, radius: 20 }, { immediate: true });

    expect(blockers[0]?.style.height).toBe("30px");
    expect(blockers[1]?.style.top).toBe("70px");
    expect(blockers[2]?.style.width).toBe("20px");
    expect(blockers[3]?.style.left).toBe("60px");

    renderer.destroy();
  });

  it("updates blockers to the final rect while spotlight animation runs", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    const blockers = document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events");
    blockers.forEach((blocker) => {
      blocker.style.width = "2000px";
      blocker.style.height = "1500px";
    });

    renderer.renderSpotlight({ shape: "rect", x: 80, y: 90, width: 120, height: 70, radius: 4 });

    expect(blockers[0]?.style.height).toBe("90px");
    expect(blockers[1]?.style.top).toBe("160px");
    expect(blockers[2]?.style.width).toBe("80px");
    expect(blockers[3]?.style.left).toBe("200px");

    renderer.destroy();
  });

  it("uses a unique spotlight mask id for each renderer instance", () => {
    const firstContainer = document.createElement("div");
    const secondContainer = document.createElement("div");
    document.body.append(firstContainer, secondContainer);
    const firstRenderer = new OverlayRenderer(firstContainer);
    const secondRenderer = new OverlayRenderer(secondContainer);

    firstRenderer.renderSpotlight({ shape: "rect", x: 10, y: 20, width: 30, height: 40 }, { immediate: true });
    secondRenderer.renderSpotlight({ shape: "rect", x: 50, y: 60, width: 70, height: 80 }, { immediate: true });

    const masks = document.querySelectorAll<SVGMaskElement>("#kinetic_container svg mask[id^='enjoyhint-spotlight-mask-']");
    expect(masks).toHaveLength(2);
    expect(masks[0]?.id).not.toBe(masks[1]?.id);
    expect(firstContainer.querySelector(`[mask="url(#${masks[0]?.id})"]`)).not.toBeNull();
    expect(secondContainer.querySelector(`[mask="url(#${masks[1]?.id})"]`)).not.toBeNull();

    firstRenderer.destroy();
    secondRenderer.destroy();
    firstContainer.remove();
    secondContainer.remove();
  });

  it("measures label size without replacing the visible label", () => {
    vi.useFakeTimers();
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.scheduleLabelPresentation("Visible label", { x: 10, y: 20 });
    vi.advanceTimersByTime(400);

    const { width, height } = renderer.measureLabel("Measurement label");
    const label = document.querySelector<HTMLElement>(".enjoy_hint_label");

    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    expect(label?.textContent).toBe("Visible label");
    expect(label?.style.left).toBe("10px");
    expect(label?.style.top).toBe("20px");

    renderer.destroy();
    vi.useRealTimers();
  });

  it("presents oversized labels with legacy dark background and no arrow", () => {
    vi.useFakeTimers();
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.scheduleLabelPresentation("Cramped viewport label", { x: 10, y: 20 }, { oversized: true });

    const root = document.querySelector(".enjoyhint");
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();

    vi.advanceTimersByTime(400);
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);

    vi.advanceTimersByTime(50);
    const label = document.querySelector(".enjoy_hint_label") as HTMLDivElement | null;
    expect(label?.textContent).toBe("Cramped viewport label");
    expect(label?.style.backgroundColor).toBe("rgb(39, 42, 38)");
    expect(label?.style.borderRadius).toBe("20px");
    expect(document.querySelector("#enjoyhint_arrpw_line")).toBeNull();
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(false);

    renderer.destroy();
    vi.useRealTimers();
  });

  it("runs legacy label and arrow presentation timers separately", () => {
    vi.useFakeTimers();
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.scheduleLabelPresentation("First", { x: 10, y: 20 });
    renderer.scheduleArrowPresentation({
      xFrom: 1,
      yFrom: 2,
      xTo: 3,
      yTo: 4,
      byTopSide: "hor",
    });

    const root = document.querySelector(".enjoyhint");
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(document.querySelector(".enjoy_hint_label")).toBeNull();

    vi.advanceTimersByTime(400);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("First");
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(false);
    expect(document.querySelector("#enjoyhint_arrpw_line")).not.toBeNull();

    renderer.scheduleLabelPresentation("Second", { x: 30, y: 40 });
    renderer.scheduleArrowPresentation({
      xFrom: 5,
      yFrom: 6,
      xTo: 7,
      yTo: 8,
      byTopSide: "ver",
    });

    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("First");

    vi.advanceTimersByTime(400);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Second");
    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(false);

    renderer.destroy();
    vi.useRealTimers();
  });

  it("keeps spotlight and arrow svgs transparent to pointer events", () => {
    const renderer = new OverlayRenderer();
    renderer.mount();
    renderer.renderSpotlight({ shape: "circle", x: 20, y: 30, width: 40, height: 40, radius: 20 }, { immediate: true });

    const spotlightSvg = document.querySelector<SVGSVGElement>("#kinetic_container svg");
    const arrowSvg = document.querySelector<SVGSVGElement>(".enjoyhint_svg_wrapper svg.enjoyhint_svg");
    const overlay = document.querySelector<SVGRectElement>("rect[mask^='url(#enjoyhint-spotlight-mask-']");

    expect(spotlightSvg?.getAttribute("pointer-events")).toBe("none");
    expect(arrowSvg?.getAttribute("pointer-events")).toBe("none");
    expect(overlay?.getAttribute("pointer-events")).toBe("none");

    renderer.destroy();
  });

  it("renders spotlight in kinetic_container outside the arrow fade wrapper", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.scheduleArrowPresentation({
      xFrom: 1,
      yFrom: 2,
      xTo: 3,
      yTo: 4,
      byTopSide: "hor",
    });

    const root = document.querySelector(".enjoyhint");
    const kineticContainer = root?.querySelector(":scope > #kinetic_container");
    const arrowWrapper = root?.querySelector(":scope > .enjoyhint_svg_wrapper");

    expect(root?.classList.contains("enjoyhint_svg_transparent")).toBe(true);
    expect(kineticContainer?.querySelector("svg")).toBeInstanceOf(SVGSVGElement);
    expect(arrowWrapper?.querySelector("svg.enjoyhint_svg")).toBeInstanceOf(SVGSVGElement);
    expect(kineticContainer?.closest(".enjoyhint_svg_wrapper")).toBeNull();

    renderer.destroy();
  });

  it("keeps navigation buttons hidden until they are positioned", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.showNext();
    renderer.showSkip();

    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const skipButton = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");

    expect(nextButton?.style.visibility).toBe("hidden");
    expect(skipButton?.style.visibility).toBe("hidden");
    expect(nextButton?.style.left).toBe("");
    expect(nextButton?.style.top).toBe("");

    renderer.positionButtons({
      labelX: 200,
      labelY: 300,
      labelWidth: 250,
      labelHeight: 100,
      xFrom: 180,
      yFrom: 250,
      xTo: 220,
      yTo: 350,
      viewportWidth: 1280,
    });

    expect(nextButton?.style.visibility).toBe("visible");
    expect(skipButton?.style.visibility).toBe("visible");
    expect(nextButton?.style.left).not.toBe("");
    expect(nextButton?.style.top).not.toBe("");

    renderer.destroy();
  });

  it("pins prev/next buttons to the top-left corner with chevrons on mobile", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.configureNextButton(undefined, "Next");
    renderer.configurePrevButton(undefined, "Previous");
    renderer.showNext();
    renderer.showPrev();
    renderer.positionButtons({
      labelX: 200,
      labelY: 300,
      labelWidth: 250,
      labelHeight: 100,
      xFrom: 180,
      yFrom: 250,
      xTo: 220,
      yTo: 350,
      viewportWidth: 375,
    });

    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const prevButton = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");

    expect(prevButton?.textContent).toBe("\u2039");
    expect(nextButton?.textContent).toBe("\u203A");
    expect(prevButton?.style.left).toBe("10px");
    expect(prevButton?.style.top).toBe("10px");
    expect(nextButton?.style.top).toBe("10px");
    expect(Number.parseFloat(nextButton?.style.left ?? "0")).toBeGreaterThan(10);

    renderer.destroy();
  });

  it("always pins mobile buttons to the top-left corner even when the label occupies that corner", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.configureNextButton(undefined, "Next");
    renderer.configurePrevButton(undefined, "Previous");
    renderer.showNext();
    renderer.showPrev();

    // Reproduces a real case (example1 "click .btn-success" step at
    // 570x450): the label sits right at the top of the screen, in the same
    // corner mobile nav buttons are pinned to. The overlap-avoidance logic
    // built for desktop label/button placement must not push the mobile
    // buttons out of their fixed corner.
    renderer.positionButtons({
      labelX: 129.140625,
      labelY: 30.265625,
      labelWidth: 311.703125,
      labelHeight: 114.21875,
      xFrom: 180,
      yFrom: 30.265625,
      xTo: 220,
      yTo: 350,
      viewportWidth: 570,
      viewportHeight: 450,
    });

    const prevButton = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");
    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");

    expect(prevButton?.style.top).toBe("10px");
    expect(nextButton?.style.top).toBe("10px");
    expect(prevButton?.style.left).toBe("10px");

    renderer.destroy();
  });

  it("keeps navigation buttons inside the viewport on short screens", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.showNext();
    renderer.showPrev();
    renderer.showSkip();
    renderer.positionButtons({
      labelX: 10,
      labelY: 420,
      labelWidth: 250,
      labelHeight: 20,
      xFrom: 135,
      yFrom: 420,
      xTo: 200,
      yTo: 300,
      viewportWidth: 1280,
      viewportHeight: 500,
    });

    const skipButton = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");
    const top = Number.parseFloat(skipButton?.style.top ?? "0");

    expect(top).toBeLessThanOrEqual(450);

    renderer.destroy();
  });

  it("flips the button row above the label instead of overlapping it on short screens", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.showNext();
    renderer.showPrev();
    renderer.showSkip();

    const labelY = 440;
    const labelHeight = 60;
    renderer.positionButtons({
      labelX: 400,
      labelY,
      labelWidth: 250,
      labelHeight,
      xFrom: 400,
      yFrom: labelY,
      xTo: 600,
      yTo: 300,
      viewportWidth: 1280,
      viewportHeight: 500,
    });

    const buttons = ["next", "prev", "skip"].map((name) =>
      document.querySelector<HTMLElement>(`.enjoyhint_${name}_btn`),
    );

    for (const button of buttons) {
      const top = Number.parseFloat(button?.style.top ?? "0");
      const bottom = top + 40;
      const noOverlap = bottom <= labelY || top >= labelY + labelHeight;

      expect(noOverlap).toBe(true);
      expect(top).toBeGreaterThanOrEqual(0);
    }

    renderer.destroy();
  });

  it("avoids placing the button row on top of the spotlight target", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.showNext();
    renderer.showPrev();
    renderer.showSkip();

    // Reproduces a real oversized-label case (example1 "fix radius" step at
    // a 708x744 viewport, once the target has already scrolled into view):
    // computeLabelPlacement centers the label away from the target, and
    // the naive button-row formula lands the row on top of the spotlight
    // circle even though there is clear space above the label.
    const labelX = 192.71875;
    const labelY = 177.0234375;
    const labelWidth = 322.5625;
    const labelHeight = 219.953125;
    const spotlightTop = 369.015625;
    const spotlightBottom = 529.015625;
    renderer.positionButtons({
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      xFrom: 354,
      yFrom: 396.9765625,
      xTo: 0,
      yTo: 0,
      viewportWidth: 708,
      viewportHeight: 744,
      spotlightTop,
      spotlightBottom,
    });

    const buttons = ["next", "prev", "skip"].map((name) =>
      document.querySelector<HTMLElement>(`.enjoyhint_${name}_btn`),
    );

    for (const button of buttons) {
      const top = Number.parseFloat(button?.style.top ?? "0");
      const bottom = top + 40;
      const overlapsLabel = bottom > labelY && top < labelY + labelHeight;
      const overlapsSpotlight = bottom > spotlightTop && top < spotlightBottom;

      expect(overlapsLabel).toBe(false);
      expect(overlapsSpotlight).toBe(false);
      expect(top).toBeGreaterThanOrEqual(0);
    }

    renderer.destroy();
  });

  it("avoids placing the button row on top of the arrow connecting the label to the target", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.showNext();
    renderer.showPrev();
    renderer.showSkip();

    // Reproduces a real case (example1 "margin" step, target #pr_btm, at a
    // 648x410 viewport): the naive "below the label" position doesn't
    // overlap the label or the spotlight target individually, but it lands
    // squarely on top of the arrow curve connecting them, drawing the
    // button row right through the arrow and its "Next" button label.
    const labelX = 71.6875;
    const labelY = 24.0625;
    const labelWidth = 504.609375;
    const labelHeight = 31.421875;
    const xFrom = 324;
    const yFrom = 55.484375;
    const xTo = 139.5;
    const yTo = 165.484375;
    const spotlightTop = 185.484375;
    const spotlightBottom = 253.484375;

    const arrowTop = Math.min(yFrom, yTo);
    const arrowBottom = Math.max(yFrom, yTo);

    renderer.positionButtons({
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      xFrom,
      yFrom,
      xTo,
      yTo,
      viewportWidth: 648,
      viewportHeight: 410,
      spotlightTop,
      spotlightBottom,
      arrowTop,
      arrowBottom,
    });
    const buttons = ["next", "prev", "skip"].map((name) =>
      document.querySelector<HTMLElement>(`.enjoyhint_${name}_btn`),
    );

    for (const button of buttons) {
      const top = Number.parseFloat(button?.style.top ?? "0");
      const bottom = top + 40;
      const overlapsLabel = bottom > labelY && top < labelY + labelHeight;
      const overlapsSpotlight = bottom > spotlightTop && top < spotlightBottom;
      const overlapsArrow = bottom > arrowTop && top < arrowBottom;

      expect(overlapsLabel).toBe(false);
      expect(overlapsSpotlight).toBe(false);
      expect(overlapsArrow).toBe(false);
      expect(top).toBeGreaterThanOrEqual(0);
    }

    renderer.destroy();
  });

  it("restores desktop button labels outside the mobile breakpoint", () => {
    const renderer = new OverlayRenderer();

    renderer.mount();
    renderer.configureNextButton({ text: "Continue" });
    renderer.configurePrevButton({ text: "Back" });
    renderer.showNext();
    renderer.showPrev();
    renderer.positionButtons({
      labelX: 200,
      labelY: 300,
      labelWidth: 250,
      labelHeight: 100,
      xFrom: 180,
      yFrom: 250,
      xTo: 220,
      yTo: 350,
      viewportWidth: 1024,
    });

    const nextButton = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const prevButton = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");

    expect(nextButton?.textContent).toBe("Continue");
    expect(prevButton?.textContent).toBe("Back");

    renderer.destroy();
  });
});
