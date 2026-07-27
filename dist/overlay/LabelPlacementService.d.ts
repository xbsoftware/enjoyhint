export type LabelPlacementSide = "right_center" | "right_top" | "right_bottom" | "left_center" | "left_top" | "left_bottom" | "center_top" | "center_bottom" | "oversized";
export type ArrowOrientation = "hor" | "ver";
export interface LabelPlacementInput {
    viewport: {
        width: number;
        height: number;
    };
    label: {
        width: number;
        height: number;
    };
    shape: {
        type: "rect" | "circle";
        centerX: number;
        centerY: number;
        width?: number;
        height?: number;
        radius?: number;
    };
}
export interface LabelPlacement {
    side: LabelPlacementSide;
    label: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    arrow: {
        xFrom: number;
        yFrom: number;
        xTo: number;
        yTo: number;
        byTopSide: ArrowOrientation;
    };
}
export declare class LabelPlacementService {
    static computeLabelPlacement(input: LabelPlacementInput): LabelPlacement;
    private static readonly MIN_SIDE_LABEL_WIDTH_PX;
    private static computePlacementGeometry;
    private static buildLabelAreas;
    private static capSideLabelWidth;
    private static resolveSidePositions;
    private static finalizePlacement;
    private static selectLabelSide;
    private static getShapeWidth;
    private static getShapeHeight;
    private static getPlacementHalfExtent;
}
//# sourceMappingURL=LabelPlacementService.d.ts.map