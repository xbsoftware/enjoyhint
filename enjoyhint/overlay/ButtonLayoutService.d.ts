import { ButtonConfig, TextDirection } from '../types';
export declare const MOBILE_BUTTON_BREAKPOINT_PX = 640;
export declare const MOBILE_NEXT_BUTTON_TEXT = "\u203A";
export declare const MOBILE_PREV_BUTTON_TEXT = "\u2039";
export declare const LEGACY_BUTTON_MIN_WIDTH_PX = 100;
export declare const LEGACY_BUTTON_HEIGHT_PX = 40;
export interface ButtonPositionInput {
    labelX: number;
    labelY: number;
    labelWidth: number;
    labelHeight: number;
    xFrom: number;
    yFrom: number;
    xTo: number;
    yTo: number;
    viewportWidth: number;
    viewportHeight?: number;
    spotlightTop?: number;
    spotlightBottom?: number;
    arrowTop?: number;
    arrowBottom?: number;
}
export interface ButtonRowRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface PositionButtonsParams {
    input: ButtonPositionInput;
    nextButton?: HTMLElement;
    prevButton?: HTMLElement;
    skipButton?: HTMLElement;
    nextVisible: boolean;
    prevVisible: boolean;
    dir: TextDirection;
    nextButtonConfig?: ButtonConfig;
    prevButtonConfig?: ButtonConfig;
    nextDefaultText: string;
    prevDefaultText: string;
}
export declare class ButtonLayoutService {
    /**
     * Positions next/prev/skip buttons relative to the label/arrow and returns
     * the resulting button-row bounding box.
     */
    static positionButtons(params: PositionButtonsParams): ButtonRowRect;
    private static getButtonContentWidth;
    private static getSummaryButtonWidth;
    private static getLayoutButtonWidth;
    private static clampButtonRowToViewport;
    private static setButtonPosition;
    private static revealPositionedButtons;
}
//# sourceMappingURL=ButtonLayoutService.d.ts.map