import { NormalizedStep, SpotlightRect } from '../types';
interface SpotlightOffsets {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export interface SpotlightInput {
    left?: number;
    top?: number;
    elementLeft?: number;
    elementTop?: number;
    width: number;
    height: number;
    margin?: number;
    shape?: "rect" | "circle";
    radius?: number;
    right?: number;
    bottom?: number;
    offsets?: SpotlightOffsets;
}
export interface BlockerRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export type BlockerStyles = Record<"top" | "left" | "right" | "bottom", Record<string, string>>;
export declare class GeometryService {
    static computeSpotlightRect(input: SpotlightInput): SpotlightRect;
    /**
     * Runtime spotlight geometry from a normalized step and target rect.
     * Preserves StepController / legacy enjoyhint.js formulas (default rect margin 10).
     */
    static computeStepSpotlight(step: NormalizedStep, targetRect: DOMRect): SpotlightRect;
    static positionBlockers(rect: BlockerRect): BlockerStyles;
    private static readonly LEGACY_DEFAULT_MARGIN;
    private static px;
    private static getElementOrigin;
    private static getSpotlightOffsets;
    private static computeRectSpotlightRect;
    private static computeCircleSpotlightRect;
    private static applyMargin;
}
export {};
//# sourceMappingURL=GeometryService.d.ts.map