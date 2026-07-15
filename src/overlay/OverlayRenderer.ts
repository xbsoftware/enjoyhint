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
import type { ButtonConfig, TextDirection } from "../types";
import {
  LEGACY_LABEL_ARROW_DELAY_MS,
  LEGACY_OVERSIZED_LABEL_DELAY_MS,
} from "../stepTiming";
import { computeLabelHideOffsetPx, LABEL_TOGGLE_BUTTON_SIZE_PX } from "./labelOverlapToggle";
import { VIEWPORT_EDGE_MARGIN_PX } from "./viewportClamp";

export interface LabelPresentationOptions {
  oversized?: boolean;
  maxWidthPx?: number;
}

const LEGACY_OVERSIZED_LABEL_BACKGROUND = "#272A26";

type ClickCallback = () => void;

const SVG_NS = "http://www.w3.org/2000/svg";
const MOBILE_BUTTON_BREAKPOINT_PX = 640;
const MOBILE_NEXT_BUTTON_TEXT = "\u203A";
const MOBILE_PREV_BUTTON_TEXT = "\u2039";
const LEGACY_BUTTON_MIN_WIDTH_PX = 100;
const LEGACY_BUTTON_HEIGHT_PX = 40;
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
    this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
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
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
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

      if (oversized) {
        this.applyOversizedLabelStyles(detachedLabel);
        this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
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
      this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
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
    viewportHeight?: number;
    spotlightTop?: number;
    spotlightBottom?: number;
    arrowTop?: number;
    arrowBottom?: number;
  }): void {
    const nextWidth = this.getSummaryButtonWidth(this.nextButton);
    const prevWidth = this.getSummaryButtonWidth(this.prevButton);
    const skipWidth = this.getSummaryButtonWidth(this.skipButton);
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
    const resolvedPrevWidth = this.getLayoutButtonWidth(
      this.prevButton,
      mobilePrevWidth,
      isMobileViewport,
    );
    const resolvedNextWidth = this.getLayoutButtonWidth(
      this.nextButton,
      mobileNextWidth,
      isMobileViewport,
    );

    let nextLeft = distance + resolvedPrevWidth + 10;
    let skipLeft = distance + resolvedPrevWidth + resolvedNextWidth + 20;

    if (!this.nextVisible) {
      skipLeft = distance + resolvedPrevWidth + 10;
    }

    if (!this.prevVisible) {
      nextLeft = distance;
      skipLeft = distance + resolvedNextWidth + 10;
    }

    const viewportHeight =
      input.viewportHeight ??
      (window.innerHeight || document.documentElement.clientHeight);
    const rowSkipWidth = this.getLayoutButtonWidth(this.skipButton, 0, isMobileViewport);
    const clampedRow = this.clampButtonRowToViewport({
      distance,
      verticalPosition,
      nextLeft,
      skipLeft,
      skipWidth: rowSkipWidth,
      viewportWidth: input.viewportWidth,
      viewportHeight,
      labelY: input.labelY,
      labelHeight: input.labelHeight,
      spotlightTop: input.spotlightTop,
      spotlightBottom: input.spotlightBottom,
      arrowTop: input.arrowTop,
      arrowBottom: input.arrowBottom,
      isMobileViewport,
    });
    if (this.dir === "rtl") {
      const left = clampedRow.distance;
      const skipW = rowSkipWidth;
      const nextW = resolvedNextWidth;
      const prevW = resolvedPrevWidth;
      const skipL = left;
      let nextL: number;
      let prevL: number;

      if (!this.prevVisible) {
        // Skip → Next (no Prev) — mirrors LTR when prev is hidden.
        nextL = left + skipW + 10;
        prevL = nextL;
      } else if (!this.nextVisible) {
        // Skip → Prev (no Next) — mirrors LTR when next is hidden.
        prevL = left + skipW + 10;
        nextL = prevL;
      } else {
        // Skip → Next → Prev
        nextL = left + skipW + 10;
        prevL = left + skipW + nextW + 20;
      }

      const rtlRight = this.prevVisible
        ? prevL + prevW
        : this.nextVisible
          ? nextL + nextW
          : skipL + skipW;
      const ltrRight = clampedRow.skipLeft + skipW;
      // Desktop: row width is order-invariant, so unclamped shift is 0; shift
      // re-anchors to the LTR-clamped right edge when clamp moved the row.
      // Mobile: LTR pins the cluster to the top-left (margin 10); RTL pins it
      // to the top-right instead.
      const shift = isMobileViewport
        ? input.viewportWidth - 10 - rtlRight
        : ltrRight - rtlRight;
      const positionedSkipL = skipL + shift;
      const positionedNextL = nextL + shift;
      const positionedPrevL = prevL + shift;

      this.setButtonPosition(this.skipButton, positionedSkipL, clampedRow.verticalPosition);
      this.setButtonPosition(this.nextButton, positionedNextL, clampedRow.verticalPosition);
      this.setButtonPosition(this.prevButton, positionedPrevL, clampedRow.verticalPosition);
      this.revealPositionedButtons();

      this.buttonRowRect = {
        top: clampedRow.verticalPosition,
        bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
        left: Math.min(positionedSkipL, positionedNextL, positionedPrevL),
        right: Math.max(
          positionedSkipL + skipW,
          positionedNextL + nextW,
          positionedPrevL + prevW,
        ),
      };
    } else {
      this.setButtonPosition(this.prevButton, clampedRow.distance, clampedRow.verticalPosition);
      this.setButtonPosition(this.nextButton, clampedRow.nextLeft, clampedRow.verticalPosition);
      this.setButtonPosition(this.skipButton, clampedRow.skipLeft, clampedRow.verticalPosition);
      this.revealPositionedButtons();

      this.buttonRowRect = {
        top: clampedRow.verticalPosition,
        bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
        left: clampedRow.distance,
        right: clampedRow.skipLeft + rowSkipWidth,
      };
    }
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

    this.labelHideOffsetPx = computeLabelHideOffsetPx(
      { left: input.labelLeft, width: input.labelWidth },
      {
        dir: this.dir,
        viewportWidth: input.viewportWidth ?? window.innerWidth,
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

  private clampButtonRowToViewport(input: {
    distance: number;
    verticalPosition: number;
    nextLeft: number;
    skipLeft: number;
    skipWidth: number;
    viewportWidth: number;
    viewportHeight: number;
    labelY: number;
    labelHeight: number;
    spotlightTop?: number;
    spotlightBottom?: number;
    arrowTop?: number;
    arrowBottom?: number;
    isMobileViewport: boolean;
  }): {
    distance: number;
    verticalPosition: number;
    nextLeft: number;
    skipLeft: number;
  } {
    let {
      distance,
      verticalPosition,
      nextLeft,
      skipLeft,
      skipWidth,
      viewportWidth,
      viewportHeight,
      labelY,
      labelHeight,
      spotlightTop,
      spotlightBottom,
      arrowTop,
      arrowBottom,
      isMobileViewport,
    } = input;

    const minTop = VIEWPORT_EDGE_MARGIN_PX;
    const maxTop = Math.max(minTop, viewportHeight - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX);
    const clampTop = (top: number) => Math.min(Math.max(minTop, top), maxTop);
    const overlapWithBand = (top: number, bandStart: number, bandEnd: number) =>
      Math.max(0, Math.min(top + LEGACY_BUTTON_HEIGHT_PX, bandEnd) - Math.max(top, bandStart));
    // The button row must avoid the label, the spotlight target, and the
    // arrow connecting them: a naive "below the label" position can clear
    // both the label and the spotlight individually while still cutting
    // straight through the arrow curve between them.
    const totalOverlap = (top: number) =>
      overlapWithBand(top, labelY, labelY + labelHeight) +
      overlapWithBand(top, spotlightTop ?? 0, spotlightBottom ?? 0) +
      overlapWithBand(top, arrowTop ?? 0, arrowBottom ?? 0);

    verticalPosition = clampTop(verticalPosition);

    // Mobile buttons are pinned chevrons fixed to the top-left corner by
    // design; they must never be pushed elsewhere to dodge the label or
    // spotlight, regardless of what happens to occupy that corner.
    if (!isMobileViewport && totalOverlap(verticalPosition) > 0) {
      // Something occupies this row; try flipping the button row to
      // whichever side of the label/spotlight has clearance instead of
      // rescue-clamping it on top of them.
      const candidates = [
        clampTop(labelY - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
        clampTop(labelY + labelHeight + VIEWPORT_EDGE_MARGIN_PX),
        verticalPosition,
      ];
      if (spotlightTop !== undefined && spotlightBottom !== undefined) {
        candidates.push(
          clampTop(spotlightTop - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
          clampTop(spotlightBottom + VIEWPORT_EDGE_MARGIN_PX),
        );
      }
      if (arrowTop !== undefined && arrowBottom !== undefined) {
        candidates.push(
          clampTop(arrowTop - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
          clampTop(arrowBottom + VIEWPORT_EDGE_MARGIN_PX),
        );
      }
      verticalPosition = candidates.reduce((best, candidate) =>
        totalOverlap(candidate) < totalOverlap(best) ? candidate : best,
      );
    }

    const rightOverflow =
      skipLeft + skipWidth - (viewportWidth - VIEWPORT_EDGE_MARGIN_PX);
    if (rightOverflow > 0) {
      distance = Math.max(VIEWPORT_EDGE_MARGIN_PX, distance - rightOverflow);
      nextLeft = Math.max(VIEWPORT_EDGE_MARGIN_PX, nextLeft - rightOverflow);
      skipLeft = Math.max(VIEWPORT_EDGE_MARGIN_PX, skipLeft - rightOverflow);
    }

    if (distance < VIEWPORT_EDGE_MARGIN_PX) {
      const shift = VIEWPORT_EDGE_MARGIN_PX - distance;
      distance = VIEWPORT_EDGE_MARGIN_PX;
      nextLeft += shift;
      skipLeft += shift;
    }

    return { distance, verticalPosition, nextLeft, skipLeft };
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

  private getLayoutButtonWidth(
    button: HTMLElement | undefined,
    mobileWidth: number,
    isMobileViewport: boolean,
  ): number {
    if (!button || button.classList.contains("enjoyhint_hide")) {
      return 0;
    }

    if (isMobileViewport) {
      return mobileWidth;
    }

    return Math.max(this.getButtonContentWidth(button), LEGACY_BUTTON_MIN_WIDTH_PX);
  }

  private getSummaryButtonWidth(button: HTMLElement | undefined): number {
    if (!button) {
      return 0;
    }

    return Math.max(this.getButtonContentWidth(button), LEGACY_BUTTON_MIN_WIDTH_PX);
  }

  private getButtonContentWidth(button: HTMLElement | undefined): number {
    if (!button) {
      return 0;
    }

    if (button.classList.contains("enjoyhint_hide")) {
      const minWidth = Number.parseFloat(window.getComputedStyle(button).minWidth);
      return Number.isFinite(minWidth) && minWidth > 0 ? minWidth : LEGACY_BUTTON_MIN_WIDTH_PX;
    }

    const previousVisibility = button.style.visibility;
    if (previousVisibility === "hidden") {
      button.style.visibility = "visible";
    }

    const style = window.getComputedStyle(button);
    const width =
      button.offsetWidth -
      (Number.parseFloat(style.paddingLeft) || 0) -
      (Number.parseFloat(style.paddingRight) || 0) -
      (Number.parseFloat(style.borderLeftWidth) || 0) -
      (Number.parseFloat(style.borderRightWidth) || 0);

    button.style.visibility = previousVisibility;
    return width > 0 ? width : 0;
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
