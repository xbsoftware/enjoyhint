import { SvgArrowRenderInput } from './SvgArrow';
import { SvgMaskSpotlightUpdate } from './SvgMaskSpotlight';
import { ButtonConfig, TextDirection } from '../types';
import { ButtonPositionInput } from './ButtonLayoutService';
export interface LabelPresentationOptions {
    oversized?: boolean;
    maxWidthPx?: number;
}
type ClickCallback = () => void;
export interface SpotlightRenderOptions {
    immediate?: boolean;
    duration?: number;
}
export declare class OverlayRenderer {
    private readonly dir;
    private readonly container;
    private readonly spotlightFill;
    private root?;
    private spotlightSvg?;
    private svg?;
    private spotlight?;
    private arrow?;
    private labelContainer?;
    private nextButton?;
    private prevButton?;
    private skipButton?;
    private closeButton?;
    private labelToggleButton?;
    private labelHidden;
    private labelHideOffsetPx;
    private buttonRowRect?;
    private eventBlockers?;
    private spotlightAnimationFrame?;
    private nextClick;
    private prevClick;
    private skipClick;
    private nextUserClass?;
    private prevUserClass?;
    private skipUserClass?;
    private nextButtonConfig?;
    private prevButtonConfig?;
    private nextDefaultText;
    private prevDefaultText;
    private nextVisible;
    private prevVisible;
    private spotlightState;
    private labelPresentationTimeoutId?;
    private arrowPresentationTimeoutId?;
    constructor(container?: HTMLElement, spotlightFill?: string, dir?: TextDirection);
    mount(): void;
    show(): void;
    hide(): void;
    clearStepPresentation(): void;
    measureLabel(html: string, maxWidthPx?: number): {
        width: number;
        height: number;
    };
    scheduleLabelPresentation(html: string, position: {
        x: number;
        y: number;
    }, options?: LabelPresentationOptions): void;
    scheduleArrowPresentation(input: SvgArrowRenderInput): void;
    private applyOversizedLabelStyles;
    private prepareLabelLinks;
    cancelLabelArrowTransition(): void;
    prepareForScroll(): void;
    destroy(): void;
    onNextClick(cb: ClickCallback): void;
    onPrevClick(cb: ClickCallback): void;
    onSkipClick(cb: ClickCallback): void;
    configureNextButton(config: ButtonConfig | undefined, defaultText?: string): void;
    configurePrevButton(config: ButtonConfig | undefined, defaultText?: string): void;
    configureSkipButton(config: ButtonConfig | undefined, defaultText?: string): void;
    showNext(): void;
    hideNext(): void;
    showPrev(): void;
    hidePrev(): void;
    showSkip(): void;
    hideSkip(): void;
    getLabelContainer(): HTMLDivElement;
    renderLabel(html: string, position: {
        x: number;
        y: number;
    }): HTMLDivElement;
    renderArrow(input: SvgArrowRenderInput): SVGPathElement;
    positionButtons(input: ButtonPositionInput): void;
    /**
     * Bounding box of the last-positioned next/prev/skip button row, in
     * viewport coordinates. Used by the label overlap toggle to steer clear
     * of the buttons in addition to the label and the spotlight.
     */
    getButtonRowRect(): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    } | undefined;
    configureLabelOverlapToggle(input: {
        overlaps: boolean;
        anchorX: number;
        anchorY: number;
        labelLeft: number;
        labelWidth: number;
        viewportWidth?: number;
        resetHidden: boolean;
    }): void;
    setStepClass(stepNumber: number): void;
    renderSpotlight(update: SvgMaskSpotlightUpdate, options?: SpotlightRenderOptions): void;
    private updateBlockers;
    private updateBlockersFromState;
    private setBlockerRect;
    private getBlockerRect;
    private animateSpotlight;
    private createButton;
    private createLabelToggleButton;
    private setLabelHidden;
    private applyLabelHiddenTransform;
    private clearLabelHiddenTransform;
    private createMarkerDefs;
    private setButtonVisible;
    private collapseSpotlight;
    private configureButton;
    private requestFrame;
    private cancelSpotlightAnimation;
    private readonly stopBlockerClick;
}
export {};
//# sourceMappingURL=OverlayRenderer.d.ts.map