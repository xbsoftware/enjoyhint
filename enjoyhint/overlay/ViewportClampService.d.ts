export declare const VIEWPORT_EDGE_MARGIN_PX = 10;
export interface ViewportSize {
    width: number;
    height: number;
}
export declare class ViewportClampService {
    static clampRectToViewport(x: number, y: number, width: number, height: number, viewport: ViewportSize, margin?: number): {
        x: number;
        y: number;
    };
    /** Clamp a top/right/bottom/left box, preserving size (toggle-button formula). */
    static clampBoxToViewport(rect: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }, viewport: ViewportSize, margin: number): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    static clampPointToViewport(x: number, y: number, viewport: ViewportSize, margin?: number): {
        x: number;
        y: number;
    };
    private static clampAxis;
}
//# sourceMappingURL=ViewportClampService.d.ts.map