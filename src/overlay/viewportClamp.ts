export const VIEWPORT_EDGE_MARGIN_PX = 10;

export interface ViewportSize {
  width: number;
  height: number;
}

export function clampRectToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  viewport: ViewportSize,
  margin = VIEWPORT_EDGE_MARGIN_PX,
): { x: number; y: number } {
  return {
    x: clampAxis(x, width, viewport.width, margin),
    y: clampAxis(y, height, viewport.height, margin),
  };
}

export function clampPointToViewport(
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

function clampAxis(value: number, size: number, viewportSize: number, margin: number): number {
  if (size + margin * 2 <= viewportSize) {
    return Math.min(Math.max(margin, value), viewportSize - size - margin);
  }

  return Math.min(Math.max(0, value), Math.max(0, viewportSize - size));
}
