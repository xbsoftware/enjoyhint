import { SpotlightRect, TextDirection } from '../types';
export interface OverlapRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
/**
 * Below this intersection area, a label/spotlight overlap is treated as a
 * harmless edge-touch (e.g. 1px of clamped rounding) rather than a real
 * visual obstruction, so the toggle button doesn't flicker in and out.
 */
export declare const LABEL_OVERLAP_AREA_THRESHOLD_PX2 = 200;
/** Extra clearance added past the label's own width when sliding it off-screen. */
export declare const LABEL_HIDE_MARGIN_PX = 24;
/** Outer diameter (px) of the round toggle button, including its 2px border. */
export declare const LABEL_TOGGLE_BUTTON_SIZE_PX = 36;
export interface ToggleButtonPositionInput {
    /** The current label's own bounding box - always avoided. */
    labelRect: OverlapRect;
    spotlight: SpotlightRect;
    /** Other on-screen elements to steer clear of, e.g. the next/prev/skip button row. */
    avoidRects?: OverlapRect[];
    buttonSize?: number;
    viewport: {
        width: number;
        height: number;
    };
    offsetPx?: number;
    dir?: TextDirection;
}
export declare class LabelOverlapToggleService {
    static computeOverlapArea(a: OverlapRect, b: OverlapRect): number;
    static doesLabelOverlapSpotlight(labelRect: OverlapRect, spotlightRect: OverlapRect, thresholdPx2?: number): boolean;
    /**
     * Finds a spot for the toggle button that clears the spotlight, the label,
     * and any other rects supplied (e.g. the button row) simultaneously.
     *
     * Strategy, in priority order:
     * 1. Just outside the spotlight edge opposite the label
     * 2. The other three spotlight edges
     * 3. Just outside the label's own edges (needed when an oversized
     *    dark-background label covers the spotlight entirely — spotlight-edge
     *    anchors then sit *inside* the label)
     * 4. Viewport corners (close corner skipped — top-right in LTR, top-left in RTL)
     *
     * Among candidates, whichever has the least (ideally zero) overlap wins.
     */
    static computeToggleButtonPosition(input: ToggleButtonPositionInput): {
        x: number;
        y: number;
    };
    /**
     * Distance (px) to translate a label off-screen so it clears the viewport
     * edge, given its current left position and width.
     */
    static computeLabelHideOffsetPx(label: {
        left: number;
        width: number;
    }, options?: {
        marginPx?: number;
        dir?: TextDirection;
        viewportWidth?: number;
    }): number;
    /** Button-center offset: 12px edge gap plus the toggle's approximate outer radius. */
    private static readonly DEFAULT_TOGGLE_BUTTON_OFFSET_PX;
    /** Minimum gap (px) kept between the button and the viewport edge. */
    private static readonly VIEWPORT_CLAMP_MARGIN_PX;
    private static rectFromCenter;
    private static centerOf;
    private static buildToggleCandidates;
    private static pickBestToggleAnchor;
}
//# sourceMappingURL=LabelOverlapToggleService.d.ts.map