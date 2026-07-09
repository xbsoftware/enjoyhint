import { expect, type Page } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const parityRootDir = join(__dirname, "../..");

export interface RectSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementSnapshot {
  text: string;
  className: string;
  rect: RectSnapshot;
  computed: {
    display: string;
    visibility: string;
    opacity: string;
    pointerEvents: string;
    left: string;
    top: string;
    right: string;
    width: string;
    height: string;
  };
}

export interface PlacementSnapshot {
  currentStep: number | null;
  label: ElementSnapshot | null;
  arrow: {
    d: string | null;
    style: string | null;
    rect: RectSnapshot | null;
  } | null;
  buttons: Record<"next" | "prev" | "skip" | "close", ElementSnapshot | null>;
}

export interface ViewportSize {
  width: number;
  height: number;
  name: string;
}

export const PLACEMENT_VIEWPORTS: ViewportSize[] = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 375, height: 812 },
  { name: "short-mobile", width: 375, height: 500 },
  { name: "short-desktop", width: 1280, height: 500 },
  { name: "narrow-mobile", width: 375, height: 649 },
];

export const PLACEMENT_SCENARIOS = [
  "default",
  "with-prev",
  "circle",
  "low-target",
  "right-edge",
] as const;

export type PlacementScenario = (typeof PLACEMENT_SCENARIOS)[number];

export async function openPlacementFixture(
  page: Page,
  implementation: "legacy" | "new",
  scenario: PlacementScenario,
): Promise<void> {
  const fixtureName =
    implementation === "legacy" ? "legacy-placement-fixture.html" : "new-placement-fixture.html";
  const url = new URL(pathToFileURL(join(parityRootDir, "tests/parity", fixtureName)).href);
  url.searchParams.set("scenario", scenario);
  await page.goto(url.href);
  await page.waitForFunction(() => Boolean(window.__parityReady));
}

export async function startPlacementTour(page: Page, step = 0): Promise<void> {
  await page.evaluate((targetStep) => {
    window.__startTour(targetStep);
  }, step);
  await page.waitForSelector(".enjoyhint:not(.enjoyhint_hide)");
  await page.waitForFunction(() => {
    const label = document.querySelector("#enjoyhint_label, .enjoy_hint_label");
    const next = document.querySelector(".enjoyhint_next_btn");
    return Boolean(
      label &&
        next &&
        window.getComputedStyle(next).visibility === "visible" &&
        next.getBoundingClientRect().width > 0,
    );
  });
  await page.waitForTimeout(200);
}

export async function collectPlacementSnapshot(page: Page): Promise<PlacementSnapshot> {
  return page.evaluate(() => {
    const snapshotElement = (element: Element | null): ElementSnapshot | null => {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const computed = window.getComputedStyle(element);

      return {
        text: element.textContent?.trim() ?? "",
        className:
          element instanceof SVGElement
            ? (element.getAttribute("class") ?? "")
            : (element as HTMLElement).className,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        computed: {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          pointerEvents: computed.pointerEvents,
          left: computed.left,
          top: computed.top,
          right: computed.right,
          width: computed.width,
          height: computed.height,
        },
      };
    };

    const arrow = document.querySelector<SVGPathElement>("#enjoyhint_arrpw_line");

    return {
      currentStep: window.__hint?.getCurrentStep?.() ?? null,
      label: snapshotElement(
        document.querySelector("#enjoyhint_label, .enjoy_hint_label"),
      ),
      arrow: arrow
        ? {
            d: arrow.getAttribute("d"),
            style: arrow.getAttribute("style"),
            rect: snapshotElement(arrow)?.rect ?? null,
          }
        : null,
      buttons: {
        next: snapshotElement(document.querySelector(".enjoyhint_next_btn")),
        prev: snapshotElement(document.querySelector(".enjoyhint_prev_btn")),
        skip: snapshotElement(document.querySelector(".enjoyhint_skip_btn")),
        close: snapshotElement(document.querySelector(".enjoyhint_close_btn")),
      },
    };
  });
}

export function rectsClose(
  actual: RectSnapshot | null,
  expected: RectSnapshot | null,
  tolerance = 2,
): boolean {
  if (!actual || !expected) {
    return actual === expected;
  }

  return (
    Math.abs(actual.x - expected.x) <= tolerance &&
    Math.abs(actual.y - expected.y) <= tolerance &&
    Math.abs(actual.width - expected.width) <= tolerance &&
    Math.abs(actual.height - expected.height) <= tolerance
  );
}

export function isRectInsideViewport(
  rect: RectSnapshot,
  viewport: Pick<ViewportSize, "width" | "height">,
  tolerance = 1,
): boolean {
  return (
    rect.x >= -tolerance &&
    rect.y >= -tolerance &&
    rect.x + rect.width <= viewport.width + tolerance &&
    rect.y + rect.height <= viewport.height + tolerance
  );
}

function rectsOverlap(a: RectSnapshot, b: RectSnapshot): boolean {
  // Inclusive bounds: the arrow's bounding box is the tightest rectangle
  // around a curved SVG path, so the rendered stroke can visually touch a
  // button even when the boxes only just meet at an edge.
  return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
}

function expectRectParityUnlessLegacyOffscreen(
  legacyRect: RectSnapshot | null | undefined,
  newRect: RectSnapshot | null | undefined,
  viewport: Pick<ViewportSize, "width" | "height">,
  tolerance = 2,
  skipPositionCheck = false,
): void {
  expect(newRect).not.toBeNull();
  expect(legacyRect).not.toBeNull();

  if (legacyRect && newRect) {
    expect(isRectInsideViewport(newRect, viewport, tolerance)).toBe(true);

    if (isRectInsideViewport(legacyRect, viewport, tolerance) && !skipPositionCheck) {
      expect(rectsClose(newRect, legacyRect, tolerance)).toBe(true);
    }
  }
}

export function normalizeArrowPath(path: string | null | undefined): string | null {
  if (!path) {
    return path ?? null;
  }

  return path.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi, (value) => {
    const rounded = Math.round(Number.parseFloat(value) * 100) / 100;
    return String(rounded);
  });
}

export function expectPlacementParity(
  legacy: PlacementSnapshot,
  newer: PlacementSnapshot,
  viewport: Pick<ViewportSize, "width" | "height">,
  tolerance = 2,
): void {
  expect(newer.currentStep).toBe(legacy.currentStep);

  expect(newer.label).not.toBeNull();
  expect(legacy.label).not.toBeNull();
  expectRectParityUnlessLegacyOffscreen(
    legacy.label?.rect,
    newer.label?.rect,
    viewport,
    tolerance,
  );

  // Legacy has a real bug where the next/prev/skip button row can land on
  // top of the arrow connecting the label to the target (the buttons sit
  // visually on top of/behind the arrow curve). The new implementation
  // intentionally repositions the whole row to dodge the arrow in that
  // case, so position parity is not expected to hold for any button in the
  // row once one of them collides with the arrow (they always move
  // together). The close button is positioned independently and is exempt.
  const legacyRowOverlapsArrow =
    Boolean(legacy.arrow?.d && legacy.arrow?.rect) &&
    (["next", "prev", "skip"] as const).some((name) => {
      const rect = legacy.buttons[name]?.rect;
      return Boolean(rect && rectsOverlap(rect, legacy.arrow!.rect!));
    });

  for (const buttonName of ["next", "prev", "skip", "close"] as const) {
    const legacyButton = legacy.buttons[buttonName];
    const newButton = newer.buttons[buttonName];

    expect(newButton?.computed.display).toBe(legacyButton?.computed.display);
    expect(newButton?.computed.visibility).toBe(legacyButton?.computed.visibility);

    if (legacyButton?.computed.display === "none") {
      continue;
    }

    const skipPositionCheck = buttonName !== "close" && legacyRowOverlapsArrow;

    expectRectParityUnlessLegacyOffscreen(
      legacyButton?.rect,
      newButton?.rect,
      viewport,
      tolerance,
      skipPositionCheck,
    );

    const legacyOnScreen =
      legacyButton?.rect && isRectInsideViewport(legacyButton.rect, viewport, tolerance);

    if (legacyOnScreen && !skipPositionCheck) {
      expect(newButton?.computed.left).toBe(legacyButton?.computed.left);
      expect(newButton?.computed.top).toBe(legacyButton?.computed.top);
      if (buttonName === "close") {
        expect(newButton?.computed.right).toBe(legacyButton?.computed.right);
      }
    }
  }

  const legacyLabelOnScreen =
    legacy.label?.rect && isRectInsideViewport(legacy.label.rect, viewport, tolerance);
  const legacyArrowOnScreen =
    legacy.arrow?.rect && isRectInsideViewport(legacy.arrow.rect, viewport, tolerance);
  const compareArrowPath = Boolean(legacy.arrow?.d && legacyLabelOnScreen && legacyArrowOnScreen);

  if (compareArrowPath) {
    expect(normalizeArrowPath(newer.arrow?.d)).toBe(normalizeArrowPath(legacy.arrow!.d));
  } else if (!legacy.arrow?.d) {
    expect(newer.arrow?.d ?? null).toBeNull();
  }

  if (newer.arrow?.rect) {
    expect(isRectInsideViewport(newer.arrow.rect, viewport, tolerance)).toBe(true);
  }
}

declare global {
  interface Window {
    __hint?: {
      getCurrentStep?: () => number;
      run?: () => void;
      reRunScript?: (step: number) => void;
    };
    __parityReady?: boolean;
    __startTour: (step?: number) => void;
  }
}
