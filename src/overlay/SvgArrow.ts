import type { ArrowOrientation } from "./labelPlacement";

const SVG_NS = "http://www.w3.org/2000/svg";
const ARROW_PATH_ID = "enjoyhint_arrpw_line";
const MARKER_PATH_ID = "poliline";
const DEFAULT_ARROW_COLOR = "rgb(255, 255, 255)";

export interface SvgArrowRenderInput {
  xFrom?: number;
  yFrom?: number;
  xTo?: number;
  yTo?: number;
  byTopSide?: ArrowOrientation;
  arrowColor?: string;
}

export class SvgArrow {
  private readonly svg: SVGSVGElement;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
  }

  render(input: SvgArrowRenderInput): SVGPathElement {
    const xFrom = input.xFrom ?? 0;
    const yFrom = input.yFrom ?? 0;
    const xTo = input.xTo ?? 0;
    const yTo = input.yTo ?? 0;
    const byTopSide = input.byTopSide ?? "hor";
    const stroke = this.getValidStroke(input.arrowColor);
    const path = document.createElementNS(SVG_NS, "path");

    this.svg.querySelectorAll(`#${ARROW_PATH_ID}`).forEach((stalePath) => stalePath.remove());
    path.setAttribute("style", `fill: none; stroke: ${stroke}; stroke-width: 3;`);
    path.setAttribute("marker-end", "url(#arrowMarker)");
    path.setAttribute("d", buildArrowPath({ xFrom, yFrom, xTo, yTo, byTopSide }));
    path.setAttribute("id", ARROW_PATH_ID);
    path.setAttribute("pointer-events", "none");
    this.svg.append(path);
    this.setMarkerColor(stroke);

    return path;
  }

  private setMarkerColor(stroke: string): void {
    const markerPath = this.svg.querySelector(`#${MARKER_PATH_ID}`);

    markerPath?.setAttribute("style", `fill: none; stroke: ${stroke}; stroke-width: 2;`);
  }

  private getValidStroke(color: string | undefined): string {
    if (!color) {
      return DEFAULT_ARROW_COLOR;
    }

    const style = this.svg.ownerDocument.createElement("span").style;
    style.color = "";
    style.color = color;

    return style.color === "" ? DEFAULT_ARROW_COLOR : color;
  }
}

function buildArrowPath(input: Required<Omit<SvgArrowRenderInput, "arrowColor">>): string {
  const xCenterArrow = input.byTopSide === "hor" ? input.xTo : input.xFrom;
  const yCenterArrow = input.byTopSide === "hor" ? input.yFrom : input.yTo;

  return `M${input.xFrom},${input.yFrom} Q${xCenterArrow},${yCenterArrow} ${input.xTo},${input.yTo}`;
}
