export type DomEventTarget = Element | Document | Window;

export class DomAdapter {
  query(selector: string): Element | null {
    return document.querySelector(selector);
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

  addWindowEvent(eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void {
    return this.addEvent(window, eventName, handler, options);
  }

  addDocumentEvent(eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void {
    return this.addEvent(document, eventName, handler, options);
  }

  getBoundingClientRect(element: Element): DOMRect {
    return element.getBoundingClientRect();
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
}
