import { expect, type Page } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import {
  getLegacyStepRenderDelay,
  LEGACY_LABEL_ARROW_DELAY_MS,
} from "../../src/stepTiming";
import { LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS } from "../../src/overlay/SvgMaskSpotlight";

export const EXAMPLE1_SCROLL_STEP_SPEED_MS = 2500;
export const EXAMPLE1_TARGETLESS_STEP = 0;
export const EXAMPLE1_LARGE_CIRCLE_STEP = 5;
export const EXAMPLE1_SCROLL_STEP = 6;
export const EXAMPLE1_PREV_STEP = 8;
export const EXAMPLE1_CUSTOM_BUTTONS_STEP = 9;
export const EXAMPLE1_ARROW_COLOR_STEP = 10;
export const EXAMPLE1_MARGIN_STEP = 11;
export const EXAMPLE1_AUTO_STEP = 12;
export const EXAMPLE1_CUSTOM_EVENT_STEP = 13;
export const EXAMPLE1_TIMEOUT_STEP = 14;
export const EXAMPLE1_EVENT_SELECTOR_STEP = 15;
export const EXAMPLE1_IFRAME_STEP = 16;
export const EXAMPLE1_SHOW_NEXT_STEP = 17;
export const EXAMPLE1_TOTAL_STEPS = 18;

const __dirname = dirname(fileURLToPath(import.meta.url));
export const rootDir = join(__dirname, "../..");

export interface BlockerHole {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export async function openExample1(page: Page): Promise<void> {
  const url = new URL(pathToFileURL(join(rootDir, "examples/example1.html")).href);
  url.searchParams.set("e2e", "1");
  await page.goto(url.href);
  await page.waitForFunction(() => Boolean(window.__example1Test));
}

export async function startExample1Tour(page: Page): Promise<void> {
  await page.evaluate(() => window.__example1Test.start());
}

export async function goToExample1Step(page: Page, step: number): Promise<void> {
  await page.evaluate((targetStep) => window.__example1Test.goToStep(targetStep), step);
}

export async function getExample1Step(page: Page): Promise<number> {
  return page.evaluate(() => window.__example1Test.getCurrentStep());
}

export async function clickEnjoyHintNext(page: Page): Promise<void> {
  await page.locator(".enjoyhint_next_btn").click();
}

export async function waitForStepPresentation(
  page: Page,
  labelSubstring?: string,
  timeout = 5000,
): Promise<void> {
  await expect(page.locator(".enjoyhint")).toBeVisible();
  await expect(page.locator(".enjoyhint")).not.toHaveClass(/enjoyhint_hide/);
  const label = page.locator(".enjoy_hint_label");
  await expect(label).toBeVisible({ timeout });

  if (labelSubstring) {
    await expect(label).toContainText(labelSubstring, { timeout });
  }

  await page.waitForTimeout(LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS + 50);
}

export async function readBlockerHole(page: Page): Promise<BlockerHole> {
  return page.evaluate(() => {
    const blockers = Array.from(document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events"));
    const top = Number.parseInt(blockers[0]?.style.height ?? "0", 10);
    const bottom = Number.parseInt(blockers[1]?.style.top ?? "0", 10);
    const left = Number.parseInt(blockers[2]?.style.width ?? "0", 10);
    const right = Number.parseInt(blockers[3]?.style.left ?? "0", 10);

    return {
      top,
      left,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
    };
  });
}

export async function readSpotlightHoleWidth(page: Page): Promise<number> {
  return page.evaluate(() => {
    const hole = document.querySelector<SVGRectElement>("rect[data-enjoyhint-spotlight-hole]");
    return Number(hole?.getAttribute("width") ?? "-1");
  });
}

export async function findNeighborClickPointInHole(
  page: Page,
): Promise<{ x: number; y: number; text: string } | null> {
  return page.evaluate(() => {
    const blockers = Array.from(document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events"));
    const hole = {
      top: Number.parseInt(blockers[0]?.style.height ?? "0", 10),
      bottom: Number.parseInt(blockers[1]?.style.top ?? "0", 10),
      left: Number.parseInt(blockers[2]?.style.width ?? "0", 10),
      right: Number.parseInt(blockers[3]?.style.left ?? "0", 10),
    };
    const row = document.querySelector("#mini_button")?.closest("p.bs-component");
    const buttons = Array.from(row?.querySelectorAll("a.btn-primary") ?? []);

    for (const button of buttons) {
      if (button.id === "mini_button") {
        continue;
      }

      const rect = button.getBoundingClientRect();
      const overlapLeft = Math.max(hole.left, rect.left);
      const overlapRight = Math.min(hole.right, rect.right);
      const overlapTop = Math.max(hole.top, rect.top);
      const overlapBottom = Math.min(hole.bottom, rect.bottom);

      if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
        return {
          x: (overlapLeft + overlapRight) / 2,
          y: (overlapTop + overlapBottom) / 2,
          text: button.textContent?.trim() ?? "",
        };
      }
    }

    return null;
  });
}

export function getLegacyScrollStepRenderDelay(scrollSpeed = EXAMPLE1_SCROLL_STEP_SPEED_MS): number {
  return getLegacyStepRenderDelay(scrollSpeed);
}

export function getLegacyScrollStepLabelDelay(scrollSpeed = EXAMPLE1_SCROLL_STEP_SPEED_MS): number {
  return getLegacyStepRenderDelay(scrollSpeed) + LEGACY_LABEL_ARROW_DELAY_MS;
}

declare global {
  interface Window {
    __example1Test: {
      hint: {
        getCurrentStep: () => number;
        reRunScript: (step: number) => void;
        run: () => void;
        trigger: (eventName: string) => void;
      };
      start: () => void;
      goToStep: (step: number) => void;
      getCurrentStep: () => number;
      trigger: (eventName: string) => void;
    };
    __clickedNeighbor?: boolean;
    __stepStartedAt?: number;
  }
}
