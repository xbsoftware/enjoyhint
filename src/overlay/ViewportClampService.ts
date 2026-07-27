export const VIEWPORT_EDGE_MARGIN_PX = 10;

export interface ViewportSize {
  width: number;
  height: number;
}

export class ViewportClampService {
  public static clampRectToViewport(
    x: number,
    y: number,
    width: number,
    height: number,
    viewport: ViewportSize,
    margin = VIEWPORT_EDGE_MARGIN_PX,
  ): { x: number; y: number } {
    return {
      x: ViewportClampService.clampAxis(x, width, viewport.width, margin),
      y: ViewportClampService.clampAxis(y, height, viewport.height, margin),
    };
  }

  /** Clamp a top/right/bottom/left box, preserving size (toggle-button formula). */
  public static clampBoxToViewport(
    rect: { top: number; right: number; bottom: number; left: number },
    viewport: ViewportSize,
    margin: number,
  ): { top: number; right: number; bottom: number; left: number } {
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const maxLeft = Math.max(margin, viewport.width - margin - width);
    const maxTop = Math.max(margin, viewport.height - margin - height);
    const left = Math.min(Math.max(margin, rect.left), maxLeft);
    const top = Math.min(Math.max(margin, rect.top), maxTop);
    return { top, right: left + width, bottom: top + height, left };
  }

  public static clampPointToViewport(
    x: number,
    y: number,
    viewport: ViewportSize,
    margin = VIEWPORT_EDGE_MARGIN_PX,
  ): { x: number; y: number } {
    return {
      x: Math.min(Math.max(margin, x), viewport.width - margin),
      y: Math.min(Math.max(margin, y), viewport.height - margin),
    };
  }

  private static clampAxis(
    value: number,
    size: number,
    viewportSize: number,
    margin: number,
  ): number {
    if (size + margin * 2 <= viewportSize) {
      return Math.min(Math.max(margin, value), viewportSize - size - margin);
    }

    return Math.min(Math.max(0, value), Math.max(0, viewportSize - size));
  }
}
