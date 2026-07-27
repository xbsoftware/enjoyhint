export declare const LEGACY_INITIAL_SPOTLIGHT_STATE: SpotlightGeometryState;
export declare const LEGACY_COLLAPSED_SPOTLIGHT_STATE: SpotlightGeometryState;
/** Spotlight update payload used to collapse the hole to a zero-size rect. */
export declare function collapsedSpotlightUpdate(): SvgMaskSpotlightUpdate;
export declare const LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS = 200;
export interface SpotlightGeometryState {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    radius: number;
}
export interface SvgMaskSpotlightUpdate {
    shape: "rect" | "circle";
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number;
    animationFrom?: SpotlightGeometryState;
    animationProgress?: number;
}
export declare function computeTargetSpotlightState(update: SvgMaskSpotlightUpdate): SpotlightGeometryState;
export declare function sampleSpotlightGeometry(from: SpotlightGeometryState, to: SpotlightGeometryState, progress: number): SpotlightGeometryState;
export declare function toSpotlightHoleRect(state: SpotlightGeometryState): {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
};
export declare class SvgMaskSpotlight {
    private readonly svg;
    private readonly fill;
    private readonly maskId;
    private mask?;
    private overlay?;
    private hole?;
    constructor(svg: SVGSVGElement, fill: string, maskId?: string);
    update(update: SvgMaskSpotlightUpdate): SpotlightGeometryState;
    private ensureMask;
    private ensureOverlay;
    private updateHole;
    private getOrCreateDefs;
}
//# sourceMappingURL=SvgMaskSpotlight.d.ts.map