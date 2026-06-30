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
  const halfWidth = shapeWidth / 2;
  const halfHeight = shapeHeight / 2;
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

  const side = selectLabelSide([
    {
      name: "right_center",
      commonArea: rightOffset * viewport.height,
      width: rightOffset,
      height: viewport.height,
    },
    { name: "right_top", commonArea: rightOffset * topOffset, width: rightOffset, height: topOffset },
    { name: "right_bottom", commonArea: rightOffset * bottomOffset, width: rightOffset, height: bottomOffset },
    {
      name: "left_center",
      commonArea: leftOffset * viewport.height,
      width: leftOffset,
      height: viewport.height,
    },
    { name: "left_top", commonArea: leftOffset * topOffset, width: leftOffset, height: topOffset },
    { name: "left_bottom", commonArea: leftOffset * bottomOffset, width: leftOffset, height: bottomOffset },
    { name: "center_top", commonArea: viewport.width * topOffset, width: viewport.width, height: topOffset },
    {
      name: "center_bottom",
      commonArea: viewport.width * bottomOffset,
      width: viewport.width,
      height: bottomOffset,
    },
  ], labelHorizontalSpaceRequired, labelVerticalSpaceRequired);

  const rightPosition = shape.centerX + shapeWidth / 2 + 80;
  const leftPosition = shape.centerX - label.width - shapeWidth / 2 - 80;
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

  let xFrom = labelX + label.width / 2;
  let yFrom = shape.centerY > labelY + label.height / 2 ? labelY + label.height : labelY;

  if (shape.centerY < 0) {
    yTo = 20;
  } else if (shape.centerY > viewport.height + 20) {
    yTo = viewport.height - 20;
  }

  if (shape.centerY >= labelY && shape.centerY <= labelY + label.height) {
    xFrom = shape.centerX > labelX ? labelX + label.width : labelX;
    yFrom = shape.centerY;
  }

  return {
    side,
    label: { x: labelX, y: labelY },
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
