import { DomAdapter } from "./DomAdapter";
import { EventBus } from "./EventBus";
import { getElementViewportRect, getElementWindow, getViewportSize } from "./elementViewport";
import { ScrollHelperService } from "./ScrollHelperService";
import { OverlayRenderer } from "./overlay/OverlayRenderer";
import { LabelPlacementService, type LabelPlacement } from "./overlay/LabelPlacementService";
import { LabelOverlapToggleService, LABEL_TOGGLE_BUTTON_SIZE_PX } from "./overlay/LabelOverlapToggleService";
import {
  LEGACY_DEFAULT_SCROLL_SPEED_MS,
  getLegacyStepRenderDelay,
} from "./stepTiming";
import { collapsedSpotlightUpdate } from "./overlay/SvgMaskSpotlight";
import { GeometryService } from "./overlay/GeometryService";
import type { SpotlightRect, TextDirection, RequiredCallbacks, EnjoyHintOptions, NormalizedStep } from "./types";
import { mergeButtonConfig } from "./mergeButtonConfig";

type Disposer = () => void;

export class StepController {
  private readonly callbacks: RequiredCallbacks & EnjoyHintOptions;
  private readonly dom: DomAdapter;
  private readonly eventBus: EventBus;
  private readonly renderer: OverlayRenderer;
  private readonly dir: TextDirection;
  private currentStep = 0;
  private previousBodyOverflow = "";
  private locked = false;
  private resizeHandlerInstalled = false;
  private stepDisposers: Disposer[] = [];
  private lifecycleDisposers: Disposer[] = [];
  private stepToken = 0;

  constructor(
    private steps: NormalizedStep[] = [],
    options: EnjoyHintOptions = {},
    dom: DomAdapter = new DomAdapter(),
    eventBus: EventBus = new EventBus(),
    renderer: OverlayRenderer = new OverlayRenderer(
      document.body,
      options.backgroundColor,
      options.dir ?? "ltr",
    ),
  ) {
    this.callbacks = {
      onStart: options.onStart ?? (() => {}),
      onEnd: options.onEnd ?? (() => {}),
      onSkip: options.onSkip ?? (() => {}),
      onNext: options.onNext ?? (() => {}),
      ...options,
    };
    this.dom = dom;
    this.eventBus = eventBus;
    this.renderer = renderer;
    this.dir = options.dir ?? "ltr";
    this.renderer.onNextClick(() => this.next());
    this.renderer.onPrevClick(() => this.previous());
    this.renderer.onSkipClick(() => this.stop());
  }

  setSteps(steps: NormalizedStep[]): void {
    this.steps = steps;
    this.currentStep = 0;
    this.cleanupStep();
  }

  run(): void {
    this.currentStep = 0;
    this.callbacks.onStart();
    this.start();
  }

  resume(): void {
    this.start();
  }

  reRunScript(currentStep: number): void {
    this.currentStep = currentStep;
    this.start();
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  setCurrentStep(currentStep: number): void {
    this.currentStep = currentStep;
  }

  trigger(eventName: string): void {
    if (eventName === "next") {
      this.next();
      return;
    }

    if (eventName === "skip") {
      this.stop();
      return;
    }

    this.eventBus.trigger(eventName);
  }

  stop(): void {
    this.callbacks.onSkip();
    this.destroy();
  }

  clear(): void {
    this.cleanupStep();
    this.renderer.hide();
  }

  destroy(): void {
    this.cleanupStep();
    this.lifecycleDisposers.splice(0).forEach((dispose) => dispose());
    this.resizeHandlerInstalled = false;
    this.renderer.destroy();
    this.restoreBodyLock();
  }

  private start(): void {
    this.lockBody();
    this.installLifecycleHandlers();
    this.renderStep();
  }

  private renderStep(): void {
    this.cleanupStep();
    const token = this.nextStepToken();

    const step = this.steps[this.currentStep];
    if (!step) {
      this.finish();
      return;
    }

    if (step.onBeforeStart?.() === false) {
      this.currentStep += 1;
      this.renderStep();
      return;
    }

    this.callbacks.onNext();

    const scheduleStep = () => this.scheduleCurrentStep(step, token);

    if (step.timeout && step.timeout > 0) {
      this.scheduleStepTimeout(scheduleStep, step.timeout);
    } else {
      scheduleStep();
    }
  }

  private scheduleCurrentStep(step: NormalizedStep, token: number): void {
    if (!this.isCurrentStepToken(token)) {
      return;
    }

    if (!step.selector) {
      this.scheduleStepTimeout(() => {
        if (!this.isCurrentStepToken(token)) {
          return;
        }

        this.renderTargetlessOverlay(step);
        this.bindStepEvents(step, null);
      }, getLegacyStepRenderDelay(LEGACY_DEFAULT_SCROLL_SPEED_MS));
      return;
    }

    const target = this.dom.query(step.selector);
    if (!target) {
      this.finish();
      return;
    }

    const scrollSpeed = this.maybeScrollToTarget(target, step);

    this.scheduleStepTimeout(() => {
      if (!this.isCurrentStepToken(token)) {
        return;
      }

      this.renderOverlay(step, target, this.dom.getBoundingClientRect(target));
      this.installDialogClosingHandler(target);
      this.bindStepEvents(step, target);
    }, getLegacyStepRenderDelay(scrollSpeed));
  }

  private maybeScrollToTarget(target: Element, step: NormalizedStep): number {
    const elementWindow = getElementWindow(target);
    const localRect = target.getBoundingClientRect();
    const viewportRect =
      elementWindow === window ? localRect : getElementViewportRect(target);
    const needsParentScroll = ScrollHelperService.isRectOutsideViewport(viewportRect, window);
    const needsIframeScroll =
      elementWindow !== window && ScrollHelperService.isRectOutsideViewport(localRect, elementWindow);
    const needsScroll = needsParentScroll || needsIframeScroll;
    const scrollSpeed = needsScroll
      ? step.scrollAnimationSpeed ?? LEGACY_DEFAULT_SCROLL_SPEED_MS
      : LEGACY_DEFAULT_SCROLL_SPEED_MS;

    if (needsScroll) {
      this.renderer.mount();
      this.renderer.prepareForScroll();
      const cancelScroll = ScrollHelperService.scrollToElement(target, scrollSpeed);
      this.stepDisposers.push(cancelScroll);
    }

    return scrollSpeed;
  }

  private renderOverlay(
    step: NormalizedStep,
    target: Element,
    targetRect = this.dom.getBoundingClientRect(target),
    options: { immediate?: boolean } = {},
  ): void {
    const spotlight = GeometryService.computeStepSpotlight(step, targetRect);

    this.renderer.mount();
    this.renderer.setStepClass(this.currentStep + 1);
    this.renderer.show();
    this.renderer.renderSpotlight(
      {
        shape: step.shape ?? "rect",
        x: spotlight.left,
        y: spotlight.top,
        width: spotlight.right - spotlight.left,
        height: spotlight.bottom - spotlight.top,
        radius: step.shape === "circle" ? (spotlight.right - spotlight.left) / 2 : step.radius,
      },
      options,
    );
    this.renderButtons(step);
    this.renderLabel(step, spotlight, options);
  }

  private renderTargetlessOverlay(
    step: NormalizedStep,
    options: { immediate?: boolean } = {},
  ): void {
    const viewport = getViewportSize();

    this.renderer.mount();
    this.renderer.setStepClass(this.currentStep + 1);
    this.renderer.show();
    this.renderer.clearStepPresentation();
    this.renderer.renderSpotlight(collapsedSpotlightUpdate(), { ...options, immediate: true });

    this.renderButtons(step);

    const { width: labelWidth, height: labelHeight } = this.renderer.measureLabel(
      step.description,
    );
    const labelX = Math.round((viewport.width - labelWidth) / 2);
    const labelY = Math.round((viewport.height - labelHeight) / 2);

    this.renderer.scheduleLabelPresentation(
      step.description,
      { x: labelX, y: labelY },
      { oversized: false },
    );

    this.scheduleStepTimeout(() => {
      this.renderer.positionButtons({
        labelX,
        labelY,
        labelWidth,
        labelHeight,
        xFrom: labelX + labelWidth / 2,
        yFrom: labelY + labelHeight,
        xTo: labelX + labelWidth / 2,
        yTo: labelY + labelHeight,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      });

      this.renderer.configureLabelOverlapToggle({
        overlaps: false,
        anchorX: 0,
        anchorY: 0,
        labelLeft: 0,
        labelWidth: 0,
        resetHidden: !options.immediate,
      });
    }, 0);
  }

  private renderLabel(
    step: NormalizedStep,
    spotlight: SpotlightRect,
    options: { immediate?: boolean } = {},
  ): void {
    const viewport = getViewportSize();
    const { placement, labelWidth, labelHeight, isOversized } = this.computeLabelLayout(
      step,
      spotlight,
      viewport,
    );

    this.renderer.scheduleLabelPresentation(step.description, placement.label, {
      oversized: isOversized,
      maxWidthPx: isOversized ? undefined : placement.label.width,
    });

    if (!isOversized) {
      this.renderer.scheduleArrowPresentation({
        xFrom: placement.arrow.xFrom,
        yFrom: placement.arrow.yFrom,
        xTo: placement.arrow.xTo,
        yTo: placement.arrow.yTo,
        byTopSide: placement.arrow.byTopSide,
        arrowColor: step.arrowColor,
      });
    }

    this.scheduleStepTimeout(() => {
      this.positionLabelChrome({
        step,
        spotlight,
        viewport,
        placement,
        labelWidth,
        labelHeight,
        isOversized,
        resetHidden: !options.immediate,
      });
    }, 0);
  }

  private computeLabelLayout(
    step: NormalizedStep,
    spotlight: SpotlightRect,
    viewport: { width: number; height: number },
  ) {
    const spotlightWidth = spotlight.right - spotlight.left;
    const spotlightHeight = spotlight.bottom - spotlight.top;
    const shape = {
      type: step.shape ?? "rect",
      centerX: spotlight.centerX,
      centerY: spotlight.centerY,
      width: spotlightWidth,
      height: spotlightHeight,
      radius: step.shape === "circle" ? spotlightWidth / 2 : step.radius,
    } as const;

    let { width: labelWidth, height: labelHeight } = this.renderer.measureLabel(step.description);
    let placement = LabelPlacementService.computeLabelPlacement({
      viewport,
      label: { width: labelWidth, height: labelHeight },
      shape,
    });

    // A side placement may have capped the label narrower than it naturally
    // measured, to keep the arrow's target-facing endpoint from being
    // swallowed by the label once it's clamped on-screen (see
    // LabelPlacementService.ts). Re-measure at that narrower width - this reflows
    // the text taller, exactly like a real browser reflowing an
    // absolutely-positioned label - and recompute the placement so the
    // arrow/buttons agree with what will actually be rendered.
    if (placement.label.width < labelWidth) {
      const reflowed = this.renderer.measureLabel(step.description, placement.label.width);
      labelWidth = reflowed.width;
      labelHeight = reflowed.height;
      placement = LabelPlacementService.computeLabelPlacement({
        viewport,
        label: { width: labelWidth, height: labelHeight },
        shape,
      });
    }

    return {
      placement,
      labelWidth,
      labelHeight,
      isOversized: placement.side === "oversized",
    };
  }

  private positionLabelChrome(input: {
    step: NormalizedStep;
    spotlight: SpotlightRect;
    viewport: { width: number; height: number };
    placement: LabelPlacement;
    labelWidth: number;
    labelHeight: number;
    isOversized: boolean;
    resetHidden: boolean;
  }): void {
    const { spotlight, viewport, placement, labelWidth, labelHeight, isOversized, resetHidden } =
      input;

    this.renderer.positionButtons({
      labelX: placement.label.x,
      labelY: placement.label.y,
      labelWidth,
      labelHeight,
      xFrom: placement.arrow.xFrom,
      yFrom: placement.arrow.yFrom,
      xTo: placement.arrow.xTo,
      yTo: placement.arrow.yTo,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      spotlightTop: spotlight.top,
      spotlightBottom: spotlight.bottom,
      arrowTop: isOversized ? undefined : Math.min(placement.arrow.yFrom, placement.arrow.yTo),
      arrowBottom: isOversized ? undefined : Math.max(placement.arrow.yFrom, placement.arrow.yTo),
    });

    // The overlap toggle only ever applies to oversized, centered,
    // dark-background labels - a normal arrow-pointed label never covers
    // the spotlight or the target, so it never needs to hide.
    if (!isOversized) {
      this.renderer.configureLabelOverlapToggle({
        overlaps: false,
        anchorX: 0,
        anchorY: 0,
        labelLeft: 0,
        labelWidth: 0,
        resetHidden,
      });
      return;
    }

    const labelRect = {
      top: placement.label.y,
      left: placement.label.x,
      right: placement.label.x + placement.label.width,
      bottom: placement.label.y + labelHeight,
    };
    const overlapsSpotlight = LabelOverlapToggleService.doesLabelOverlapSpotlight(labelRect, spotlight);
    const buttonRowRect = this.renderer.getButtonRowRect();
    // Keep clear of the close button's fixed home - top-right in LTR,
    // mirrored to top-left in RTL.
    const closeButtonRect =
      this.dir === "rtl"
        ? { top: 0, right: 60, bottom: 60, left: 0 }
        : { top: 0, right: viewport.width, bottom: 60, left: viewport.width - 60 };
    const avoidRects = [closeButtonRect, ...(buttonRowRect ? [buttonRowRect] : [])];
    const togglePosition = LabelOverlapToggleService.computeToggleButtonPosition({
      labelRect,
      spotlight,
      avoidRects,
      buttonSize: LABEL_TOGGLE_BUTTON_SIZE_PX,
      viewport,
      dir: this.dir,
    });

    this.renderer.configureLabelOverlapToggle({
      overlaps: overlapsSpotlight,
      anchorX: togglePosition.x,
      anchorY: togglePosition.y,
      labelLeft: labelRect.left,
      labelWidth: placement.label.width,
      viewportWidth: viewport.width,
      resetHidden,
    });
  }

  private renderButtons(step: NormalizedStep): void {
    const next = mergeButtonConfig(
      step.nextButton,
      this.callbacks.nextButton,
      this.callbacks.btnNextText,
    );
    const prev = mergeButtonConfig(step.prevButton, this.callbacks.prevButton);
    const skip = mergeButtonConfig(
      step.skipButton,
      this.callbacks.skipButton,
      this.callbacks.btnSkipText,
    );

    this.renderer.configureNextButton(next, "Next");
    this.renderer.configurePrevButton(prev, "Previous");
    this.renderer.configureSkipButton(skip, "Skip");

    if (step.event === "next" || step.eventType === "next" || step.showNext === true) {
      this.renderer.showNext();
    } else {
      this.renderer.hideNext();
    }

    if (this.currentStep > 0 && step.showPrev !== false) {
      this.renderer.showPrev();
    } else {
      this.renderer.hidePrev();
    }

    if (step.showSkip === false) {
      this.renderer.hideSkip();
    } else {
      this.renderer.showSkip();
    }
  }

  private bindStepEvents(step: NormalizedStep, target: Element | null): void {
    if (step.eventType === "auto") {
      if (!target) {
        return;
      }

      if (step.event === "click" && target instanceof HTMLElement) {
        target.click();
      } else {
        target.dispatchEvent(new Event(step.event));
      }
      this.next();
      return;
    }

    if (step.eventType === "custom") {
      this.eventBus.on(step.event, () => this.next());
      this.stepDisposers.push(() => this.eventBus.off(step.event));
      return;
    }

    if (step.eventType === "next" || step.event === "next") {
      return;
    }

    const eventName = step.event === "key" ? "keydown" : step.event;
    const handler = (event: Event) => {
      if (step.keyCode !== undefined && this.getEventKeyCode(event) !== step.keyCode) {
        return;
      }

      this.next();
    };

    if (!target) {
      this.stepDisposers.push(this.dom.addDocumentEvent(eventName, handler));
      return;
    }

    const eventTarget = step.eventSelector ? this.dom.query(step.eventSelector) : target;
    if (!eventTarget) {
      return;
    }

    this.stepDisposers.push(this.dom.addEvent(eventTarget, eventName, handler));
  }

  private next(): void {
    if (this.currentStep >= this.steps.length) {
      return;
    }

    this.cleanupStep();
    this.currentStep += 1;
    this.renderStep();
  }

  private previous(): void {
    if (this.currentStep <= 0) {
      return;
    }

    this.cleanupStep();
    this.currentStep -= 1;
    this.renderStep();
  }

  private finish(): void {
    this.currentStep = this.steps.length;
    this.callbacks.onEnd();
    this.destroy();
  }

  private cleanupStep(): void {
    this.invalidateStepToken();
    this.renderer.cancelLabelArrowTransition();
    this.stepDisposers.splice(0).forEach((dispose) => dispose());
  }

  private scheduleStepTimeout(callback: () => void, delay: number): void {
    const timeoutId = window.setTimeout(callback, delay);
    this.stepDisposers.push(() => window.clearTimeout(timeoutId));
  }

  private lockBody(): void {
    if (this.locked) {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    this.lifecycleDisposers.push(
      this.dom.addDocumentEvent("touchmove", this.preventTouchMove, { passive: false }),
    );
    this.locked = true;
  }

  private restoreBodyLock(): void {
    if (!this.locked) {
      return;
    }

    document.body.style.overflow = this.previousBodyOverflow;
    this.locked = false;
  }

  private installLifecycleHandlers(): void {
    if (this.resizeHandlerInstalled) {
      return;
    }

    this.lifecycleDisposers.push(
      this.dom.addWindowEvent("resize", () => this.refreshCurrentStep()),
    );
    this.resizeHandlerInstalled = true;
  }

  private installDialogClosingHandler(target: Element): void {
    const dialog = this.dom.findParentByTagName(target, "MD-DIALOG");
    if (!dialog) {
      return;
    }

    this.stepDisposers.push(
      this.dom.addEvent(dialog, "dialogClosing", () => {
        this.stop();
      }),
    );
  }

  private refreshCurrentStep(): void {
    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }

    if (!step.selector) {
      this.renderTargetlessOverlay(step, { immediate: true });
      return;
    }

    const target = this.dom.query(step.selector);
    if (target) {
      this.renderOverlay(step, target, undefined, { immediate: true });
    }
  }

  private getEventKeyCode(event: Event): number | undefined {
    if (event instanceof KeyboardEvent) {
      return event.keyCode || event.which;
    }

    return undefined;
  }

  private readonly preventTouchMove = (event: Event): void => {
    event.preventDefault();
  };

  private nextStepToken(): number {
    this.stepToken += 1;
    return this.stepToken;
  }

  private invalidateStepToken(): void {
    this.stepToken += 1;
  }

  private isCurrentStepToken(token: number): boolean {
    return this.locked && this.stepToken === token;
  }
}
