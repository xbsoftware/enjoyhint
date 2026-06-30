import { expect, test, type Page } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");
const MAX_SCREENSHOT_DIFF_RATIO = 0.002;
const MAX_CHANNEL_DELTA = 8;

interface ParitySnapshot {
  callbacks: string[];
  currentStep: number | null;
  overlay: ElementSnapshot | null;
  label: ElementSnapshot | null;
  arrow: {
    d: string | null;
    style: string | null;
    rect: RectSnapshot | null;
  } | null;
  buttons: Record<"next" | "prev" | "skip" | "close", ElementSnapshot | null>;
  blockers: ElementSnapshot[];
}

interface ElementSnapshot {
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
    width: string;
    height: string;
  };
}

interface RectSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

test.describe("legacy/new browser parity", () => {
  test("matches first-step runtime data and screenshot", async ({
    browser,
  }) => {
    const legacyPage = await browser.newPage({
      viewport: { width: 1024, height: 768 },
    });
    const newPage = await browser.newPage({
      viewport: { width: 1024, height: 768 },
    });

    try {
      await startFixture(legacyPage, "legacy-fixture.html");
      await startFixture(newPage, "new-fixture.html");

      const legacySnapshot = await collectSnapshot(legacyPage);
      const newSnapshot = await collectSnapshot(newPage);
      expect(newSnapshot).toEqual(legacySnapshot);

      const legacyImage = await legacyPage.screenshot({
        animations: "disabled",
      });
      const newImage = await newPage.screenshot({ animations: "disabled" });
      expect(comparePngScreenshots(newImage, legacyImage)).toBeLessThanOrEqual(
        MAX_SCREENSHOT_DIFF_RATIO,
      );

      await legacyPage.locator(".enjoyhint_next_btn").click();
      await newPage.locator(".enjoyhint_next_btn").click();
      await expect.poll(() => currentStep(legacyPage)).toBe(1);
      await expect.poll(() => currentStep(newPage)).toBe(1);
    } finally {
      await legacyPage.close();
      await newPage.close();
    }
  });
});

async function startFixture(page: Page, fixtureName: string): Promise<void> {
  await page.goto(
    pathToFileURL(join(rootDir, "tests/parity", fixtureName)).href,
  );
  await page.waitForFunction(() => Boolean(window.__parityReady));
  await page.evaluate(() => window.__startTour());
  await page.waitForSelector(".enjoyhint");
  await page.waitForFunction(() => {
    const label = document.querySelector("#enjoyhint_label, .enjoy_hint_label");
    const next = document.querySelector(".enjoyhint_next_btn");
    return Boolean(label && next);
  });
  await page.waitForTimeout(900);
}

async function currentStep(page: Page): Promise<number | null> {
  return page.evaluate(() => window.__hint?.getCurrentStep?.() ?? null);
}

async function collectSnapshot(page: Page): Promise<ParitySnapshot> {
  return page.evaluate(() => {
    const snapshotElement = (
      element: Element | null,
    ): ElementSnapshot | null => {
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
          width: computed.width,
          height: computed.height,
        },
      };
    };

    const arrow = document.querySelector<SVGPathElement>(
      "#enjoyhint_arrpw_line",
    );

    return {
      callbacks: window.__callbacks,
      currentStep: window.__hint?.getCurrentStep?.() ?? null,
      overlay: snapshotElement(document.querySelector(".enjoyhint")),
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
      blockers: Array.from(
        document.querySelectorAll(".enjoyhint_disable_events"),
      ).map((element) => snapshotElement(element)!),
    };
  });
}

function comparePngScreenshots(actual: Buffer, expected: Buffer): number {
  const actualPng = PNG.sync.read(actual);
  const expectedPng = PNG.sync.read(expected);
  expect(actualPng.width).toBe(expectedPng.width);
  expect(actualPng.height).toBe(expectedPng.height);

  let differentPixels = 0;
  const totalPixels = actualPng.width * actualPng.height;

  for (let index = 0; index < actualPng.data.length; index += 4) {
    const redDelta = Math.abs(actualPng.data[index] - expectedPng.data[index]);
    const greenDelta = Math.abs(
      actualPng.data[index + 1] - expectedPng.data[index + 1],
    );
    const blueDelta = Math.abs(
      actualPng.data[index + 2] - expectedPng.data[index + 2],
    );
    const alphaDelta = Math.abs(
      actualPng.data[index + 3] - expectedPng.data[index + 3],
    );

    if (
      redDelta > MAX_CHANNEL_DELTA ||
      greenDelta > MAX_CHANNEL_DELTA ||
      blueDelta > MAX_CHANNEL_DELTA ||
      alphaDelta > MAX_CHANNEL_DELTA
    ) {
      differentPixels += 1;
    }
  }

  return differentPixels / totalPixels;
}

declare global {
  interface Window {
    __callbacks: string[];
    __hint?: {
      getCurrentStep?: () => number;
      run?: () => void;
    };
    __parityReady?: boolean;
    __startTour: () => void;
  }
}
