const LEGACY_SCROLL_OFFSET = 200;

export function computeScrollTarget(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY - LEGACY_SCROLL_OFFSET;
}

export function scrollToElement(
  el: Element,
  speed: number,
  onAfter?: () => void,
): () => void {
  const targetScrollY = computeScrollTarget(el);
  let cancelled = false;
  let frameId = 0;

  const cancel = (): void => {
    cancelled = true;
    if (frameId) {
      if (globalThis.cancelAnimationFrame) {
        globalThis.cancelAnimationFrame(frameId);
      } else {
        window.clearTimeout(frameId);
      }
      frameId = 0;
    }
  };

  const finish = (): void => {
    if (cancelled) {
      return;
    }

    window.scrollTo({ top: targetScrollY, behavior: "auto" });
    onAfter?.();
  };

  if (speed <= 0) {
    finish();
    return cancel;
  }

  const startScrollY = window.scrollY;
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
    window.scrollTo({ top: nextScrollY, behavior: "auto" });

    if (progress < 1) {
      frameId = requestAnimationFrame(animate);
      return;
    }

    onAfter?.();
  };

  frameId = requestAnimationFrame(animate);
  return cancel;
}
