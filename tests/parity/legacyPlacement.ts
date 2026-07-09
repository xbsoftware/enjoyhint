export interface LegacyButtonPlacementInput {
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
  viewportWidth: number;
  nextWidth: number;
  prevWidth: number;
  skipWidth: number;
  nextVisible: boolean;
  prevVisible: boolean;
  isMobileViewport?: boolean;
}

export interface LegacyButtonPositions {
  prev: { left: number; top: number };
  next: { left: number; top: number };
  skip: { left: number; top: number };
}

const MOBILE_BUTTON_BREAKPOINT_PX = 640;

export function computeLegacyButtonPositions(
  input: LegacyButtonPlacementInput,
): LegacyButtonPositions {
  const summaryButtonWidth = input.nextWidth + input.skipWidth + input.prevWidth + 30;
  let distance = input.labelX - 100;
  let verticalPosition = input.labelY + input.labelHeight + 40;

  if (summaryButtonWidth + input.labelX > input.xTo) {
    distance =
      input.xTo >= input.xFrom ? input.xTo + 20 : input.labelX + input.labelWidth / 2;
  }

  if (summaryButtonWidth + distance > input.viewportWidth || distance < 0) {
    distance = 10;
    verticalPosition =
      input.yFrom < input.yTo ? input.labelY - 80 : input.labelY + input.labelHeight + 40;
  }

  const initialDistance = distance;
  const initialVerticalPosition = verticalPosition;
  const isMobileViewport =
    input.isMobileViewport ?? input.viewportWidth <= MOBILE_BUTTON_BREAKPOINT_PX;

  if (isMobileViewport) {
    distance = 10;
    verticalPosition = 10;
  } else {
    distance = initialDistance;
    verticalPosition = initialVerticalPosition;
  }

  const resolvedPrevWidth = input.prevVisible ? input.prevWidth : 0;
  const resolvedNextWidth = input.nextVisible ? input.nextWidth : 0;

  let nextLeft = distance + resolvedPrevWidth + 10;
  let skipLeft = distance + resolvedPrevWidth + resolvedNextWidth + 20;

  if (!input.nextVisible) {
    skipLeft = distance + resolvedPrevWidth + 10;
  }

  if (!input.prevVisible) {
    nextLeft = distance;
    skipLeft = distance + resolvedNextWidth + 10;
  }

  return {
    prev: { left: distance, top: verticalPosition },
    next: { left: nextLeft, top: verticalPosition },
    skip: { left: skipLeft, top: verticalPosition },
  };
}
