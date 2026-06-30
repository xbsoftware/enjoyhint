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
});
