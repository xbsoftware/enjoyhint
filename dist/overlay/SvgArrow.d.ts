import { ArrowOrientation } from './LabelPlacementService';
export interface SvgArrowRenderInput {
    xFrom?: number;
    yFrom?: number;
    xTo?: number;
    yTo?: number;
    byTopSide?: ArrowOrientation;
    arrowColor?: string;
}
export declare class SvgArrow {
    private readonly svg;
    constructor(svg: SVGSVGElement);
    static clearFrom(root: ParentNode | null | undefined): void;
    render(input: SvgArrowRenderInput): SVGPathElement;
    private setMarkerColor;
    private getValidStroke;
}
//# sourceMappingURL=SvgArrow.d.ts.map