import { VIEWPORT_EDGE_MARGIN_PX, clampPointToViewport, clampRectToViewport } from "./viewportClamp";

// Below this width, a side-placed label would have to wrap so aggressively
// that shrinking it further stops helping - fall back to the old
// clamp-the-position behavior instead of producing a sliver of a label.
const MIN_SIDE_LABEL_WIDTH_PX = 40;

export type LabelPlacementSide =
  | "right_center"
  | "right_top"
  | "right_bottom"
  | "left_center"
  | "left_top"
  | "left_bottom"
  | "center_top"
  | "center_bottom"
  | "oversized";

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

interface LabelArea {
  name: Exclude<LabelPlacementSide, "oversized">;
  commonArea: number;
  width: number;
  height: number;
}

export function computeLabelPlacement(input: LabelPlacementInput): LabelPlacement {
  const { viewport, label, shape } = input;
  const shapeWidth = getShapeWidth(shape);
  const shapeHeight = getShapeHeight(shape);
  const halfWidth = getPlacementHalfExtent(shape, shapeWidth);
  const halfHeight = getPlacementHalfExtent(shape, shapeHeight);
  const topOffset = shape.centerY - halfHeight;
  const bottomOffset = viewport.height - (shape.centerY + halfHeight);
  const leftOffset = shape.centerX - halfWidth;
  const rightOffset = viewport.width - (shape.centerX + halfWidth);

  const labelShift = viewport.height < 670 ? 130 : 150;
  const labelMargin = viewport.height < 670 ? 0 : 40;
  const labelShiftWithLabelHeight = labelShift + label.height + labelMargin;
  const labelVerticalSpaceRequired =
    viewport.height <= 670 ? labelShiftWithLabelHeight : labelShiftWithLabelHeight + 20;
  const labelHorizontalSpaceRequired = label.width;
  const labelVerticalOffset = halfHeight + labelShift;

  const side = selectLabelSide(
    [
      {
        name: "right_center",
        commonArea: rightOffset * viewport.height,
        width: rightOffset,
        height: viewport.height,
      },
      {
        name: "right_top",
        commonArea: rightOffset * topOffset,
        width: rightOffset,
        height: topOffset,
      },
      {
        name: "right_bottom",
        commonArea: rightOffset * bottomOffset,
        width: rightOffset,
        height: bottomOffset,
      },
      {
        name: "left_center",
        commonArea: leftOffset * viewport.height,
        width: leftOffset,
        height: viewport.height,
      },
      {
        name: "left_top",
        commonArea: leftOffset * topOffset,
        width: leftOffset,
        height: topOffset,
      },
      {
        name: "left_bottom",
        commonArea: leftOffset * bottomOffset,
        width: leftOffset,
        height: bottomOffset,
      },
      {
        name: "center_top",
        commonArea: viewport.width * topOffset,
        width: viewport.width,
        height: topOffset,
      },
      {
        name: "center_bottom",
        commonArea: viewport.width * bottomOffset,
        width: viewport.width,
        height: bottomOffset,
      },
    ],
    labelHorizontalSpaceRequired,
    labelVerticalSpaceRequired,
  );

  const rightPosition = shape.centerX + shapeWidth / 2 + 80;

  // A side placement's X formula (unlike center placements) puts the label
  // right next to the target/arrow. If the label is wider than the space
  // actually available on that side, clamping X back on-screen afterwards
  // would shove the label past the arrow's target-facing endpoint, making
  // the label overlap (and visually swallow) the arrow. Cap the label's
  // effective width to the available space instead - matching what a real
  // browser does when it reflows an absolutely-positioned label that only
  // has `left` set - so the position formula itself keeps the arrow gap
  // intact. The caller is expected to re-measure the label at this width
  // and call computeLabelPlacement again to get final, consistent numbers.
  let effectiveLabelWidth = label.width;
  if (side === "right_center" || side === "right_top" || side === "right_bottom") {
    const available = viewport.width - VIEWPORT_EDGE_MARGIN_PX - rightPosition;
    if (available >= MIN_SIDE_LABEL_WIDTH_PX && available < effectiveLabelWidth) {
      effectiveLabelWidth = available;
    }
  } else if (side === "left_center" || side === "left_top" || side === "left_bottom") {
    const available = shape.centerX - shapeWidth / 2 - 80 - VIEWPORT_EDGE_MARGIN_PX;
    if (available >= MIN_SIDE_LABEL_WIDTH_PX && available < effectiveLabelWidth) {
      effectiveLabelWidth = available;
    }
  }

  const leftPosition = shape.centerX - effectiveLabelWidth - shapeWidth / 2 - 80;
  const centralPosition = viewport.width / 2 - label.width / 2;
  const topPosition = shape.centerY - labelVerticalOffset - label.height;
  const bottomPosition = shape.centerY + labelVerticalOffset;
  const centralVerticalPosition = viewport.height / 2 - labelVerticalSpaceRequired / 2 + 20;

  let labelX = centralPosition;
  let labelY = centralVerticalPosition;
  let xTo = 0;
  let yTo = 0;
  let byTopSide: ArrowOrientation = "hor";

  switch (side) {
    case "center_top":
      labelY = topPosition;
      xTo = shape.centerX;
      yTo = shape.centerY - shapeHeight / 2 - 20;
      break;
    case "center_bottom":
      labelY = bottomPosition;
      xTo = shape.centerX;
      yTo = shape.centerY + shapeHeight / 2 + 20;
      break;
    case "left_center":
      labelY = centralVerticalPosition;
      labelX = leftPosition;
      xTo = shape.centerX - shapeWidth / 2 - 20;
      yTo = shape.centerY;
      byTopSide = "ver";
      break;
    case "left_top":
      labelY = topPosition;
      labelX = leftPosition;
      xTo = shape.centerX - shapeWidth / 2;
      yTo = shape.centerY - 20;
      break;
    case "left_bottom":
      labelY = bottomPosition;
      labelX = leftPosition;
      xTo = shape.centerX - shapeWidth / 2;
      yTo = shape.centerY + 20;
      byTopSide = "ver";
      break;
    case "right_center":
      labelY = centralVerticalPosition;
      labelX = rightPosition;
      xTo = shape.centerX + shapeWidth / 2 + 20;
      yTo = shape.centerY;
      byTopSide = "ver";
      break;
    case "right_top":
      labelY = topPosition;
      labelX = rightPosition;
      xTo = shape.centerX + shapeWidth / 2;
      yTo = shape.centerY - 20;
      break;
    case "right_bottom":
      labelY = bottomPosition;
      labelX = rightPosition;
      xTo = shape.centerX + shapeWidth / 2;
      yTo = shape.centerY + 20;
      byTopSide = "ver";
      break;
    case "oversized":
      break;
  }

  const clampedLabel = clampRectToViewport(labelX, labelY, effectiveLabelWidth, label.height, viewport);
  labelX = clampedLabel.x;
  labelY = clampedLabel.y;

  let xFrom = labelX + effectiveLabelWidth / 2;
  let yFrom = shape.centerY > labelY + label.height / 2 ? labelY + label.height : labelY;

  if (shape.centerY < 0) {
    yTo = 20;
  } else if (shape.centerY > viewport.height + 20) {
    yTo = viewport.height - 20;
  }

  if (shape.centerY >= labelY && shape.centerY <= labelY + label.height) {
    xFrom = shape.centerX > labelX ? labelX + effectiveLabelWidth : labelX;
    yFrom = shape.centerY;
  }

  // xFrom/yFrom attach to the label rect, which can still be pushed outside
  // the viewport margin when the label itself is oversized (see the
  // centerY-within-label branch above), so clamp them defensively.
  //
  // xTo/yTo intentionally are NOT clamped: they mark the actual point on the
  // target the arrow should touch, and forcing them inward (beyond the
  // legacy centerY-only adjustment above) would detach the arrowhead from
  // the target it's supposed to point at.
  const clampedFrom = clampPointToViewport(xFrom, yFrom, viewport);
  xFrom = clampedFrom.x;
  yFrom = clampedFrom.y;

  return {
    side,
    label: { x: labelX, y: labelY, width: effectiveLabelWidth, height: label.height },
    arrow: { xFrom, yFrom, xTo, yTo, byTopSide },
  };
}

function selectLabelSide(
  areas: LabelArea[],
  labelHorizontalSpaceRequired: number,
  labelVerticalSpaceRequired: number,
): LabelPlacementSide {
  let selected: LabelPlacementSide = "oversized";
  const areasPriority = [...areas].sort((area1, area2) => area1.commonArea - area2.commonArea);

  for (const area of areasPriority) {
    if (area.width > labelHorizontalSpaceRequired && area.height > labelVerticalSpaceRequired) {
      selected = area.name;
    }
  }

  return selected;
}

function getShapeWidth(shape: LabelPlacementInput["shape"]): number {
  if (shape.type === "circle") {
    return (shape.radius ?? 0) * 2;
  }

  return shape.width ?? (shape.radius ?? 0) * 2;
}

function getShapeHeight(shape: LabelPlacementInput["shape"]): number {
  if (shape.type === "circle") {
    return (shape.radius ?? 0) * 2;
  }

  return shape.height ?? (shape.radius ?? 0) * 2;
}

function getPlacementHalfExtent(shape: LabelPlacementInput["shape"], size: number): number {
  if (shape.type === "circle") {
    const radius = shape.radius ?? size / 2;
    return Math.round(radius / 2);
  }

  return size / 2;
}
