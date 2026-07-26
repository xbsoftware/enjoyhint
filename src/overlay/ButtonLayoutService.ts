import type { ButtonConfig, TextDirection } from "../types";
import { getViewportSize } from "../elementViewport";
import { VIEWPORT_EDGE_MARGIN_PX } from "./ViewportClampService";

export const MOBILE_BUTTON_BREAKPOINT_PX = 640;
export const MOBILE_NEXT_BUTTON_TEXT = "\u203A";
export const MOBILE_PREV_BUTTON_TEXT = "\u2039";
export const LEGACY_BUTTON_MIN_WIDTH_PX = 100;
export const LEGACY_BUTTON_HEIGHT_PX = 40;

export interface ButtonPositionInput {
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
  viewportWidth: number;
  viewportHeight?: number;
  spotlightTop?: number;
  spotlightBottom?: number;
  arrowTop?: number;
  arrowBottom?: number;
}

export interface ButtonRowRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PositionButtonsParams {
  input: ButtonPositionInput;
  nextButton?: HTMLElement;
  prevButton?: HTMLElement;
  skipButton?: HTMLElement;
  nextVisible: boolean;
  prevVisible: boolean;
  dir: TextDirection;
  nextButtonConfig?: ButtonConfig;
  prevButtonConfig?: ButtonConfig;
  nextDefaultText: string;
  prevDefaultText: string;
}

export class ButtonLayoutService {
  /**
   * Positions next/prev/skip buttons relative to the label/arrow and returns
   * the resulting button-row bounding box.
   */
  public static positionButtons(params: PositionButtonsParams): ButtonRowRect {
    const {
      input,
      nextButton,
      prevButton,
      skipButton,
      nextVisible,
      prevVisible,
      dir,
      nextButtonConfig,
      prevButtonConfig,
      nextDefaultText,
      prevDefaultText,
    } = params;

    const nextWidth = ButtonLayoutService.getSummaryButtonWidth(nextButton);
    const prevWidth = ButtonLayoutService.getSummaryButtonWidth(prevButton);
    const skipWidth = ButtonLayoutService.getSummaryButtonWidth(skipButton);
    const summaryButtonWidth = nextWidth + skipWidth + prevWidth + 30;
    let distance = input.labelX - 100;
    let verticalPosition = input.labelY + input.labelHeight + 40;

    if (summaryButtonWidth + input.labelX > input.xTo) {
      distance = input.xTo >= input.xFrom ? input.xTo + 20 : input.labelX + input.labelWidth / 2;
    }

    if (summaryButtonWidth + distance > input.viewportWidth || distance < 0) {
      distance = 10;
      verticalPosition = input.yFrom < input.yTo ? input.labelY - 80 : input.labelY + input.labelHeight + 40;
    }

    const initialDistance = distance;
    const initialVerticalPosition = verticalPosition;
    const isMobileViewport = input.viewportWidth <= MOBILE_BUTTON_BREAKPOINT_PX;

    if (isMobileViewport) {
      distance = 10;
      verticalPosition = 10;
      if (nextButton) {
        nextButton.textContent = MOBILE_NEXT_BUTTON_TEXT;
      }
      if (prevButton) {
        prevButton.textContent = MOBILE_PREV_BUTTON_TEXT;
      }
    } else {
      distance = initialDistance;
      verticalPosition = initialVerticalPosition;
      if (nextButton) {
        nextButton.textContent = nextButtonConfig?.text ?? nextDefaultText;
      }
      if (prevButton) {
        prevButton.textContent = prevButtonConfig?.text ?? prevDefaultText;
      }
    }

    const mobilePrevWidth = ButtonLayoutService.getButtonContentWidth(prevButton);
    const mobileNextWidth = ButtonLayoutService.getButtonContentWidth(nextButton);
    const resolvedPrevWidth = ButtonLayoutService.getLayoutButtonWidth(
      prevButton,
      mobilePrevWidth,
      isMobileViewport,
    );
    const resolvedNextWidth = ButtonLayoutService.getLayoutButtonWidth(
      nextButton,
      mobileNextWidth,
      isMobileViewport,
    );

    let nextLeft = distance + resolvedPrevWidth + 10;
    let skipLeft = distance + resolvedPrevWidth + resolvedNextWidth + 20;

    if (!nextVisible) {
      skipLeft = distance + resolvedPrevWidth + 10;
    }

    if (!prevVisible) {
      nextLeft = distance;
      skipLeft = distance + resolvedNextWidth + 10;
    }

    const viewportHeight = input.viewportHeight ?? getViewportSize().height;
    const rowSkipWidth = ButtonLayoutService.getLayoutButtonWidth(skipButton, 0, isMobileViewport);
    const clampedRow = ButtonLayoutService.clampButtonRowToViewport({
      distance,
      verticalPosition,
      nextLeft,
      skipLeft,
      skipWidth: rowSkipWidth,
      viewportWidth: input.viewportWidth,
      viewportHeight,
      labelY: input.labelY,
      labelHeight: input.labelHeight,
      spotlightTop: input.spotlightTop,
      spotlightBottom: input.spotlightBottom,
      arrowTop: input.arrowTop,
      arrowBottom: input.arrowBottom,
      isMobileViewport,
    });

    if (dir === "rtl") {
      const left = clampedRow.distance;
      const skipW = rowSkipWidth;
      const nextW = resolvedNextWidth;
      const prevW = resolvedPrevWidth;
      const skipL = left;
      let nextL: number;
      let prevL: number;

      if (!prevVisible) {
        // Skip → Next (no Prev) — mirrors LTR when prev is hidden.
        nextL = left + skipW + 10;
        prevL = nextL;
      } else if (!nextVisible) {
        // Skip → Prev (no Next) — mirrors LTR when next is hidden.
        prevL = left + skipW + 10;
        nextL = prevL;
      } else {
        // Skip → Next → Prev
        nextL = left + skipW + 10;
        prevL = left + skipW + nextW + 20;
      }

      const rtlRight = prevVisible
        ? prevL + prevW
        : nextVisible
          ? nextL + nextW
          : skipL + skipW;
      const ltrRight = clampedRow.skipLeft + skipW;
      // Desktop: row width is order-invariant, so unclamped shift is 0; shift
      // re-anchors to the LTR-clamped right edge when clamp moved the row.
      // Mobile: LTR pins the cluster to the top-left (margin 10); RTL pins it
      // to the top-right instead.
      const shift = isMobileViewport
        ? input.viewportWidth - 10 - rtlRight
        : ltrRight - rtlRight;
      const positionedSkipL = skipL + shift;
      const positionedNextL = nextL + shift;
      const positionedPrevL = prevL + shift;

      ButtonLayoutService.setButtonPosition(skipButton, positionedSkipL, clampedRow.verticalPosition);
      ButtonLayoutService.setButtonPosition(nextButton, positionedNextL, clampedRow.verticalPosition);
      ButtonLayoutService.setButtonPosition(prevButton, positionedPrevL, clampedRow.verticalPosition);
      ButtonLayoutService.revealPositionedButtons([nextButton, prevButton, skipButton]);

      return {
        top: clampedRow.verticalPosition,
        bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
        left: Math.min(positionedSkipL, positionedNextL, positionedPrevL),
        right: Math.max(
          positionedSkipL + skipW,
          positionedNextL + nextW,
          positionedPrevL + prevW,
        ),
      };
    }

    ButtonLayoutService.setButtonPosition(prevButton, clampedRow.distance, clampedRow.verticalPosition);
    ButtonLayoutService.setButtonPosition(nextButton, clampedRow.nextLeft, clampedRow.verticalPosition);
    ButtonLayoutService.setButtonPosition(skipButton, clampedRow.skipLeft, clampedRow.verticalPosition);
    ButtonLayoutService.revealPositionedButtons([nextButton, prevButton, skipButton]);

    return {
      top: clampedRow.verticalPosition,
      bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
      left: clampedRow.distance,
      right: clampedRow.skipLeft + rowSkipWidth,
    };
  }

  private static getButtonContentWidth(button: HTMLElement | undefined): number {
    if (!button) {
      return 0;
    }

    if (button.classList.contains("enjoyhint_hide")) {
      const minWidth = Number.parseFloat(window.getComputedStyle(button).minWidth);
      return Number.isFinite(minWidth) && minWidth > 0 ? minWidth : LEGACY_BUTTON_MIN_WIDTH_PX;
    }

    const previousVisibility = button.style.visibility;
    if (previousVisibility === "hidden") {
      button.style.visibility = "visible";
    }

    const style = window.getComputedStyle(button);
    const width =
      button.offsetWidth -
      (Number.parseFloat(style.paddingLeft) || 0) -
      (Number.parseFloat(style.paddingRight) || 0) -
      (Number.parseFloat(style.borderLeftWidth) || 0) -
      (Number.parseFloat(style.borderRightWidth) || 0);

    button.style.visibility = previousVisibility;
    return width > 0 ? width : 0;
  }

  private static getSummaryButtonWidth(button: HTMLElement | undefined): number {
    if (!button) {
      return 0;
    }

    return Math.max(ButtonLayoutService.getButtonContentWidth(button), LEGACY_BUTTON_MIN_WIDTH_PX);
  }

  private static getLayoutButtonWidth(
    button: HTMLElement | undefined,
    mobileWidth: number,
    isMobileViewport: boolean,
  ): number {
    if (!button || button.classList.contains("enjoyhint_hide")) {
      return 0;
    }

    if (isMobileViewport) {
      return mobileWidth;
    }

    return Math.max(ButtonLayoutService.getButtonContentWidth(button), LEGACY_BUTTON_MIN_WIDTH_PX);
  }

  private static clampButtonRowToViewport(input: {
    distance: number;
    verticalPosition: number;
    nextLeft: number;
    skipLeft: number;
    skipWidth: number;
    viewportWidth: number;
    viewportHeight: number;
    labelY: number;
    labelHeight: number;
    spotlightTop?: number;
    spotlightBottom?: number;
    arrowTop?: number;
    arrowBottom?: number;
    isMobileViewport: boolean;
  }): {
    distance: number;
    verticalPosition: number;
    nextLeft: number;
    skipLeft: number;
  } {
    let {
      distance,
      verticalPosition,
      nextLeft,
      skipLeft,
      skipWidth,
      viewportWidth,
      viewportHeight,
      labelY,
      labelHeight,
      spotlightTop,
      spotlightBottom,
      arrowTop,
      arrowBottom,
      isMobileViewport,
    } = input;

    const minTop = VIEWPORT_EDGE_MARGIN_PX;
    const maxTop = Math.max(minTop, viewportHeight - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX);
    const clampTop = (top: number) => Math.min(Math.max(minTop, top), maxTop);
    const overlapWithBand = (top: number, bandStart: number, bandEnd: number) =>
      Math.max(0, Math.min(top + LEGACY_BUTTON_HEIGHT_PX, bandEnd) - Math.max(top, bandStart));
    // The button row must avoid the label, the spotlight target, and the
    // arrow connecting them: a naive "below the label" position can clear
    // both the label and the spotlight individually while still cutting
    // straight through the arrow curve between them.
    const totalOverlap = (top: number) =>
      overlapWithBand(top, labelY, labelY + labelHeight) +
      overlapWithBand(top, spotlightTop ?? 0, spotlightBottom ?? 0) +
      overlapWithBand(top, arrowTop ?? 0, arrowBottom ?? 0);

    verticalPosition = clampTop(verticalPosition);

    // Mobile buttons are pinned chevrons fixed to the top-left corner by
    // design; they must never be pushed elsewhere to dodge the label or
    // spotlight, regardless of what happens to occupy that corner.
    if (!isMobileViewport && totalOverlap(verticalPosition) > 0) {
      // Something occupies this row; try flipping the button row to
      // whichever side of the label/spotlight has clearance instead of
      // rescue-clamping it on top of them.
      const candidates = [
        clampTop(labelY - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
        clampTop(labelY + labelHeight + VIEWPORT_EDGE_MARGIN_PX),
        verticalPosition,
      ];
      if (spotlightTop !== undefined && spotlightBottom !== undefined) {
        candidates.push(
          clampTop(spotlightTop - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
          clampTop(spotlightBottom + VIEWPORT_EDGE_MARGIN_PX),
        );
      }
      if (arrowTop !== undefined && arrowBottom !== undefined) {
        candidates.push(
          clampTop(arrowTop - LEGACY_BUTTON_HEIGHT_PX - VIEWPORT_EDGE_MARGIN_PX),
          clampTop(arrowBottom + VIEWPORT_EDGE_MARGIN_PX),
        );
      }
      verticalPosition = candidates.reduce((best, candidate) =>
        totalOverlap(candidate) < totalOverlap(best) ? candidate : best,
      );
    }

    const rightOverflow = skipLeft + skipWidth - (viewportWidth - VIEWPORT_EDGE_MARGIN_PX);
    if (rightOverflow > 0) {
      distance = Math.max(VIEWPORT_EDGE_MARGIN_PX, distance - rightOverflow);
      nextLeft = Math.max(VIEWPORT_EDGE_MARGIN_PX, nextLeft - rightOverflow);
      skipLeft = Math.max(VIEWPORT_EDGE_MARGIN_PX, skipLeft - rightOverflow);
    }

    if (distance < VIEWPORT_EDGE_MARGIN_PX) {
      const shift = VIEWPORT_EDGE_MARGIN_PX - distance;
      distance = VIEWPORT_EDGE_MARGIN_PX;
      nextLeft += shift;
      skipLeft += shift;
    }

    return { distance, verticalPosition, nextLeft, skipLeft };
  }

  private static setButtonPosition(button: HTMLElement | undefined, left: number, top: number): void {
    if (!button) {
      return;
    }

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
  }

  private static revealPositionedButtons(buttons: Array<HTMLElement | undefined>): void {
    for (const button of buttons) {
      if (button && !button.classList.contains("enjoyhint_hide")) {
        button.style.visibility = "visible";
      }
    }
  }
}
