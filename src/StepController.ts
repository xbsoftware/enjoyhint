import { DomAdapter } from "./DomAdapter";
import { EventBus } from "./EventBus";
import { getElementViewportRect, getElementWindow } from "./elementViewport";
import { isRectOutsideViewport, scrollToElement } from "./ScrollHelper";
import { OverlayRenderer } from "./overlay/OverlayRenderer";
import { computeLabelPlacement } from "./overlay/labelPlacement";
import {
  LEGACY_DEFAULT_SCROLL_SPEED_MS,
  getLegacyStepRenderDelay,
} from "./stepTiming";
import type { SpotlightRect } from "./types";
import type { EnjoyHintOptions, NormalizedStep } from "./types";

type Disposer = () => void;

type RequiredCallbacks = Required<
  Pick<EnjoyHintOptions, "onStart" | "onEnd" | "onSkip" | "onNext">
>;

export class StepController {
  private readonly callbacks: RequiredCallbacks & EnjoyHintOptions;
  private readonly dom: DomAdapter;
  private readonly eventBus: EventBus;
  private readonly renderer: OverlayRenderer;
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
    renderer: OverlayRenderer = new OverlayRenderer(document.body, options.backgroundColor),
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

    this.callbacks.onNext();
    step.onBeforeStart?.();

    const scheduleStep = () => {
      if (!this.isCurrentStepToken(token)) {
        return;
      }

      const target = this.dom.query(step.selector);
      if (!target) {
        this.finish();
        return;
      }

      const elementWindow = getElementWindow(target);
      const localRect = target.getBoundingClientRect();
      const viewportRect =
        elementWindow === window ? localRect : getElementViewportRect(target);
      const needsParentScroll = isRectOutsideViewport(viewportRect, window);
      const needsIframeScroll =
        elementWindow !== window && isRectOutsideViewport(localRect, elementWindow);
      const needsScroll = needsParentScroll || needsIframeScroll;
      const scrollSpeed = needsScroll
        ? step.scrollAnimationSpeed ?? LEGACY_DEFAULT_SCROLL_SPEED_MS
        : LEGACY_DEFAULT_SCROLL_SPEED_MS;

      if (needsScroll) {
        this.renderer.mount();
        this.renderer.prepareForScroll();
        const cancelScroll = scrollToElement(target, scrollSpeed);
        this.stepDisposers.push(cancelScroll);
      }

      this.scheduleStepTimeout(() => {
        if (!this.isCurrentStepToken(token)) {
          return;
        }

        this.renderOverlay(step, target, this.dom.getBoundingClientRect(target));
        this.installDialogClosingHandler(target);
        this.bindStepEvents(step, target);
      }, getLegacyStepRenderDelay(scrollSpeed));
    };

    if (step.timeout && step.timeout > 0) {
      this.scheduleStepTimeout(scheduleStep, step.timeout);
    } else {
      scheduleStep();
    }
  }

  private renderOverlay(
    step: NormalizedStep,
    target: Element,
    targetRect = this.dom.getBoundingClientRect(target),
    options: { immediate?: boolean } = {},
  ): void {
    const spotlight = this.computeStepSpotlight(step, targetRect);

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
    this.renderLabel(step, spotlight);
  }

  private renderLabel(step: NormalizedStep, spotlight: SpotlightRect): void {
    const viewport = {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight,
    };
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
    let placement = computeLabelPlacement({ viewport, label: { width: labelWidth, height: labelHeight }, shape });

    // A side placement may have capped the label narrower than it naturally
    // measured, to keep the arrow's target-facing endpoint from being
    // swallowed by the label once it's clamped on-screen (see
    // labelPlacement.ts). Re-measure at that narrower width - this reflows
    // the text taller, exactly like a real browser reflowing an
    // absolutely-positioned label - and recompute the placement so the
    // arrow/buttons agree with what will actually be rendered.
    if (placement.label.width < labelWidth) {
      const reflowed = this.renderer.measureLabel(step.description, placement.label.width);
      labelWidth = reflowed.width;
      labelHeight = reflowed.height;
      placement = computeLabelPlacement({ viewport, label: { width: labelWidth, height: labelHeight }, shape });
    }

    const isOversized = placement.side === "oversized";
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
    }, 0);
  }

  private computeStepSpotlight(step: NormalizedStep, targetRect: DOMRect): SpotlightRect {
    const centerX = targetRect.left + Math.round(targetRect.width / 2);
    const centerY = targetRect.top + Math.round(targetRect.height / 2);

    if (step.shape === "circle") {
      let centerX = targetRect.left + Math.round(targetRect.width / 2);
      let centerY = targetRect.top + Math.round(targetRect.height / 2);
      let radius = step.radius ?? Math.round(Math.max(targetRect.width, targetRect.height) / 2) + 5;
      const offsets = {
        top: step.top ?? 0,
        bottom: step.bottom ?? 0,
        left: step.left ?? 0,
        right: step.right ?? 0,
      };
      const half = radius;
      const sides = {
        top: centerY - half + offsets.top,
        bottom: centerY + half - offsets.bottom,
        left: centerX - half + offsets.left,
        right: centerX + half - offsets.right,
      };
      const width = sides.right - sides.left;
      const height = sides.bottom - sides.top;
      radius = Math.round(Math.min(width, height) / 2);
      centerX = sides.left + Math.round(width / 2);
      centerY = sides.top + Math.round(height / 2);

      return {
        top: centerY - radius,
        right: centerX + radius,
        bottom: centerY + radius,
        left: centerX - radius,
        centerX,
        centerY,
      };
    }

    const shapeMargin = step.margin !== undefined ? step.margin : 10;
    const width = targetRect.width + shapeMargin;
    const height = targetRect.height + shapeMargin;
    const halfWidth = Math.round(width / 2);
    const halfHeight = Math.round(height / 2);
    const sides = {
      top: centerY - halfHeight + (step.top ?? 0),
      right: centerX + halfWidth - (step.right ?? 0),
      bottom: centerY + halfHeight - (step.bottom ?? 0),
      left: centerX - halfWidth + (step.left ?? 0),
    };
    const nextWidth = sides.right - sides.left;
    const nextHeight = sides.bottom - sides.top;
    const nextCenterX = sides.left + Math.round(nextWidth / 2);
    const nextCenterY = sides.top + Math.round(nextHeight / 2);
    const nextHalfWidth = Math.round(nextWidth / 2);
    const nextHalfHeight = Math.round(nextHeight / 2);

    return {
      top: nextCenterY - nextHalfHeight,
      right: nextCenterX + nextHalfWidth,
      bottom: nextCenterY + nextHalfHeight,
      left: nextCenterX - nextHalfWidth,
      centerX: nextCenterX,
      centerY: nextCenterY,
    };
  }

  private renderButtons(step: NormalizedStep): void {
    this.renderer.configureNextButton(step.nextButton, this.callbacks.btnNextText ?? "Next");
    this.renderer.configurePrevButton(step.prevButton, "Previous");
    this.renderer.configureSkipButton(step.skipButton, this.callbacks.btnSkipText ?? "Skip");

    if (step.eventType === "next" || step.showNext === true) {
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

  private bindStepEvents(step: NormalizedStep, target: Element): void {
    if (step.eventType === "auto") {
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

    if (step.eventType === "next") {
      return;
    }

    const eventTarget = step.eventSelector ? this.dom.query(step.eventSelector) : target;
    if (!eventTarget) {
      return;
    }

    const eventName = step.event === "key" ? "keydown" : step.event;
    const handler = (event: Event) => {
      if (step.keyCode !== undefined && this.getEventKeyCode(event) !== step.keyCode) {
        return;
      }

      this.next();
    };

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
