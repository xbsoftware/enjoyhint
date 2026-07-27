import { getElementViewportRect } from "./elementViewport";

export type DomEventTarget = Element | Document | Window;

export class DomAdapter {
  query(selector: string): Element | null {
    const match = document.querySelector(selector);
    if (match) {
      return match;
    }

    return this.queryInDescendantIframes(selector, document);
  }

  addEvent(
    target: DomEventTarget,
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): () => void {
    target.addEventListener(eventName, handler, options);
    return () => target.removeEventListener(eventName, handler, options);
  }

  addWindowEvent(
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): () => void {
    return this.addEvent(window, eventName, handler, options);
  }

  addDocumentEvent(
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): () => void {
    return this.addEvent(document, eventName, handler, options);
  }

  getBoundingClientRect(element: Element): DOMRect {
    return getElementViewportRect(element);
  }

  findParentByTagName(element: Element, tagName: string): Element | null {
    const normalizedTagName = tagName.toUpperCase();
    let current: Element | null = element;

    while (current) {
      if (current.tagName === normalizedTagName) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }

  private queryInDescendantIframes(
    selector: string,
    doc: Document,
  ): Element | null {
    const iframes = doc.querySelectorAll("iframe");

    for (const iframe of iframes) {
      const iframeDoc = this.getIframeDocument(iframe);
      if (iframeDoc) {
        const match = iframeDoc.querySelector(selector);
        if (match) {
          return match;
        }

        const nested = this.queryInDescendantIframes(selector, iframeDoc);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  }

  private getIframeDocument(iframe: HTMLIFrameElement): Document | null {
    try {
      return iframe.contentDocument;
    } catch {
      return null;
    }
  }
}
