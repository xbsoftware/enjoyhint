import { getElementViewportRect, getElementWindow } from "./elementViewport";

const LEGACY_SCROLL_OFFSET = 200;

export function isRectOutsideViewport(rect: DOMRectReadOnly, targetWindow: Window): boolean {
  const viewportHeight =
    targetWindow.innerHeight || targetWindow.document.documentElement.clientHeight;
  return rect.top < 0 || rect.bottom > viewportHeight;
}

export function computeScrollTargetForRect(
  rect: DOMRectReadOnly,
  targetWindow: Window,
): number {
  return rect.top + targetWindow.scrollY - LEGACY_SCROLL_OFFSET;
}

export function computeScrollTarget(el: Element): number {
  const targetWindow = getElementWindow(el);
  return computeScrollTargetForRect(el.getBoundingClientRect(), targetWindow);
}

export function scrollToElement(
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
      scrollWindowToY(
        elementWindow,
        computeScrollTargetForRect(localRect, elementWindow),
        speed,
        finish,
      ),
    );
  };

  if (elementWindow !== rootWindow) {
    const viewportRect = getElementViewportRect(el, rootWindow);
    const localRect = el.getBoundingClientRect();
    const needsParent = isRectOutsideViewport(viewportRect, rootWindow);
    const needsIframe = isRectOutsideViewport(localRect, elementWindow);

    if (needsParent) {
      cancels.push(
        scrollWindowToY(
          rootWindow,
          computeScrollTargetForRect(viewportRect, rootWindow),
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

  const localRect = el.getBoundingClientRect();
  cancels.push(
    scrollWindowToY(
      elementWindow,
      computeScrollTargetForRect(localRect, elementWindow),
      speed,
      finish,
    ),
  );
  return cancel;
}

function scrollWindowToY(
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
