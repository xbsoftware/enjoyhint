import { describe, expect, it } from "vitest";
import { SvgArrow } from "../src/overlay/SvgArrow";

function createSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrowMarker");

  const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPath.setAttribute("id", "poliline");
  markerPath.setAttribute("style", "fill:none; stroke:rgb(255,255,255); stroke-width:2");

  marker.append(markerPath);
  defs.append(marker);
  svg.append(defs);
  return svg;
}

describe("SvgArrow", () => {
  it("renders the legacy horizontal quadratic path", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 10, yFrom: 20, xTo: 110, yTo: 220, byTopSide: "hor" });

    const path = svg.querySelector<SVGPathElement>("#enjoyhint_arrpw_line");
    expect(path?.getAttribute("d")).toBe("M10,20 Q110,20 110,220");
    expect(path?.getAttribute("marker-end")).toBe("url(#arrowMarker)");
    expect(path?.getAttribute("style")).toBe("fill: none; stroke: rgb(255, 255, 255); stroke-width: 3;");
  });

  it("renders the legacy vertical quadratic path", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 10, yFrom: 20, xTo: 110, yTo: 220, byTopSide: "ver" });

    const path = svg.querySelector<SVGPathElement>("#enjoyhint_arrpw_line");
    expect(path?.getAttribute("d")).toBe("M10,20 Q10,220 110,220");
  });

  it("replaces all existing arrow paths before rendering", () => {
    const svg = createSvg();
    const firstStalePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    firstStalePath.setAttribute("id", "enjoyhint_arrpw_line");
    firstStalePath.setAttribute("d", "stale-1");
    const secondStalePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    secondStalePath.setAttribute("id", "enjoyhint_arrpw_line");
    secondStalePath.setAttribute("d", "stale-2");
    svg.append(firstStalePath, secondStalePath);

    const arrow = new SvgArrow(svg);
    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor" });

    const paths = svg.querySelectorAll("#enjoyhint_arrpw_line");
    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute("d")).toBe("M0,0 Q100,0 100,100");
  });

  it("applies a valid arrow color to the path and marker", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "tomato" });

    expect(svg.querySelector("#enjoyhint_arrpw_line")?.getAttribute("style")).toBe(
      "fill: none; stroke: tomato; stroke-width: 3;",
    );
    expect(svg.querySelector("#poliline")?.getAttribute("style")).toBe("fill: none; stroke: tomato; stroke-width: 2;");
  });

  it("accepts common browser color syntaxes", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "#fefefe" });
    expect(svg.querySelector("#enjoyhint_arrpw_line")?.getAttribute("style")).toBe(
      "fill: none; stroke: #fefefe; stroke-width: 3;",
    );

    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "rgb(1, 2, 3)" });
    expect(svg.querySelector("#enjoyhint_arrpw_line")?.getAttribute("style")).toBe(
      "fill: none; stroke: rgb(1, 2, 3); stroke-width: 3;",
    );
  });

  it("falls back to white for invalid arrow colors", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "not-a-color" });

    expect(svg.querySelector("#enjoyhint_arrpw_line")?.getAttribute("style")).toBe(
      "fill: none; stroke: rgb(255, 255, 255); stroke-width: 3;",
    );
    expect(svg.querySelector("#poliline")?.getAttribute("style")).toBe(
      "fill: none; stroke: rgb(255, 255, 255); stroke-width: 2;",
    );
  });

  it("resets to white when an invalid color follows a valid render", () => {
    const svg = createSvg();
    const arrow = new SvgArrow(svg);

    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "tomato" });
    arrow.render({ xFrom: 0, yFrom: 0, xTo: 100, yTo: 100, byTopSide: "hor", arrowColor: "not-a-color" });

    expect(svg.querySelector("#enjoyhint_arrpw_line")?.getAttribute("style")).toBe(
      "fill: none; stroke: rgb(255, 255, 255); stroke-width: 3;",
    );
    expect(svg.querySelector("#poliline")?.getAttribute("style")).toBe(
      "fill: none; stroke: rgb(255, 255, 255); stroke-width: 2;",
    );
  });
});
