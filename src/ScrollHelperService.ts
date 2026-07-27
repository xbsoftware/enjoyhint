import { getElementViewportRect, getElementWindow, getViewportSize } from "./elementViewport";

export class ScrollHelperService {
  public static isRectOutsideViewport(rect: DOMRectReadOnly, targetWindow: Window): boolean {
    const viewportHeight = getViewportSize(targetWindow).height;
    return rect.top < 0 || rect.bottom > viewportHeight;
  }

  public static computeScrollTarget(el: Element): number {
    const targetWindow = getElementWindow(el);
    return ScrollHelperService.computeScrollTargetForRect(el.getBoundingClientRect(), targetWindow);
  }

  public static scrollToElement(
    el: Element,
    speed: number,
    onAfter?: () => void,
  ): () => void {
    const rootWindow = window;
    const elementWindow = getElementWindow(el);
    let cancelled = false;
    const cancels: Array<() => void> = [];

    const cancel = (): void => {
      cancelled = true;
      cancels.forEach((dispose) => dispose());
    };

    const finish = (): void => {
      if (!cancelled) {
        onAfter?.();
      }
    };

    const scrollIframeInner = (): void => {
      if (cancelled) {
        return;
      }

      const localRect = el.getBoundingClientRect();
      cancels.push(
        ScrollHelperService.scrollWindowToY(
          elementWindow,
          ScrollHelperService.computeScrollTargetForRect(localRect, elementWindow),
          speed,
          finish,
        ),
      );
    };

    if (elementWindow !== rootWindow) {
      return ScrollHelperService.scrollCrossFrameElement({
        el,
        rootWindow,
        elementWindow,
        speed,
        cancels,
        scrollIframeInner,
        finish,
        cancel,
      });
    }

    const localRect = el.getBoundingClientRect();
    cancels.push(
      ScrollHelperService.scrollWindowToY(
        elementWindow,
        ScrollHelperService.computeScrollTargetForRect(localRect, elementWindow),
        speed,
        finish,
      ),
    );
    return cancel;
  }

  private static readonly LEGACY_SCROLL_OFFSET = 200;

  private static computeScrollTargetForRect(
    rect: DOMRectReadOnly,
    targetWindow: Window,
  ): number {
    return rect.top + targetWindow.scrollY - ScrollHelperService.LEGACY_SCROLL_OFFSET;
  }

  private static scrollCrossFrameElement(input: {
    el: Element;
    rootWindow: Window;
    elementWindow: Window;
    speed: number;
    cancels: Array<() => void>;
    scrollIframeInner: () => void;
    finish: () => void;
    cancel: () => void;
  }): () => void {
    const { el, rootWindow, elementWindow, speed, cancels, scrollIframeInner, finish, cancel } =
      input;
    const viewportRect = getElementViewportRect(el, rootWindow);
    const localRect = el.getBoundingClientRect();
    const needsParent = ScrollHelperService.isRectOutsideViewport(viewportRect, rootWindow);
    const needsIframe = ScrollHelperService.isRectOutsideViewport(localRect, elementWindow);

    if (needsParent) {
      cancels.push(
        ScrollHelperService.scrollWindowToY(
          rootWindow,
          ScrollHelperService.computeScrollTargetForRect(viewportRect, rootWindow),
          speed,
          needsIframe ? scrollIframeInner : finish,
        ),
      );
      return cancel;
    }

    if (needsIframe) {
      scrollIframeInner();
      return cancel;
    }

    finish();
    return cancel;
  }

  private static scrollWindowToY(
    targetWindow: Window,
    targetScrollY: number,
    speed: number,
    onAfter?: () => void,
  ): () => void {
    let cancelled = false;
    let frameId = 0;

    const cancel = (): void => {
      cancelled = true;
      if (frameId) {
        if (globalThis.cancelAnimationFrame) {
          globalThis.cancelAnimationFrame(frameId);
        } else {
          targetWindow.clearTimeout(frameId);
        }
        frameId = 0;
      }
    };

    const finish = (): void => {
      if (cancelled) {
        return;
      }

      targetWindow.scrollTo({ top: targetScrollY, behavior: "auto" });
      onAfter?.();
    };

    if (speed <= 0) {
      finish();
      return cancel;
    }

    const startScrollY = targetWindow.scrollY;
    if (startScrollY === targetScrollY) {
      finish();
      return cancel;
    }

    const startedAt = performance.now();

    const animate = (timestamp: number): void => {
      if (cancelled) {
        return;
      }

      const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / speed));
      const nextScrollY = startScrollY + (targetScrollY - startScrollY) * progress;
      targetWindow.scrollTo({ top: nextScrollY, behavior: "auto" });

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      onAfter?.();
    };

    frameId = requestAnimationFrame(animate);
    return cancel;
  }
}
