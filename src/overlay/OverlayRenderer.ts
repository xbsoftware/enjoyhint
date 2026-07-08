import { EventBlockers } from "./EventBlockers";
import { SvgArrow, type SvgArrowRenderInput } from "./SvgArrow";
import {
  LEGACY_COLLAPSED_SPOTLIGHT_STATE,
  LEGACY_INITIAL_SPOTLIGHT_STATE,
  LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS,
  SvgMaskSpotlight,
  computeTargetSpotlightState,
  type SpotlightGeometryState,
  type SvgMaskSpotlightUpdate,
} from "./SvgMaskSpotlight";
import type { BlockerRect } from "./geometry";
import type { ButtonConfig } from "../types";
import { LEGACY_LABEL_ARROW_DELAY_MS } from "../stepTiming";

type ClickCallback = () => void;

const SVG_NS = "http://www.w3.org/2000/svg";
const MOBILE_BUTTON_BREAKPOINT_PX = 640;
const MOBILE_NEXT_BUTTON_TEXT = "\u203A";
const MOBILE_PREV_BUTTON_TEXT = "\u2039";

export interface SpotlightRenderOptions {
  immediate?: boolean;
  duration?: number;
}

export class OverlayRenderer {
  private readonly container: HTMLElement;
  private readonly spotlightFill: string;
  private root?: HTMLDivElement;
  private spotlightSvg?: SVGSVGElement;
  private svg?: SVGSVGElement;
  private spotlight?: SvgMaskSpotlight;
  private arrow?: SvgArrow;
  private labelContainer?: HTMLDivElement;
  private nextButton?: HTMLDivElement;
  private prevButton?: HTMLDivElement;
  private skipButton?: HTMLDivElement;
  private closeButton?: HTMLDivElement;
  private eventBlockers?: EventBlockers;
  private spotlightAnimationFrame?: number;
  private nextClick: ClickCallback = () => {};
  private prevClick: ClickCallback = () => {};
  private skipClick: ClickCallback = () => {};
  private nextUserClass?: string;
  private prevUserClass?: string;
  private skipUserClass?: string;
  private nextButtonConfig?: ButtonConfig;
  private prevButtonConfig?: ButtonConfig;
  private nextDefaultText = "Next";
  private prevDefaultText = "Previous";
  private nextVisible = true;
  private prevVisible = true;
  private spotlightState: SpotlightGeometryState = { ...LEGACY_INITIAL_SPOTLIGHT_STATE };
  private labelPresentationTimeoutId?: number;
  private arrowPresentationTimeoutId?: number;

  constructor(container: HTMLElement = document.body, spotlightFill = "rgba(0,0,0,0.6)") {
    this.container = container;
    this.spotlightFill = spotlightFill;
  }

  mount(): void {
    if (this.root) {
      return;
    }

    const root = document.createElement("div");
    root.className = "enjoyhint enjoyhint_hide enjoyhint_svg_transparent";

    const svgWrapper = document.createElement("div");
    svgWrapper.className = "enjoyhint_svg_wrapper enjoyhint_svg_transparent";
    root.append(svgWrapper);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "enjoyhint_canvas enjoyhint_svg");
    svg.setAttribute("pointer-events", "none");
    svgWrapper.append(svg);
    this.svg = svg;

    svg.append(this.createMarkerDefs());

    const kineticContainer = document.createElement("div");
    kineticContainer.id = "kinetic_container";
    root.append(kineticContainer);

    const spotlightSvg = document.createElementNS(SVG_NS, "svg");
    spotlightSvg.setAttribute("pointer-events", "none");
    kineticContainer.append(spotlightSvg);
    this.spotlightSvg = spotlightSvg;

    const blockers: HTMLDivElement[] = [];
    for (let index = 0; index < 4; index += 1) {
      const blocker = document.createElement("div");
      blocker.className = "enjoyhint_disable_events";
      blocker.addEventListener("click", this.stopBlockerClick);
      root.append(blocker);
      blockers.push(blocker);
    }
    this.eventBlockers = new EventBlockers(blockers);

    this.skipButton = this.createButton("enjoyhint_skip_btn", "Skip", () => {
      this.hide();
      this.skipClick();
    });
    this.nextButton = this.createButton("enjoyhint_next_btn", "Next", () => {
      this.nextClick();
    });
    this.closeButton = this.createButton("enjoyhint_close_btn", "", () => {
      this.hide();
      this.skipClick();
    });
    this.closeButton.style.top = "10px";
    this.closeButton.style.right = "10px";
    this.prevButton = this.createButton("enjoyhint_prev_btn", "Previous", () => {
      this.prevClick();
    });

    root.append(this.skipButton, this.nextButton, this.closeButton, this.prevButton);
    this.container.append(root);
    this.root = root;
  }

  show(): void {
    this.root?.classList.remove("enjoyhint_hide");
  }

  hide(): void {
    this.root?.classList.add("enjoyhint_hide");
    this.cancelSpotlightAnimation();
    this.spotlightState = { ...LEGACY_INITIAL_SPOTLIGHT_STATE };
    this.spotlight?.update({
      shape: "rect",
      x: LEGACY_INITIAL_SPOTLIGHT_STATE.centerX,
      y: LEGACY_INITIAL_SPOTLIGHT_STATE.centerY,
      width: 0,
      height: 0,
      radius: 0,
      animationFrom: this.spotlightState,
      animationProgress: 1,
    });
  }

  clearStepPresentation(): void {
    this.cancelLabelArrowTransition();
    this.root?.classList.remove("enjoyhint_svg_transparent");
    this.labelContainer?.remove();
    this.labelContainer = undefined;
    this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
    this.hideNext();
    this.hidePrev();
    this.hideSkip();
  }

  measureLabel(html: string): { width: number; height: number } {
    if (!this.root) {
      this.mount();
    }

    if (!this.root) {
      throw new Error("OverlayRenderer could not mount root element");
    }

    const measure = document.createElement("div");
    measure.className = "enjoy_hint_label";
    measure.style.position = "absolute";
    measure.style.left = "0px";
    measure.style.top = "0px";
    measure.innerHTML = html;
    this.root.append(measure);

    const rect = measure.getBoundingClientRect();
    const size = {
      width: rect.width || measure.offsetWidth || 250,
      height: rect.height || measure.offsetHeight || 100,
    };
    measure.remove();
    return size;
  }

  scheduleLabelPresentation(html: string, position: { x: number; y: number }): void {
    if (!this.root) {
      this.mount();
    }

    if (!this.root) {
      throw new Error("OverlayRenderer could not mount root element");
    }

    const detachedLabel = document.createElement("div");
    detachedLabel.className = "enjoy_hint_label";
    detachedLabel.id = "enjoyhint_label";
    detachedLabel.style.position = "absolute";
    detachedLabel.style.left = `${position.x}px`;
    detachedLabel.style.top = `${position.y}px`;
    detachedLabel.innerHTML = html;

    this.labelPresentationTimeoutId = window.setTimeout(() => {
      this.labelPresentationTimeoutId = undefined;
      this.root?.querySelector("#enjoyhint_label")?.remove();
      this.labelContainer = undefined;
      this.root?.append(detachedLabel);
      this.labelContainer = detachedLabel;
    }, LEGACY_LABEL_ARROW_DELAY_MS);
  }

  scheduleArrowPresentation(input: SvgArrowRenderInput): void {
    if (!this.root) {
      this.mount();
    }

    this.root?.classList.add("enjoyhint_svg_transparent");

    this.arrowPresentationTimeoutId = window.setTimeout(() => {
      this.arrowPresentationTimeoutId = undefined;
      this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
      this.renderArrow(input);
      this.root?.classList.remove("enjoyhint_svg_transparent");
    }, LEGACY_LABEL_ARROW_DELAY_MS);
  }

  cancelLabelArrowTransition(): void {
    if (this.labelPresentationTimeoutId !== undefined) {
      window.clearTimeout(this.labelPresentationTimeoutId);
      this.labelPresentationTimeoutId = undefined;
    }

    if (this.arrowPresentationTimeoutId !== undefined) {
      window.clearTimeout(this.arrowPresentationTimeoutId);
      this.arrowPresentationTimeoutId = undefined;
    }
  }

  prepareForScroll(): void {
    this.clearStepPresentation();
    this.collapseSpotlight();
  }

  destroy(): void {
    this.cancelSpotlightAnimation();
    this.cancelLabelArrowTransition();
    this.root?.remove();
    this.root = undefined;
    this.spotlightSvg = undefined;
    this.svg = undefined;
    this.spotlight = undefined;
    this.arrow = undefined;
    this.labelContainer = undefined;
    this.nextButton = undefined;
    this.prevButton = undefined;
    this.skipButton = undefined;
    this.closeButton = undefined;
    this.eventBlockers = undefined;
  }

  onNextClick(cb: ClickCallback): void {
    this.nextClick = cb;
  }

  onPrevClick(cb: ClickCallback): void {
    this.prevClick = cb;
  }

  onSkipClick(cb: ClickCallback): void {
    this.skipClick = cb;
  }

  configureNextButton(config: ButtonConfig | undefined, defaultText = "Next"): void {
    this.nextButtonConfig = config;
    this.nextDefaultText = defaultText;
    this.nextUserClass = this.configureButton(this.nextButton, this.nextUserClass, config, defaultText);
  }

  configurePrevButton(config: ButtonConfig | undefined, defaultText = "Previous"): void {
    this.prevButtonConfig = config;
    this.prevDefaultText = defaultText;
    this.prevUserClass = this.configureButton(this.prevButton, this.prevUserClass, config, defaultText);
  }

  configureSkipButton(config: ButtonConfig | undefined, defaultText = "Skip"): void {
    this.skipUserClass = this.configureButton(this.skipButton, this.skipUserClass, config, defaultText);
  }

  showNext(): void {
    this.setButtonVisible(this.nextButton, true);
  }

  hideNext(): void {
    this.setButtonVisible(this.nextButton, false);
  }

  showPrev(): void {
    this.setButtonVisible(this.prevButton, true);
  }

  hidePrev(): void {
    this.setButtonVisible(this.prevButton, false);
  }

  showSkip(): void {
    this.setButtonVisible(this.skipButton, true);
  }

  hideSkip(): void {
    this.setButtonVisible(this.skipButton, false);
  }

  getLabelContainer(): HTMLDivElement {
    if (!this.root) {
      this.mount();
    }

    if (!this.root) {
      throw new Error("OverlayRenderer could not mount root element");
    }

    if (!this.labelContainer) {
      this.labelContainer = document.createElement("div");
      this.labelContainer.className = "enjoy_hint_label";
      this.labelContainer.id = "enjoyhint_label";
      this.root.append(this.labelContainer);
    }

    return this.labelContainer;
  }

  renderLabel(html: string, position: { x: number; y: number }): HTMLDivElement {
    const label = this.getLabelContainer();
    label.innerHTML = html;
    label.style.position = "absolute";
    label.style.left = `${position.x}px`;
    label.style.top = `${position.y}px`;
    return label;
  }

  renderArrow(input: SvgArrowRenderInput): SVGPathElement {
    if (!this.root) {
      this.mount();
    }

    if (!this.svg) {
      throw new Error("OverlayRenderer could not mount SVG element");
    }

    if (!this.arrow) {
      this.arrow = new SvgArrow(this.svg);
    }

    return this.arrow.render(input);
  }

  positionButtons(input: {
    labelX: number;
    labelY: number;
    labelWidth: number;
    labelHeight: number;
    xFrom: number;
    yFrom: number;
    xTo: number;
    yTo: number;
    viewportWidth: number;
  }): void {
    const nextWidth = this.getButtonContentWidth(this.nextButton);
    const prevWidth = this.getButtonContentWidth(this.prevButton);
    const skipWidth = this.getButtonContentWidth(this.skipButton);
    const summaryButtonWidth = nextWidth + skipWidth + prevWidth + 30;
    let distance = input.labelX - 100;
    let verticalPosition = input.labelY + input.labelHeight + 40;

    if (summaryButtonWidth + input.labelX > input.xTo) {
      distance = input.xTo >= input.xFrom ? input.xTo + 20 : input.labelX + input.labelWidth / 2;
    }

    if (summaryButtonWidth + distance > input.viewportWidth || distance < 0) {
      distance = 10;
      verticalPosition = input.yFrom < input.yTo ? input.labelY - 80 : input.labelY + input.labelHeight + 40;
    }

    const initialDistance = distance;
    const initialVerticalPosition = verticalPosition;
    const isMobileViewport = input.viewportWidth <= MOBILE_BUTTON_BREAKPOINT_PX;

    if (isMobileViewport) {
      distance = 10;
      verticalPosition = 10;
      if (this.nextButton) {
        this.nextButton.textContent = MOBILE_NEXT_BUTTON_TEXT;
      }
      if (this.prevButton) {
        this.prevButton.textContent = MOBILE_PREV_BUTTON_TEXT;
      }
    } else {
      distance = initialDistance;
      verticalPosition = initialVerticalPosition;
      if (this.nextButton) {
        this.nextButton.textContent = this.nextButtonConfig?.text ?? this.nextDefaultText;
      }
      if (this.prevButton) {
        this.prevButton.textContent = this.prevButtonConfig?.text ?? this.prevDefaultText;
      }
    }

    const mobilePrevWidth = this.getButtonContentWidth(this.prevButton);
    const mobileNextWidth = this.getButtonContentWidth(this.nextButton);
    const resolvedPrevWidth = isMobileViewport ? mobilePrevWidth : this.getButtonContentWidth(this.prevButton);
    const resolvedNextWidth = isMobileViewport ? mobileNextWidth : this.getButtonContentWidth(this.nextButton);

    this.setButtonPosition(this.prevButton, distance, verticalPosition);

    let nextLeft = distance + resolvedPrevWidth + 10;
    let skipLeft = distance + resolvedPrevWidth + resolvedNextWidth + 20;

    if (!this.nextVisible) {
      skipLeft = distance + resolvedPrevWidth + 10;
    }

    if (!this.prevVisible) {
      nextLeft = distance;
      skipLeft = distance + resolvedNextWidth + 10;
    }

    this.setButtonPosition(this.nextButton, nextLeft, verticalPosition);
    this.setButtonPosition(this.skipButton, skipLeft, verticalPosition);
    this.revealPositionedButtons();
  }

  setStepClass(stepNumber: number): void {
    if (!this.root) {
      return;
    }

    for (const className of Array.from(this.root.classList)) {
      if (className.startsWith("enjoyhint-step-")) {
        this.root.classList.remove(className);
      }
    }

    this.root.classList.add(`enjoyhint-step-${stepNumber}`);
  }

  renderSpotlight(update: SvgMaskSpotlightUpdate, options: SpotlightRenderOptions = {}): void {
    if (!this.root) {
      this.mount();
    }

    if (!this.spotlightSvg) {
      throw new Error("OverlayRenderer could not mount spotlight SVG element");
    }

    if (!this.spotlight) {
      this.spotlight = new SvgMaskSpotlight(this.spotlightSvg, this.spotlightFill);
    }

    const duration = options.duration ?? LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS;
    if (options.immediate || duration <= 0) {
      this.cancelSpotlightAnimation();
      this.spotlightState = this.spotlight.update({
        ...update,
        animationFrom: this.spotlightState,
        animationProgress: 1,
      });
      this.updateBlockersFromState(this.spotlightState);
      return;
    }

    this.updateBlockers(update);
    this.animateSpotlight(update, duration);
  }

  private updateBlockers(update: SvgMaskSpotlightUpdate): void {
    this.setBlockerRect(this.getBlockerRect(update));
  }

  private updateBlockersFromState(state: SpotlightGeometryState): void {
    const halfWidth = state.width / 2;
    const halfHeight = state.height / 2;

    this.setBlockerRect({
      top: Math.round(state.centerY - halfHeight),
      right: Math.round(state.centerX + halfWidth),
      bottom: Math.round(state.centerY + halfHeight),
      left: Math.round(state.centerX - halfWidth),
    });
  }

  private setBlockerRect(rect: BlockerRect): void {
    this.eventBlockers?.apply(rect);
  }

  private getBlockerRect(update: SvgMaskSpotlightUpdate): BlockerRect {
    if (update.shape === "circle") {
      const radius = update.radius ?? Math.min(update.width, update.height) / 2;
      const centerX = update.x + update.width / 2;
      const centerY = update.y + update.height / 2;

      return {
        top: Math.round(centerY - radius),
        right: Math.round(centerX + radius),
        bottom: Math.round(centerY + radius),
        left: Math.round(centerX - radius),
      };
    }

    return {
      top: Math.round(update.y),
      right: Math.round(update.x + update.width),
      bottom: Math.round(update.y + update.height),
      left: Math.round(update.x),
    };
  }

  private animateSpotlight(update: SvgMaskSpotlightUpdate, duration: number): void {
    if (!this.spotlight) {
      throw new Error("OverlayRenderer could not initialize spotlight");
    }

    this.cancelSpotlightAnimation();
    const startedAt = performance.now();
    const animationFrom = { ...this.spotlightState };
    this.spotlight.update({ ...update, animationFrom, animationProgress: 0 });

    const renderFrame = (timestamp: number): void => {
      if (!this.spotlight) {
        return;
      }

      const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / duration));
      this.spotlightState = this.spotlight.update({ ...update, animationFrom, animationProgress: progress });
      this.updateBlockersFromState(this.spotlightState);

      if (progress < 1) {
        this.spotlightAnimationFrame = this.requestFrame(renderFrame);
      } else {
        this.spotlightState = computeTargetSpotlightState(update);
        this.spotlightAnimationFrame = undefined;
      }
    };

    this.spotlightAnimationFrame = this.requestFrame(renderFrame);
  }

  private createButton(
    className: string,
    text: string,
    onClick: (event: MouseEvent) => void,
  ): HTMLDivElement {
    const button = document.createElement("div");
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  private createMarkerDefs(): SVGDefsElement {
    const defs = document.createElementNS(SVG_NS, "defs");
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrowMarker");
    marker.setAttribute("viewBox", "0 0 36 21");
    marker.setAttribute("refX", "21");
    marker.setAttribute("refY", "10");
    marker.setAttribute("markerUnits", "strokeWidth");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerWidth", "16");
    marker.setAttribute("markerHeight", "12");

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("style", "fill:none; stroke:rgb(255,255,255); stroke-width:2");
    path.setAttribute("d", "M0,0 c30,11 30,9 0,20");
    path.setAttribute("id", "poliline");

    marker.append(path);
    defs.append(marker);
    return defs;
  }

  private setButtonVisible(button: HTMLElement | undefined, visible: boolean): void {
    if (button) {
      button.classList.toggle("enjoyhint_hide", !visible);
      button.style.display = "";
      if (button === this.nextButton || button === this.prevButton || button === this.skipButton) {
        button.style.visibility = visible ? "hidden" : "";
      }
    }

    if (button === this.nextButton) this.nextVisible = visible;
    if (button === this.prevButton) this.prevVisible = visible;
  }

  private setButtonPosition(button: HTMLElement | undefined, left: number, top: number): void {
    if (!button) {
      return;
    }

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
  }

  private revealPositionedButtons(): void {
    for (const button of [this.nextButton, this.prevButton, this.skipButton]) {
      if (button && !button.classList.contains("enjoyhint_hide")) {
        button.style.visibility = "visible";
      }
    }
  }

  private getButtonContentWidth(button: HTMLElement | undefined): number {
    if (!button || button.classList.contains("enjoyhint_hide")) {
      return 0;
    }

    const previousVisibility = button.style.visibility;
    if (previousVisibility === "hidden") {
      button.style.visibility = "visible";
    }

    const computedWidth = Number.parseFloat(window.getComputedStyle(button).width);
    const width =
      computedWidth > 0
        ? computedWidth
        : button.getBoundingClientRect().width || button.offsetWidth || 0;

    button.style.visibility = previousVisibility;
    return width;
  }

  private collapseSpotlight(): void {
    this.renderSpotlight({
      shape: "rect",
      x: LEGACY_COLLAPSED_SPOTLIGHT_STATE.centerX,
      y: LEGACY_COLLAPSED_SPOTLIGHT_STATE.centerY,
      width: LEGACY_COLLAPSED_SPOTLIGHT_STATE.width,
      height: LEGACY_COLLAPSED_SPOTLIGHT_STATE.height,
      radius: LEGACY_COLLAPSED_SPOTLIGHT_STATE.radius,
    });
  }

  private configureButton(
    button: HTMLElement | undefined,
    previousClass: string | undefined,
    config: ButtonConfig | undefined,
    defaultText: string,
  ): string | undefined {
    if (!button) {
      return previousClass;
    }

    if (previousClass) {
      button.classList.remove(...previousClass.split(" ").filter(Boolean));
    }

    const nextClass = config?.className;
    if (nextClass) {
      button.classList.add(...nextClass.split(" ").filter(Boolean));
    }

    button.textContent = config?.text ?? defaultText;
    return nextClass;
  }

  private requestFrame(callback: FrameRequestCallback): number {
    if (globalThis.requestAnimationFrame) {
      return globalThis.requestAnimationFrame(callback);
    }

    return window.setTimeout(() => {
      callback(performance.now());
    }, 16);
  }

  private cancelSpotlightAnimation(): void {
    if (this.spotlightAnimationFrame === undefined) {
      return;
    }

    if (globalThis.cancelAnimationFrame) {
      globalThis.cancelAnimationFrame(this.spotlightAnimationFrame);
    } else {
      window.clearTimeout(this.spotlightAnimationFrame);
    }

    this.spotlightAnimationFrame = undefined;
  }

  private readonly stopBlockerClick = (event: MouseEvent): void => {
    event.stopImmediatePropagation();
  };
}
