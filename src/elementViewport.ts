export function getElementWindow(element: Element): Window {
  return element.ownerDocument?.defaultView ?? window;
}

export function translateRectToViewport(
  rect: DOMRectReadOnly,
  element: Element,
  rootWindow: Window = window,
): DOMRect {
  const elementWindow = getElementWindow(element);
  if (elementWindow === rootWindow) {
    return DOMRect.fromRect(rect);
  }

  let offsetX = 0;
  let offsetY = 0;
  let currentWindow: Window | null = elementWindow;

  while (currentWindow && currentWindow !== rootWindow) {
    const frame: Element | null = currentWindow.frameElement;
    if (!frame) {
      break;
    }

    const frameRect = frame.getBoundingClientRect();
    offsetX += frameRect.left;
    offsetY += frameRect.top;
    currentWindow = frame.ownerDocument?.defaultView ?? null;
  }

  return new DOMRect(rect.left + offsetX, rect.top + offsetY, rect.width, rect.height);
}

export function getElementViewportRect(element: Element, rootWindow: Window = window): DOMRect {
  return translateRectToViewport(element.getBoundingClientRect(), element, rootWindow);
}
