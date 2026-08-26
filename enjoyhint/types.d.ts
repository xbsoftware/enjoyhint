export interface ButtonConfig {
    className?: string;
    text?: string;
}
export type TextDirection = "ltr" | "rtl";
export interface EnjoyHintOptions {
    onStart?: () => void;
    onEnd?: () => void;
    onSkip?: () => void;
    onNext?: () => void;
    /** @deprecated Prefer `nextButton.text`. */
    btnNextText?: string;
    /** @deprecated Prefer `skipButton.text`. */
    btnSkipText?: string;
    nextButton?: ButtonConfig;
    prevButton?: ButtonConfig;
    skipButton?: ButtonConfig;
    backgroundColor?: string;
    /** Tour chrome direction. Independent of the host page. Default `"ltr"`. */
    dir?: TextDirection;
}
export type RequiredCallbacks = Required<Pick<EnjoyHintOptions, "onStart" | "onEnd" | "onSkip" | "onNext">>;
export interface NormalizedStep {
    selector: string;
    event: string;
    eventType?: "auto" | "custom" | "next";
    eventSelector?: string;
    description: string;
    keyCode?: number;
    shape?: "rect" | "circle";
    radius?: number;
    margin?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    scrollAnimationSpeed?: number;
    timeout?: number;
    arrowColor?: string;
    showNext?: boolean;
    showPrev?: boolean;
    showSkip?: boolean;
    nextButton?: ButtonConfig;
    prevButton?: ButtonConfig;
    skipButton?: ButtonConfig;
    onBeforeStart?: () => void | false;
}
export interface SpotlightRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    centerX: number;
    centerY: number;
}
//# sourceMappingURL=types.d.ts.map