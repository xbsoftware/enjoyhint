export declare class ScrollHelperService {
    static isRectOutsideViewport(rect: DOMRectReadOnly, targetWindow: Window): boolean;
    static computeScrollTarget(el: Element): number;
    static scrollToElement(el: Element, speed: number, onAfter?: () => void): () => void;
    private static readonly LEGACY_SCROLL_OFFSET;
    private static computeScrollTargetForRect;
    private static scrollCrossFrameElement;
    private static scrollWindowToY;
}
//# sourceMappingURL=ScrollHelperService.d.ts.map