export type DomEventTarget = Element | Document | Window;
export declare class DomAdapter {
    query(selector: string): Element | null;
    addEvent(target: DomEventTarget, eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;
    addWindowEvent(eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;
    addDocumentEvent(eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;
    getBoundingClientRect(element: Element): DOMRect;
    findParentByTagName(element: Element, tagName: string): Element | null;
    private queryInDescendantIframes;
    private getIframeDocument;
}
//# sourceMappingURL=DomAdapter.d.ts.map