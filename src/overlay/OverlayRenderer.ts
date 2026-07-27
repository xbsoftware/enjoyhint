import { EventBlockers } from "./EventBlockers";
import { SvgArrow, type SvgArrowRenderInput } from "./SvgArrow";
import {
  collapsedSpotlightUpdate,
  LEGACY_INITIAL_SPOTLIGHT_STATE,
  LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS,
  SvgMaskSpotlight,
  computeTargetSpotlightState,
  type SpotlightGeometryState,
  type SvgMaskSpotlightUpdate,
} from "./SvgMaskSpotlight";
import type { BlockerRect } from "./GeometryService";
import type { ButtonConfig, TextDirection } from "../types";
import {
  LEGACY_LABEL_ARROW_DELAY_MS,
  LEGACY_OVERSIZED_LABEL_DELAY_MS,
} from "../stepTiming";
import { LabelOverlapToggleService, LABEL_TOGGLE_BUTTON_SIZE_PX } from "./LabelOverlapToggleService";
import { SVG_NS } from "./svgNs";
import { getViewportSize } from "../elementViewport";
import { ButtonLayoutService, type ButtonPositionInput } from "./ButtonLayoutService";

export interface LabelPresentationOptions {
  oversized?: boolean;
  maxWidthPx?: number;
}

const LEGACY_OVERSIZED_LABEL_BACKGROUND = "#272A26";

type ClickCallback = () => void;

const LABEL_MAX_WIDTH_RATIO = 0.8;

const EYE_OPEN_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
  '<circle cx="12" cy="12" r="3"/></svg>';
const EYE_CLOSED_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 ' +
  '18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>' +
  '<line x1="1" y1="1" x2="23" y2="23"/></svg>';

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
  private labelToggleButton?: HTMLDivElement;
  private labelHidden = false;
  private labelHideOffsetPx = 0;
  private buttonRowRect?: { top: number; right: number; bottom: number; left: number };
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

  constructor(
    container: HTMLElement = document.body,
    spotlightFill = "rgba(0,0,0,0.6)",
    private readonly dir: TextDirection = "ltr",
  ) {
    this.container = container;
    this.spotlightFill = spotlightFill;
  }

  mount(): void {
    if (this.root) {
      return;
    }

    const root = document.createElement("div");
    root.className = "enjoyhint enjoyhint_hide enjoyhint_svg_transparent";
    root.setAttribute("dir", this.dir);

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
    if (this.dir === "rtl") {
      this.closeButton.style.left = "10px";
    } else {
      this.closeButton.style.right = "10px";
    }
    this.prevButton = this.createButton("enjoyhint_prev_btn", "Previous", () => {
      this.prevClick();
    });
    this.labelToggleButton = this.createLabelToggleButton(() => {
      this.setLabelHidden(!this.labelHidden);
    });
    this.labelToggleButton.classList.add("enjoyhint_hide");

    root.append(this.skipButton, this.nextButton, this.closeButton, this.prevButton, this.labelToggleButton);
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
    SvgArrow.clearFrom(this.svg);
    this.hideNext();
    this.hidePrev();
    this.hideSkip();
    this.setButtonVisible(this.labelToggleButton, false);
    this.setLabelHidden(false);
  }

  measureLabel(html: string, maxWidthPx?: number): { width: number; height: number } {
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
    const viewportWidth = getViewportSize().width;
    const defaultMaxWidth = Math.floor(viewportWidth * LABEL_MAX_WIDTH_RATIO);
    measure.style.maxWidth = `${maxWidthPx !== undefined ? Math.min(maxWidthPx, defaultMaxWidth) : defaultMaxWidth}px`;
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

  scheduleLabelPresentation(
    html: string,
    position: { x: number; y: number },
    options?: LabelPresentationOptions,
  ): void {
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
    if (options?.maxWidthPx !== undefined) {
      detachedLabel.style.maxWidth = `${options.maxWidthPx}px`;
    }
    detachedLabel.innerHTML = html;

    const oversized = options?.oversized === true;
    if (oversized) {
      this.root.classList.add("enjoyhint_svg_transparent");
    }

    const delay = oversized ? LEGACY_OVERSIZED_LABEL_DELAY_MS : LEGACY_LABEL_ARROW_DELAY_MS;
    this.labelPresentationTimeoutId = window.setTimeout(() => {
      this.labelPresentationTimeoutId = undefined;
      this.root?.querySelector("#enjoyhint_label")?.remove();
      this.labelContainer = undefined;
      this.root?.append(detachedLabel);
      this.labelContainer = detachedLabel;
      this.prepareLabelLinks(detachedLabel);

      if (oversized) {
        this.applyOversizedLabelStyles(detachedLabel);
        SvgArrow.clearFrom(this.svg);
        this.root?.classList.remove("enjoyhint_svg_transparent");
      }

      if (this.labelHidden) {
        this.applyLabelHiddenTransform();
      }
    }, delay);
  }

  scheduleArrowPresentation(input: SvgArrowRenderInput): void {
    if (!this.root) {
      this.mount();
    }

    this.root?.classList.add("enjoyhint_svg_transparent");

    this.arrowPresentationTimeoutId = window.setTimeout(() => {
      this.arrowPresentationTimeoutId = undefined;
      SvgArrow.clearFrom(this.svg);
      this.renderArrow(input);
      this.root?.classList.remove("enjoyhint_svg_transparent");
    }, LEGACY_LABEL_ARROW_DELAY_MS);
  }

  private applyOversizedLabelStyles(label: HTMLDivElement): void {
    label.style.borderRadius = "20px";
    label.style.backgroundColor = LEGACY_OVERSIZED_LABEL_BACKGROUND;
    // Keep transform/opacity in the transition — a background-only value
    // would override the stylesheet and make the hide slide snap instantly.
    label.style.transition =
      "background-color ease-out 0.5s, opacity 400ms cubic-bezier(0.42, 0, 0.58, 1), transform 400ms cubic-bezier(0.42, 0, 0.58, 1)";
  }

  private prepareLabelLinks(label: ParentNode): void {
    label.querySelectorAll("a[href]").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
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
    this.labelToggleButton = undefined;
    this.labelHidden = false;
    this.labelHideOffsetPx = 0;
    this.buttonRowRect = undefined;
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
    this.prepareLabelLinks(label);
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

  positionButtons(input: ButtonPositionInput): void {
    this.buttonRowRect = ButtonLayoutService.positionButtons({
      input,
      nextButton: this.nextButton,
      prevButton: this.prevButton,
      skipButton: this.skipButton,
      nextVisible: this.nextVisible,
      prevVisible: this.prevVisible,
      dir: this.dir,
      nextButtonConfig: this.nextButtonConfig,
      prevButtonConfig: this.prevButtonConfig,
      nextDefaultText: this.nextDefaultText,
      prevDefaultText: this.prevDefaultText,
    });
  }

  /**
   * Bounding box of the last-positioned next/prev/skip button row, in
   * viewport coordinates. Used by the label overlap toggle to steer clear
   * of the buttons in addition to the label and the spotlight.
   */
  getButtonRowRect(): { top: number; right: number; bottom: number; left: number } | undefined {
    return this.buttonRowRect;
  }

  configureLabelOverlapToggle(input: {
    overlaps: boolean;
    anchorX: number;
    anchorY: number;
    labelLeft: number;
    labelWidth: number;
    viewportWidth?: number;
    resetHidden: boolean;
  }): void {
    if (!this.labelToggleButton) {
      return;
    }

    if (input.resetHidden) {
      this.setLabelHidden(false);
    }

    this.labelHideOffsetPx = LabelOverlapToggleService.computeLabelHideOffsetPx(
      { left: input.labelLeft, width: input.labelWidth },
      {
        dir: this.dir,
        viewportWidth: input.viewportWidth ?? getViewportSize().width,
      },
    );

    if (!input.overlaps) {
      this.setButtonVisible(this.labelToggleButton, false);
      this.labelToggleButton.style.left = "";
      this.labelToggleButton.style.top = "";
      if (this.labelHidden) {
        this.setLabelHidden(false);
      }
      return;
    }

    this.labelToggleButton.style.left = `${input.anchorX - LABEL_TOGGLE_BUTTON_SIZE_PX / 2}px`;
    this.labelToggleButton.style.top = `${input.anchorY - LABEL_TOGGLE_BUTTON_SIZE_PX / 2}px`;
    this.setButtonVisible(this.labelToggleButton, true);

    if (this.labelHidden) {
      this.applyLabelHiddenTransform();
    }
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

  private createLabelToggleButton(onClick: () => void): HTMLDivElement {
    const button = document.createElement("div");
    button.className = "enjoyhint_label_toggle_btn";
    button.setAttribute("role", "button");
    button.setAttribute("aria-label", "Hide hint text");
    button.innerHTML = EYE_OPEN_ICON_SVG;
    button.addEventListener("click", onClick);
    return button;
  }

  private setLabelHidden(hidden: boolean): void {
    this.labelHidden = hidden;
    this.labelToggleButton?.classList.toggle("enjoyhint_label_toggle_btn--hidden", hidden);
    this.labelToggleButton?.setAttribute("aria-label", hidden ? "Show hint text" : "Hide hint text");
    if (this.labelToggleButton) {
      this.labelToggleButton.innerHTML = hidden ? EYE_CLOSED_ICON_SVG : EYE_OPEN_ICON_SVG;
    }

    if (hidden) {
      this.applyLabelHiddenTransform();
    } else {
      this.clearLabelHiddenTransform();
    }
  }

  private applyLabelHiddenTransform(): void {
    if (!this.labelContainer) {
      return;
    }

    this.labelContainer.style.transform =
      this.dir === "rtl"
        ? `translateX(${this.labelHideOffsetPx}px)`
        : `translateX(-${this.labelHideOffsetPx}px)`;
    this.labelContainer.style.opacity = "0";
  }

  private clearLabelHiddenTransform(): void {
    if (!this.labelContainer) {
      return;
    }

    this.labelContainer.style.transform = "";
    this.labelContainer.style.opacity = "";
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

  private collapseSpotlight(): void {
    this.renderSpotlight(collapsedSpotlightUpdate());
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
